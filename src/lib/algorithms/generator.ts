import type { GeneratedQuestion } from '$lib/types/quiz';
import { POS_LABELS } from '$lib/types/quiz';

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

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

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

function parseDifficulty(frequency: number): Difficulty {
	if (frequency >= 10) return 'easy';
	if (frequency >= 1) return 'medium';
	return 'hard';
}

function difficultyFromResult(result: DatamuseResult): Difficulty {
	let frequency = 0;
	for (const tag of result.tags || []) {
		if (tag.startsWith('f:')) frequency = parseFloat(tag.slice(2));
	}
	return parseDifficulty(frequency);
}

function randomPrefix(minLen = 2, maxLen = 4): string {
	const len = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
	let prefix = '';
	for (let i = 0; i < len; i++) {
		prefix += LETTERS[Math.floor(Math.random() * LETTERS.length)];
	}
	return prefix;
}

async function fetchSeedWord(): Promise<{ word: string; difficulty: Difficulty } | null> {
	for (let attempt = 0; attempt < 8; attempt++) {
		const results = await datamuseWords(`sp=${encodeURIComponent(randomPrefix())}*&md=dfprs`, 20);
		const seed = results.find((result) => result.word.length >= 3 && !result.word.includes(' '));
		if (!seed) continue;
		return {
			word: seed.word,
			difficulty: difficultyFromResult(seed)
		};
	}

	return null;
}

async function fetchSynonyms(word: string): Promise<string[]> {
	const data = await datamuseWords(`rel_syn=${encodeURIComponent(word)}`);
	return data.map((d) => d.word).filter((w) => w.toLowerCase() !== word.toLowerCase());
}

async function fetchAntonyms(word: string): Promise<string[]> {
	const data = await datamuseWords(`rel_ant=${encodeURIComponent(word)}`);
	return data.map((d) => d.word);
}

async function fetchTriggers(word: string): Promise<string[]> {
	const data = await datamuseWords(`rel_trg=${encodeURIComponent(word)}`);
	return data.map((d) => d.word);
}

async function fetchMeansLike(word: string): Promise<string[]> {
	const data = await datamuseWords(`ml=${encodeURIComponent(word)}`);
	return data.map((d) => d.word).filter((w) => w.toLowerCase() !== word.toLowerCase());
}

async function fetchHomophones(word: string): Promise<string[]> {
	const data = await datamuseWords(`rel_hom=${encodeURIComponent(word)}`);
	return data.map((d) => d.word).filter((w) => w.toLowerCase() !== word.toLowerCase());
}

async function fetchAdjectiveNouns(adjective: string): Promise<string[]> {
	const data = await datamuseWords(`rel_jja=${encodeURIComponent(adjective)}`);
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

async function fetchDistractors(word: string, count = 3): Promise<string[]> {
	const synonyms = await fetchSynonyms(word);
	const meansLike = await fetchMeansLike(word);
	const triggers = await fetchTriggers(word);
	const spelled = await datamuseWords(
		`sp=${encodeURIComponent(word.slice(0, 3) || word)}*`,
		count + 5
	);

	const combined = [
		...new Set([...synonyms, ...meansLike, ...triggers, ...spelled.map((d) => d.word)])
	].filter((w) => w.toLowerCase() !== word.toLowerCase());
	if (combined.length >= count) return combined.slice(0, count);

	return combined.slice(0, count);
}

async function fetchMetadata(word: string): Promise<{
	definitions: string[];
	pronunciation: string;
	syllables: number;
	frequency: number;
}> {
	const data = await datamuseWords(`sp=${encodeURIComponent(word)}&md=dfprs`);
	const result = data[0];
	if (!result) return { definitions: [], pronunciation: '', syllables: 0, frequency: 0 };

	const defs: string[] = (result.defs || []).map((d) => {
		const parts = d.split('\t');
		return parts.length > 1 ? parts[1] : parts[0];
	});

	let pronunciation = '';
	let frequency = 0;

	for (const tag of result.tags || []) {
		if (tag.startsWith('pron:')) pronunciation = tag.slice(5);
		else if (tag.startsWith('f:')) frequency = parseFloat(tag.slice(2));
	}

	return {
		definitions: defs,
		pronunciation,
		syllables: result.numSyllables ?? 0,
		frequency
	};
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

/** Enrich a question with Datamuse metadata */
async function enrichQuestion(q: GeneratedQuestion): Promise<GeneratedQuestion> {
	const meta = await fetchMetadata(q.blankWord);
	return {
		...q,
		definition: meta.definitions[0],
		pronunciation: meta.pronunciation,
		syllables: meta.syllables,
		frequency: meta.frequency
	};
}

// ─── Question Type Generators ─────────────────────────────────

/** Type 1: "Which word is closest in meaning to X?" (synonym) */
async function generateSynonymQuestion(): Promise<GeneratedQuestion | null> {
	for (let attempt = 0; attempt < 5; attempt++) {
		const poolWord = await fetchSeedWord();
		if (!poolWord) return null;
		const target = poolWord.word;

		// Seed quality filter: skip if target has no synonyms (avoids wasted API calls)
		const synonyms = await fetchSynonyms(target);
		if (synonyms.length < 1) continue;

		const correctWord = synonyms[0];
		// Request 4 distractors so filtering out correctWord + target still leaves ≥3
		const distractors = await fetchDistractors(target, 4);
		const allDistractors = [...new Set(distractors)].filter(
			(d) =>
				d.toLowerCase() !== correctWord.toLowerCase() && d.toLowerCase() !== target.toLowerCase()
		);
		if (allDistractors.length < 3) continue;

		const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
		const correctIndex = options.findIndex((o) => o === correctWord);

		console.log('[Generator] Synonym:', { target, correctWord, options });

		return enrichQuestion({
			sentence: `Which word is closest in meaning to "${target}"?`,
			blankWord: target,
			posTag: 'Vocabulary',
			options,
			correctIndex,
			type: 'synonym',
			difficulty: poolWord.difficulty
		});
	}
	console.log('[Generator] Synonym FAILED after 5 attempts');
	return null;
}

/** Type 2: "Which word is the opposite of X?" (antonym) */
async function generateAntonymQuestion(): Promise<GeneratedQuestion | null> {
	for (let attempt = 0; attempt < 5; attempt++) {
		const poolWord = await fetchSeedWord();
		if (!poolWord) return null;
		const target = poolWord.word;

		const antonyms = await fetchAntonyms(target);
		if (antonyms.length < 1) continue;

		const correctWord = antonyms[0];
		const distractors = await fetchDistractors(target, 3);
		const allDistractors = [...new Set(distractors)].filter(
			(d) => d.toLowerCase() !== correctWord.toLowerCase()
		);
		if (allDistractors.length < 3) continue;

		const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
		const correctIndex = options.findIndex((o) => o === correctWord);

		console.log('[Generator] Antonym:', { target, correctWord, options });

		return enrichQuestion({
			sentence: `Which word is the opposite of "${target}"?`,
			blankWord: target,
			posTag: 'Vocabulary',
			options,
			correctIndex,
			type: 'antonym',
			difficulty: poolWord.difficulty
		});
	}
	return null;
}

/** Type 3: "Which word has a similar meaning to X?" (means-like) */
async function generateMeansLikeQuestion(): Promise<GeneratedQuestion | null> {
	for (let attempt = 0; attempt < 5; attempt++) {
		const poolWord = await fetchSeedWord();
		if (!poolWord) return null;
		const target = poolWord.word;

		const similar = await fetchMeansLike(target);
		if (similar.length < 1) continue;

		const correctWord = similar[0];
		// Request 4 distractors so filtering out correctWord still leaves ≥3
		const distractors = await fetchDistractors(target, 4);
		const allDistractors = [...new Set(distractors)].filter(
			(d) => d.toLowerCase() !== correctWord.toLowerCase()
		);
		if (allDistractors.length < 3) continue;

		const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
		const correctIndex = options.findIndex((o) => o === correctWord);

		console.log('[Generator] Means-like:', { target, correctWord, options });

		return enrichQuestion({
			sentence: `Which word has a similar meaning to "${target}"?`,
			blankWord: target,
			posTag: 'Vocabulary',
			options,
			correctIndex,
			type: 'means-like',
			difficulty: poolWord.difficulty
		});
	}
	console.log('[Generator] Means-like FAILED after 5 attempts');
	return null;
}

// ─── Cloze Question Generator ────────────────────────────────────

async function generateClozeQuestion(): Promise<GeneratedQuestion | null> {
	for (let attempt = 0; attempt < 10; attempt++) {
		const poolWord = await fetchSeedWord();
		if (!poolWord) return null;
		const target = poolWord.word;

		const phrases = await fetchPhraseCandidates(target);
		const phrase = phrases.find((candidate) => candidate.split(/\s+/).length >= 2);
		if (!phrase) continue;

		const words = phrase.split(/\s+/).filter(Boolean);
		if (words.length < 2) continue;

		const blankableIndices = words
			.map((word, index) => ({ word, index }))
			.filter(({ word }) => word.length >= 3 && !/^[A-Z]/.test(word))
			.map(({ index }) => index);
		if (blankableIndices.length === 0) continue;

		const blankIndex =
			blankableIndices.find((index) => index > 0 && index < words.length - 1) ??
			pickRandom(blankableIndices);
		const correctWord = words[blankIndex];
		const distractors = await fetchDistractors(correctWord, 3);
		const allDistractors = [...new Set(distractors)].filter(
			(d) => d.toLowerCase() !== correctWord.toLowerCase()
		);

		if (allDistractors.length < 3) continue;

		const blankedWords = [...words];
		blankedWords[blankIndex] = '________';
		const blankedPhrase = blankedWords.join(' ');
		const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
		const correctIndex = options.findIndex((o) => o === correctWord);

		console.log('[Generator] Cloze:', { target, phrase, correctWord, options });

		return enrichQuestion({
			sentence: `Which word completes the phrase: "${blankedPhrase}"?`,
			blankWord: correctWord,
			posTag: 'Vocabulary',
			options,
			correctIndex,
			type: 'cloze',
			difficulty: poolWord.difficulty
		});
	}
	console.log('[Generator] Cloze FAILED after 10 attempts');
	return null;
}

// ─── Quiz Assembly ────────────────────────────────────

async function generateOne(
	gen: () => Promise<GeneratedQuestion | null>
): Promise<GeneratedQuestion | null> {
	for (let i = 0; i < 10; i++) {
		const q = await gen();
		if (q) return q;
	}
	return null;
}

/** Distribution weights for each question type */
const GENERATORS: Array<{
	gen: () => Promise<GeneratedQuestion | null>;
	weight: number;
}> = [
	{ gen: generateSynonymQuestion, weight: 0.15 },
	{ gen: generateAntonymQuestion, weight: 0.25 },
	{ gen: generateMeansLikeQuestion, weight: 0.35 },
	{ gen: generateClozeQuestion, weight: 0.25 }
];

/**
 * Generate a complete quiz of `count` questions (default 20).
 * Every question is fetched live from Datamuse — zero hardcoded quiz content.
 *
 * Distribution:
 * - 15% synonym
 * - 25% antonym
 * - 35% means-like
 * - 25% cloze/gap-fill
 */
export async function generateQuiz(count: number = 20): Promise<GeneratedQuestion[]> {
	console.log('[Generator] generateQuiz START:', { count });
	const questions: GeneratedQuestion[] = [];
	const usedKeys = new Set<string>();

	const targetCounts = GENERATORS.map((g) => Math.round(count * g.weight));
	let remaining = count;

	for (let i = 0; i < GENERATORS.length; i++) {
		const target = Math.min(targetCounts[i], remaining);
		for (let j = 0; j < target; j++) {
			const q = await generateOne(GENERATORS[i].gen);
			if (q) {
				const key = q.sentence + q.options.join('');
				if (!usedKeys.has(key)) {
					usedKeys.add(key);
					questions.push(q);
					console.log('[Generator] generateQuiz ADDED (phase 1):', {
						type: q.type,
						blankWord: q.blankWord
					});
				}
			}
		}
		remaining = count - questions.length;
	}

	// Fill any remaining slots
	while (questions.length < count) {
		const gen = pickRandom(GENERATORS).gen;
		const q = await generateOne(gen);
		if (q) {
			const key = q.sentence + q.options.join('');
			if (!usedKeys.has(key)) {
				usedKeys.add(key);
				questions.push(q);
				console.log('[Generator] generateQuiz ADDED (fill phase):', {
					type: q.type,
					blankWord: q.blankWord
				});
			}
		}
		if (questions.length === count) break;
	}

	console.log('[Generator] generateQuiz END:', { requested: count, produced: questions.length });
	return questions.slice(0, count);
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
 * Calculate the overall score from quiz results.
 */
export function calculateScore(questions: GeneratedQuestion[], selectedAnswers: number[]): number {
	const correct = questions.filter((q, i) => selectedAnswers[i] === q.correctIndex).length;
	return Math.round((correct / questions.length) * 100);
}
