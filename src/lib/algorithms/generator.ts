/**
 * Quiz Generator
 *
 * Three-phase approach:
 * - Phase A: Pool-based seed words (massively fewer live Datamuse calls)
 * - Phase B: Frequency-banded sampling for vocabulary size estimation
 * - Phase C: Collocation questions via rel_jja/rel_jjb
 *
 * Still needs live Datamuse calls for:
 *   - Synonyms / antonyms / means-like (distractors)
 *   - Phrase candidates for cloze
 *   - rel_jja/rel_jjb for collocations
 *
 * Saved calls vs old generator:
 *   - fetchSeedWord()         → 0  (pool replaces random prefix queries)
 *   - fetchMetadata()          → 0  (pool has frequency/POS/defs already)
 *   - total saved per question: 8-10 calls
 */

import type { GeneratedQuestion, FrequencyBand } from '$lib/types/quiz';
import { POS_LABELS } from '$lib/types/quiz';
import {
	getRandomPoolWordByBand,
	getFrequencyBand,
	ensurePool,
	ensurePoolBandCoverage
} from './vocab-pool';
import type { VocabEntry } from '$lib/db';
import nlp from 'compromise';

// ─── Datamuse API helpers ─────────────────────────────────────

interface DatamuseResult {
	word: string;
	score: number;
	tags?: string[];
	defs?: string[];
	numSyllables?: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DATAMUSE_BASE = 'https://api.datamuse.com';

async function datamuseWords(params: string, max = 15): Promise<DatamuseResult[]> {
	const url = `${DATAMUSE_BASE}/words?${params}&max=${max}`;
	try {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Datamuse request failed with status ${res.status}`);
		}
		return res.json();
	} catch (error) {
		if (error instanceof Error && error.message.startsWith('Datamuse request failed')) {
			throw error;
		}
		throw new Error(`Datamuse unavailable while requesting ${url}`);
	}
}

// ─── POS Tag Resolution ───────────────────────────────────────

/**
 * Map Datamuse part-of-speech codes (from md=p) to our tag system.
 * Datamuse codes: n=noun, v=verb, adj=adjective, adv=adverb
 */
function datamusePosToTag(posTags: string[]): string | null {
	for (const tag of posTags) {
		if (tag === 'n') return 'Noun';
		if (tag === 'v') return 'Verb';
		if (tag === 'adj') return 'Adjective';
		if (tag === 'adv') return 'Adverb';
	}
	return null;
}

/**
 * Use compromise to determine the part of speech of a word.
 * Falls back to 'Vocabulary' if compromise can't determine it.
 */
function compromisePos(word: string): string | null {
	try {
		const doc = nlp(word);
		const json = doc.json({ terms: { tags: true } });
		const tags: Set<string> = json?.[0]?.terms?.[0]?.tags;
		if (!tags) return null;

		if (tags.has('Verb')) return 'Verb';
		if (tags.has('Noun')) return 'Noun';
		if (tags.has('Adjective')) return 'Adjective';
		if (tags.has('Adverb')) return 'Adverb';
		if (tags.has('Preposition')) return 'Preposition';
		if (tags.has('Conjunction')) return 'Conjunction';
		if (tags.has('Determiner')) return 'Article';
		if (tags.has('Pronoun')) return 'Pronoun';
		return null;
	} catch {
		return null;
	}
}

/**
 * Resolve the best POS tag for a word.
 * Priority: 1) Datamuse metadata (from pool)  2) compromise  3) 'Vocabulary'
 */
function resolvePosTag(seed: VocabEntry, overrideWord?: string): string {
	// First try Datamuse POS from pool metadata
	if (seed.posTags.length > 0) {
		const mapped = datamusePosToTag(seed.posTags);
		if (mapped) return mapped;
	}

	// Fall back to compromise for the actual target word
	const word = overrideWord ?? seed.word;
	const cpPos = compromisePos(word);
	if (cpPos) return cpPos;

	return 'Vocabulary';
}

// ─── Semantic Helpers ─────────────────────────────────────────

async function fetchSynonyms(word: string): Promise<string[]> {
	const data = await datamuseWords(`rel_syn=${encodeURIComponent(word)}`);
	return data.map((d) => d.word).filter((w) => w.toLowerCase() !== word.toLowerCase());
}

async function fetchAntonyms(word: string): Promise<string[]> {
	const data = await datamuseWords(`rel_ant=${encodeURIComponent(word)}`);
	return data.map((d) => d.word);
}

async function fetchMeansLike(word: string): Promise<string[]> {
	const data = await datamuseWords(`ml=${encodeURIComponent(word)}`);
	return data.map((d) => d.word).filter((w) => w.toLowerCase() !== word.toLowerCase());
}

async function fetchTriggers(word: string): Promise<string[]> {
	const data = await datamuseWords(`rel_trg=${encodeURIComponent(word)}`);
	return data.map((d) => d.word);
}

async function fetchPhraseCandidates(seed: string): Promise<string[]> {
	const [meansLike, triggers, topical] = await Promise.all([
		datamuseWords(`ml=${encodeURIComponent(seed)}`, 25),
		datamuseWords(`rel_trg=${encodeURIComponent(seed)}`, 25),
		datamuseWords(`topics=${encodeURIComponent(seed)}`, 25)
	]);

	return [...new Set([...meansLike, ...triggers, ...topical].map((d) => d.word))].filter((word) =>
		word.includes(' ')
	);
}

/**
 * Fetch distractors for a given word.
 * Combines synonyms, means-like, triggers, and spell-alikes.
 * Accepts optional exclude list to avoid using the correct answer as a distractor.
 */
async function fetchDistractors(
	word: string,
	count = 3,
	/** If provided, skip these words in results */
	exclude: string[] = []
): Promise<string[]> {
	const [synonyms, meansLike, triggers, spelled] = await Promise.all([
		fetchSynonyms(word),
		fetchMeansLike(word),
		fetchTriggers(word),
		datamuseWords(`sp=${encodeURIComponent(word.slice(0, 3) || word)}*`, count + 5)
	]);

	const excludeSet = new Set([...exclude, word].map((w) => w.toLowerCase()));

	const combined = [
		...new Set([...synonyms, ...meansLike, ...triggers, ...spelled.map((d) => d.word)])
	].filter((w) => !excludeSet.has(w.toLowerCase()));

	return combined.slice(0, count);
}

// ─── Helpers ──────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Question Generators (seed-based) ─────────────────────────

/**
 * Synonym: "Which word is closest in meaning to X?"
 * First fetched syn is the correct answer; others become distractors.
 */
async function generateSynonymFromSeed(seed: VocabEntry): Promise<GeneratedQuestion | null> {
	const target = seed.word;
	const synonyms = await fetchSynonyms(target);
	if (synonyms.length < 1) return null;

	const correctWord = synonyms[0];
	const distractors = await fetchDistractors(target, 4, [correctWord]);
	const validDistractors = [...new Set(distractors)].filter(
		(d) => d.toLowerCase() !== target.toLowerCase()
	);
	if (validDistractors.length < 3) return null;

	const options = shuffle([correctWord, ...validDistractors.slice(0, 3)]);
	const correctIndex = options.findIndex((o) => o === correctWord);
	const posTag = resolvePosTag(seed, target);
	const band = getFrequencyBand(seed.frequency);

	return {
		sentence: `Which word is closest in meaning to "${target}"?`,
		blankWord: target,
		posTag,
		options,
		correctIndex,
		type: 'synonym',
		difficulty: seed.difficulty,
		band,
		definition: seed.definitions[0],
		pronunciation: seed.pronunciation,
		syllables: seed.syllables,
		frequency: seed.frequency
	};
}

/**
 * Antonym: "Which word is the opposite of X?"
 */
async function generateAntonymFromSeed(seed: VocabEntry): Promise<GeneratedQuestion | null> {
	const target = seed.word;
	const antonyms = await fetchAntonyms(target);
	if (antonyms.length < 1) return null;

	const correctWord = antonyms[0];
	const distractors = await fetchDistractors(target, 3, [correctWord]);
	if (distractors.length < 3) return null;

	const options = shuffle([correctWord, ...distractors.slice(0, 3)]);
	const correctIndex = options.findIndex((o) => o === correctWord);
	const posTag = resolvePosTag(seed, target);
	const band = getFrequencyBand(seed.frequency);

	return {
		sentence: `Which word is the opposite of "${target}"?`,
		blankWord: target,
		posTag,
		options,
		correctIndex,
		type: 'antonym',
		difficulty: seed.difficulty,
		band,
		definition: seed.definitions[0],
		pronunciation: seed.pronunciation,
		syllables: seed.syllables,
		frequency: seed.frequency
	};
}

/**
 * Means-like: "Which word has a similar meaning to X?"
 * Uses Datamuse's ml (means-like) constraint — broader than synonyms.
 */
async function generateMeansLikeFromSeed(seed: VocabEntry): Promise<GeneratedQuestion | null> {
	const target = seed.word;
	const similar = await fetchMeansLike(target);
	if (similar.length < 1) return null;

	const correctWord = similar[0];
	const distractors = await fetchDistractors(target, 4, [correctWord]);
	if (distractors.length < 3) return null;

	const options = shuffle([correctWord, ...distractors.slice(0, 3)]);
	const correctIndex = options.findIndex((o) => o === correctWord);
	const posTag = resolvePosTag(seed, target);
	const band = getFrequencyBand(seed.frequency);

	return {
		sentence: `Which word has a similar meaning to "${target}"?`,
		blankWord: target,
		posTag,
		options,
		correctIndex,
		type: 'means-like',
		difficulty: seed.difficulty,
		band,
		definition: seed.definitions[0],
		pronunciation: seed.pronunciation,
		syllables: seed.syllables,
		frequency: seed.frequency
	};
}

/**
 * Cloze: "Which word completes the phrase?"
 * Uses compromise to identify the POS of the blanked word for real tagging.
 */
async function generateClozeFromSeed(seed: VocabEntry): Promise<GeneratedQuestion | null> {
	const target = seed.word;
	const phrases = await fetchPhraseCandidates(target);
	const phrase = phrases.find((candidate) => candidate.split(/\s+/).length >= 2);
	if (!phrase) return null;

	const words = phrase.split(/\s+/).filter(Boolean);
	if (words.length < 2) return null;

	const blankableIndices = words
		.map((word, index) => ({ word, index }))
		.filter(({ word }) => word.length >= 3 && !/^[A-Z]/.test(word))
		.map(({ index }) => index);
	if (blankableIndices.length === 0) return null;

	const blankIndex =
		blankableIndices.find((index) => index > 0 && index < words.length - 1) ??
		pickRandom(blankableIndices);
	const correctWord = words[blankIndex];

	// Use compromise to determine the POS of the blanked word
	const clozePos = compromisePos(correctWord) || 'Vocabulary';

	const distractors = await fetchDistractors(correctWord, 3, []);
	const validDistractors = [...new Set(distractors)].filter(
		(d) => d.toLowerCase() !== correctWord.toLowerCase()
	);
	if (validDistractors.length < 3) return null;

	const blankedWords = [...words];
	blankedWords[blankIndex] = '________';
	const blankedPhrase = blankedWords.join(' ');
	const options = shuffle([correctWord, ...validDistractors.slice(0, 3)]);
	const correctIndex = options.findIndex((o) => o === correctWord);
	const band = getFrequencyBand(seed.frequency);

	return {
		sentence: `Which word completes the phrase: "${blankedPhrase}"?`,
		blankWord: correctWord,
		posTag: clozePos,
		options,
		correctIndex,
		type: 'cloze',
		difficulty: seed.difficulty,
		band,
		definition: seed.definitions[0],
		pronunciation: seed.pronunciation,
		syllables: seed.syllables,
		frequency: seed.frequency
	};
}

/**
 * Collocation (adjective→noun via rel_jja):
 * "Which noun is commonly described as [adjective]?"
 *
 * From Datamuse docs: rel_jja = "Popular nouns modified by the given adjective"
 * Tests depth of lexical knowledge (knowing which words go together).
 */
async function generateCollocationFromSeed(seed: VocabEntry): Promise<GeneratedQuestion | null> {
	// If seed is an adjective, use rel_jja (nouns modified by this adjective)
	// Otherwise use rel_jjb (adjectives modifying this noun)
	const isAdjective = seed.posTags.includes('adj') || compromisePos(seed.word) === 'Adjective';

	if (isAdjective) {
		const nouns = await datamuseWords(`rel_jja=${encodeURIComponent(seed.word)}&md=f`, 10);
		if (nouns.length < 2) return null;

		const correctWord = nouns[0].word;
		const distractorWords = nouns.slice(1, 4).map((n) => n.word);
		if (distractorWords.length < 3) return null;

		const options = shuffle([correctWord, ...distractorWords]);
		const correctIndex = options.findIndex((o) => o === correctWord);
		const band = getFrequencyBand(seed.frequency);

		return {
			sentence: `Which noun is commonly described as "${seed.word}"?`,
			blankWord: correctWord,
			posTag: 'Collocation',
			options,
			correctIndex,
			type: 'collocation',
			difficulty: seed.difficulty,
			band,
			definition: seed.definitions[0],
			pronunciation: seed.pronunciation,
			frequency: seed.frequency
		};
	} else {
		const adjectives = await datamuseWords(`rel_jjb=${encodeURIComponent(seed.word)}&md=f`, 10);
		if (adjectives.length < 2) return null;

		const correctWord = adjectives[0].word;
		const distractorWords = adjectives.slice(1, 4).map((a) => a.word);
		if (distractorWords.length < 3) return null;

		const options = shuffle([correctWord, ...distractorWords]);
		const correctIndex = options.findIndex((o) => o === correctWord);
		const band = getFrequencyBand(seed.frequency);

		return {
			sentence: `Which adjective is commonly used with "${seed.word}"?`,
			blankWord: correctWord,
			posTag: 'Collocation',
			options,
			correctIndex,
			type: 'collocation',
			difficulty: seed.difficulty,
			band,
			definition: seed.definitions[0],
			pronunciation: seed.pronunciation,
			frequency: seed.frequency
		};
	}
}

// ─── Generator Router ─────────────────────────────────────────

type SeedGenerator = (seed: VocabEntry) => Promise<GeneratedQuestion | null>;

interface GeneratorWeight {
	gen: SeedGenerator;
	weight: number;
}

const GENERATORS: GeneratorWeight[] = [
	{ gen: generateSynonymFromSeed, weight: 0.15 },
	{ gen: generateAntonymFromSeed, weight: 0.2 },
	{ gen: generateMeansLikeFromSeed, weight: 0.25 },
	{ gen: generateClozeFromSeed, weight: 0.25 },
	{ gen: generateCollocationFromSeed, weight: 0.15 }
];

/** Pick a generator by weighted random selection */
function pickGenerator(): SeedGenerator {
	const r = Math.random();
	let cumulative = 0;
	for (const g of GENERATORS) {
		cumulative += g.weight;
		if (r <= cumulative) return g.gen;
	}
	return GENERATORS[GENERATORS.length - 1].gen;
}

const BANDS: FrequencyBand[] = [1, 2, 3, 4, 5];

/**
 * Generate a complete quiz of `count` questions using frequency-banded
 * stratified sampling from the local vocabulary pool.
 *
 * - Seed words come from the pool (zero API calls for seed discovery)
 * - Questions are distributed across 5 frequency bands (~4 per band)
 * - Each question is tagged with its REAL part of speech
 * - Collocation questions test lexical depth (adjective↔noun)
 *
 * Live Datamuse calls are still needed for:
 *   synonyms, antonyms, means-like, phrase candidates, collocation data
 */
export async function generateQuiz(count = 20): Promise<GeneratedQuestion[]> {
	console.log('[Generator] generateQuiz START:', { count });

	// Best-effort pool population — lowers targets on first run so the quiz
	// isn't blocked by a slow bootstrap.
	await ensurePool(200);
	await ensurePoolBandCoverage(10);

	const questions: GeneratedQuestion[] = [];
	const usedSeeds = new Set<string>();
	const allBands = [...BANDS];

	// Phase 1: band-stratified sampling (aim for ~count/5 per band)
	const perBand = Math.max(1, Math.ceil(count / allBands.length));

	for (const band of allBands) {
		let bandCount = 0;
		let attempts = 0;

		while (bandCount < perBand && attempts < 20 && questions.length < count) {
			attempts++;
			const seed = await getRandomPoolWordByBand(band);
			if (!seed || usedSeeds.has(seed.word)) continue;
			usedSeeds.add(seed.word);

			const gen = pickGenerator();
			const q = await gen(seed);
			if (q) {
				questions.push(q);
				bandCount++;
				console.log('[Generator] Added:', {
					type: q.type,
					band,
					word: seed.word,
					posTag: q.posTag
				});
			}
		}
	}

	// Phase 2: fill remaining slots with any available pool word
	if (questions.length < count) {
		console.log('[Generator] Fill phase needed:', {
			have: questions.length,
			need: count
		});

		let fillAttempts = 0;
		while (questions.length < count && fillAttempts < 40) {
			fillAttempts++;
			const band = allBands[Math.floor(Math.random() * allBands.length)];
			const seed = await getRandomPoolWordByBand(band);
			if (!seed || usedSeeds.has(seed.word)) continue;
			usedSeeds.add(seed.word);

			const gen = pickGenerator();
			const q = await gen(seed);
			if (q) {
				questions.push(q);
				console.log('[Generator] Filled:', { type: q.type, band, word: seed.word });
			}
		}
	}

	console.log('[Generator] generateQuiz END:', {
		requested: count,
		produced: questions.length,
		typeDistribution: [...new Set(questions.map((q) => q.type))].map((t) => ({
			type: t,
			count: questions.filter((q) => q.type === t).length
		})),
		posDistribution: [...new Set(questions.map((q) => q.posTag))].map((p) => ({
			posTag: p,
			count: questions.filter((q) => q.posTag === p).length
		}))
	});

	// Return what we have — even a partial quiz is better than a 500 error
	return questions;
}

// ─── Scoring ────────────────────────────────────────────

/**
 * Calculate metrics per part of speech from quiz results.
 */
export function calculateMetrics(
	questions: GeneratedQuestion[],
	selectedAnswers: number[]
): Array<{
	posTag: string;
	label: string;
	totalQuestions: number;
	correctAnswers: number;
	score: number;
}> {
	const tagGroups: Record<string, { total: number; correct: number }> = {};

	for (let i = 0; i < questions.length; i++) {
		const q = questions[i];
		if (!tagGroups[q.posTag]) {
			tagGroups[q.posTag] = { total: 0, correct: 0 };
		}
		tagGroups[q.posTag].total++;
		if (selectedAnswers[i] === q.correctIndex) {
			tagGroups[q.posTag].correct++;
		}
	}

	return Object.entries(tagGroups).map(([posTag, data]) => ({
		posTag,
		label: POS_LABELS[posTag] || posTag,
		totalQuestions: data.total,
		correctAnswers: data.correct,
		score: Math.round((data.correct / data.total) * 100)
	}));
}

/**
 * Calculate per-band metrics for vocabulary size estimation.
 * Each correct answer in a band suggests knowledge of ~200 word families
 * at that frequency level (rough VST-style extrapolation).
 */
export function calculateBandMetrics(
	questions: GeneratedQuestion[],
	selectedAnswers: number[]
): Array<{
	band: FrequencyBand;
	totalQuestions: number;
	correctAnswers: number;
	score: number;
	estimatedWords: number;
}> {
	const bandGroups: Record<number, { total: number; correct: number }> = {};

	for (let i = 0; i < questions.length; i++) {
		const q = questions[i];
		const b = q.band;
		if (!bandGroups[b]) {
			bandGroups[b] = { total: 0, correct: 0 };
		}
		bandGroups[b].total++;
		if (selectedAnswers[i] === q.correctIndex) {
			bandGroups[b].correct++;
		}
	}

	return Object.entries(bandGroups).map(([bandStr, data]) => {
		const band = Number(bandStr) as FrequencyBand;
		const score = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
		// Rough estimate: each band ≈ 2,000 word families
		const wordsPerQuestion = data.total > 0 ? 2000 / data.total : 0;
		const estimatedWords = Math.round(data.correct * wordsPerQuestion);

		return {
			band,
			totalQuestions: data.total,
			correctAnswers: data.correct,
			score,
			estimatedWords
		};
	});
}

/**
 * Calculate the overall score from quiz results.
 */
export function calculateScore(questions: GeneratedQuestion[], selectedAnswers: number[]): number {
	const correct = questions.filter((q, i) => selectedAnswers[i] === q.correctIndex).length;
	return Math.round((correct / questions.length) * 100);
}
