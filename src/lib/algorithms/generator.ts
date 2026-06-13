import nlp from 'compromise';
import type { GeneratedQuestion } from '$lib/types/quiz';
import { POS_LABELS } from '$lib/types/quiz';

// ─── Datamuse API helpers ─────────────────────────────────────

async function datamuse(
	params: string
): Promise<{ word: string; score: number; tags?: string[] }[]> {
	const url = `https://api.datamuse.com/words?${params}&max=15`;
	const res = await fetch(url);
	if (!res.ok) return [];
	return res.json();
}

async function fetchSynonyms(word: string): Promise<string[]> {
	const data = await datamuse(`rel_syn=${encodeURIComponent(word)}`);
	return data.map((d) => d.word).filter((w) => w.toLowerCase() !== word.toLowerCase());
}

async function fetchAntonyms(word: string): Promise<string[]> {
	const data = await datamuse(`rel_ant=${encodeURIComponent(word)}`);
	return data.map((d) => d.word);
}

async function fetchTriggers(word: string): Promise<string[]> {
	const data = await datamuse(`rel_trg=${encodeURIComponent(word)}`);
	return data.map((d) => d.word);
}

async function fetchMeansLike(word: string): Promise<string[]> {
	const data = await datamuse(`ml=${encodeURIComponent(word)}`);
	return data.map((d) => d.word).filter((w) => w.toLowerCase() !== word.toLowerCase());
}

async function fetchRandomWords(seed: string, count: number): Promise<string[]> {
	const data = await datamuse(`ml=${encodeURIComponent(seed)}&max=${count + 5}`);
	return data
		.map((d) => d.word)
		.filter((w) => w.length > 3 && /^[a-z]+$/.test(w))
		.slice(0, count);
}

// ─── Helpers ──────────────────────────────────────────────────

/** Seed words to kick-start generation — only used to seed API calls */
const SEEDS = [
	'abundant',
	'benevolent',
	'candid',
	'diligent',
	'eloquent',
	'frugal',
	'gregarious',
	'hinder',
	'intrepid',
	'jubilant',
	'keen',
	'lucid',
	'meticulous',
	'novel',
	'obscure',
	'pragmatic',
	'quaint',
	'resilient',
	'succinct',
	'tenacious'
];

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// ─── Question Type Generators ─────────────────────────────────

/** Type 1: "Which word is closest in meaning to X?" (synonym) */
async function generateSynonymQuestion(): Promise<GeneratedQuestion | null> {
	for (let attempt = 0; attempt < 5; attempt++) {
		const target = pickRandom(SEEDS);
		const synonyms = await fetchSynonyms(target);
		if (synonyms.length < 2) continue;

		const correctWord = synonyms[0];
		const distractors = await fetchRandomWords(pickRandom(SEEDS.filter((s) => s !== target)), 3);
		const allDistractors = [...new Set(distractors)].filter(
			(d) =>
				d.toLowerCase() !== correctWord.toLowerCase() && d.toLowerCase() !== target.toLowerCase()
		);
		if (allDistractors.length < 3) continue;

		const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
		const correctIndex = options.findIndex((o) => o === correctWord);

		return {
			sentence: `Which word is closest in meaning to "${target}"?`,
			blankWord: target,
			posTag: 'Vocabulary',
			options,
			correctIndex,
			type: 'synonym',
			difficulty: 'medium'
		};
	}
	return null;
}

/** Type 2: "Which word is the opposite of X?" (antonym) */
async function generateAntonymQuestion(): Promise<GeneratedQuestion | null> {
	for (let attempt = 0; attempt < 5; attempt++) {
		const target = pickRandom(SEEDS);
		const antonyms = await fetchAntonyms(target);
		if (antonyms.length < 1) continue;

		const correctWord = antonyms[0];
		const distractors = await fetchRandomWords(pickRandom(SEEDS.filter((s) => s !== target)), 3);
		const allDistractors = [...new Set(distractors)].filter(
			(d) =>
				d.toLowerCase() !== correctWord.toLowerCase() && d.toLowerCase() !== target.toLowerCase()
		);
		if (allDistractors.length < 3) continue;

		const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
		const correctIndex = options.findIndex((o) => o === correctWord);

		return {
			sentence: `Which word is the opposite of "${target}"?`,
			blankWord: target,
			posTag: 'Vocabulary',
			options,
			correctIndex,
			type: 'synonym',
			difficulty: 'medium'
		};
	}
	return null;
}

/** Type 3: "Which word is most closely associated with X?" (trigger) */
async function generateAssociationQuestion(): Promise<GeneratedQuestion | null> {
	for (let attempt = 0; attempt < 5; attempt++) {
		const target = pickRandom(SEEDS);
		const triggers = await fetchTriggers(target);
		if (triggers.length < 1) continue;

		const correctWord = triggers[0];
		const distractors = await fetchRandomWords(pickRandom(SEEDS.filter((s) => s !== target)), 3);
		const allDistractors = [...new Set(distractors)].filter(
			(d) => d.toLowerCase() !== correctWord.toLowerCase()
		);
		if (allDistractors.length < 3) continue;

		const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
		const correctIndex = options.findIndex((o) => o === correctWord);

		return {
			sentence: `Which word is most closely associated with "${target}"?`,
			blankWord: target,
			posTag: 'Vocabulary',
			options,
			correctIndex,
			type: 'synonym',
			difficulty: 'medium'
		};
	}
	return null;
}

/** Type 4: "Which word has a similar meaning to X?" (means-like) */
async function generateMeansLikeQuestion(): Promise<GeneratedQuestion | null> {
	for (let attempt = 0; attempt < 5; attempt++) {
		const target = pickRandom(SEEDS);
		const similar = await fetchMeansLike(target);
		if (similar.length < 1) continue;

		const correctWord = similar[0];
		const distractors = await fetchRandomWords(pickRandom(SEEDS.filter((s) => s !== target)), 3);
		const allDistractors = [...new Set(distractors)].filter(
			(d) => d.toLowerCase() !== correctWord.toLowerCase()
		);
		if (allDistractors.length < 3) continue;

		const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
		const correctIndex = options.findIndex((o) => o === correctWord);

		return {
			sentence: `Which word has a similar meaning to "${target}"?`,
			blankWord: target,
			posTag: 'Vocabulary',
			options,
			correctIndex,
			type: 'synonym',
			difficulty: 'medium'
		};
	}
	return null;
}

/** Type 5: "Which word means the same as [phrase]?" (phrase-to-word mapping) */
async function generatePhraseQuestion(): Promise<GeneratedQuestion | null> {
	const pairs: [string, string][] = [
		['very large', 'enormous'],
		['very small', 'minuscule'],
		['look quickly', 'glance'],
		['think deeply', 'contemplate'],
		['speak formally', 'address'],
		['make better', 'improve'],
		['break into', 'shatter'],
		['move slowly', 'creep'],
		['come after', 'pursue'],
		['put together', 'assemble']
	];
	const [phrase, correctWord] = pickRandom(pairs);
	const distractors = await fetchRandomWords(pickRandom(SEEDS), 3);
	const allDistractors = [...new Set(distractors)].filter(
		(d) => d.toLowerCase() !== correctWord.toLowerCase()
	);

	const options = shuffle([correctWord, ...allDistractors.slice(0, 3)]);
	const correctIndex = options.findIndex((o) => o === correctWord);

	return {
		sentence: `Which word means the same as "${phrase}"?`,
		blankWord: correctWord,
		posTag: 'Vocabulary',
		options,
		correctIndex,
		type: 'synonym',
		difficulty: 'easy'
	};
}

// ─── Quiz Assembly ────────────────────────────────────────────

async function generateOne(
	gen: () => Promise<GeneratedQuestion | null>
): Promise<GeneratedQuestion | null> {
	for (let i = 0; i < 10; i++) {
		const q = await gen();
		if (q) return q;
	}
	return null;
}

/**
 * Generate a complete quiz of `count` questions (default 20).
 * Every question is fetched live from Datamuse — zero hardcoded quiz content.
 * Distribution: 35% synonym, 20% antonym, 20% association, 15% means-like, 10% phrase.
 */
export async function generateQuiz(count: number = 20): Promise<GeneratedQuestion[]> {
	const questions: GeneratedQuestion[] = [];
	const usedKeys = new Set<string>();

	const generators = [
		{ gen: generateSynonymQuestion, weight: 0.35 },
		{ gen: generateAntonymQuestion, weight: 0.2 },
		{ gen: generateAssociationQuestion, weight: 0.2 },
		{ gen: generateMeansLikeQuestion, weight: 0.15 },
		{ gen: generatePhraseQuestion, weight: 0.1 }
	];

	const targetCounts = generators.map((g) => Math.round(count * g.weight));
	let remaining = count;

	for (let i = 0; i < generators.length; i++) {
		const target = Math.min(targetCounts[i], remaining);
		for (let j = 0; j < target; j++) {
			const q = await generateOne(generators[i].gen);
			if (q) {
				const key = q.sentence + q.options.join('');
				if (!usedKeys.has(key)) {
					usedKeys.add(key);
					questions.push(q);
				}
			}
		}
		remaining = count - questions.length;
	}

	while (questions.length < count) {
		const gen = pickRandom(generators).gen;
		const q = await generateOne(gen);
		if (q) {
			const key = q.sentence + q.options.join('');
			if (!usedKeys.has(key)) {
				usedKeys.add(key);
				questions.push(q);
			}
		}
		if (questions.length === count) break;
	}

	return questions.slice(0, count);
}

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
