/**
 * Seedless Vocabulary Pool
 *
 * Replaces the hardcoded SEEDS array with a dynamic system:
 * 1. Bootstrap: Datamuse `/sug` with random letter prefixes → discover initial words
 * 2. Expand: Datamuse `sp` patterns → more words with frequency data
 * 3. Grow: After quizzes, use `rel_trg` from used words → discover related words
 * 4. Cache: All discovered words stored in svelte-idb
 */

import { db, type VocabEntry } from '$lib/db';

// ─── Type-safe helpers for svelte-idb ─────────────────────────

/** Cast svelte-idb's generic record result to typed array */
function castEntries(raw: Record<string, unknown>[]): VocabEntry[] {
	return raw as unknown as VocabEntry[];
}

async function getAllPool(): Promise<VocabEntry[]> {
	return castEntries(await db.vocabulary_pool.getAll());
}

async function addEntry(entry: VocabEntry): Promise<void> {
	await db.vocabulary_pool.add(entry as unknown as Record<string, unknown>);
}

// ─── Datamuse helpers ─────────────────────────────────────────────

const DATAMUSE_BASE = 'https://api.datamuse.com';

interface DatamuseResult {
	word: string;
	score: number;
	tags?: string[];
	defs?: string[];
	numSyllables?: number;
}

async function datamuseWords(params: string, max = 50): Promise<DatamuseResult[]> {
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

async function datamuseSug(prefix: string, max = 10): Promise<DatamuseResult[]> {
	const url = `${DATAMUSE_BASE}/sug?s=${encodeURIComponent(prefix)}&max=${max}`;
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

// ─── Parsing helpers ─────────────────────────────────────────────

function parseDifficulty(frequency: number): 'easy' | 'medium' | 'hard' {
	if (frequency >= 10) return 'easy';
	if (frequency >= 1) return 'medium';
	return 'hard';
}

function extractTags(tags: string[] = []): {
	posTags: string[];
	pronunciation: string;
	frequency: number;
} {
	const posTags: string[] = [];
	let pronunciation = '';
	let frequency = 0;

	for (const tag of tags) {
		if (tag === 'n') posTags.push('noun');
		else if (tag === 'v') posTags.push('verb');
		else if (tag === 'adj') posTags.push('adjective');
		else if (tag === 'adv') posTags.push('adverb');
		else if (tag === 'u') posTags.push('unknown');
		else if (tag.startsWith('pron:')) pronunciation = tag.slice(5);
		else if (tag.startsWith('f:')) frequency = parseFloat(tag.slice(2));
	}

	return { posTags, pronunciation, frequency };
}

function extractDefinitions(defs: string[] = []): string[] {
	return defs.map((d) => {
		// Datamuse format: "pos\tdefinition" or just "definition"
		const parts = d.split('\t');
		return parts.length > 1 ? parts[1] : parts[0];
	});
}

// ─── Shared: process raw Datamuse results into VocabEntries ──

function resultsToEntries(
	results: DatamuseResult[],
	seen: Set<string>,
	source: VocabEntry['source'],
	maxCount: number
): VocabEntry[] {
	const entries: VocabEntry[] = [];
	for (const r of results) {
		if (entries.length >= maxCount) break;
		const word = r.word.toLowerCase();
		if (seen.has(word) || word.includes(' ') || word.length < 3 || !/^[a-z]+$/.test(word)) {
			continue;
		}
		seen.add(word);

		const { posTags, pronunciation, frequency } = extractTags(r.tags || []);
		const definitions = extractDefinitions(r.defs || []);

		entries.push({
			word,
			difficulty: parseDifficulty(frequency),
			frequency,
			definitions: definitions.length > 0 ? definitions : [],
			posTags: posTags.length > 0 ? posTags : ['unknown'],
			syllables: r.numSyllables ?? 0,
			pronunciation,
			source,
			discoveredAt: Date.now()
		});
	}
	return entries;
}

async function saveEntries(entries: VocabEntry[]): Promise<void> {
	for (const entry of entries) {
		await addEntry(entry);
	}
}

// ─── Bootstrap: discover initial words via /sug ──────────────────

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

function randomPrefix(minLen = 2, maxLen = 4): string {
	const len = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
	let prefix = '';
	for (let i = 0; i < len; i++) {
		prefix += LETTERS[Math.floor(Math.random() * 26)];
	}
	return prefix;
}

/**
 * Bootstrap the vocabulary pool by querying Datamuse /sug with random prefixes.
 * Runs multiple rounds to discover ~N unique words.
 */
async function bootstrapPool(targetCount = 200): Promise<VocabEntry[]> {
	const existing = await getAllPool();
	if (existing.length >= targetCount) {
		return existing;
	}

	const seen = new Set<string>(existing.map((v) => v.word));
	const discovered: VocabEntry[] = [];
	const attempts = Math.max(20, Math.ceil(targetCount / 5));

	for (let i = 0; i < attempts && discovered.length + existing.length < targetCount; i++) {
		const results = await datamuseSug(randomPrefix(), 15);

		// For /sug results, we need to fetch metadata separately
		const entries: VocabEntry[] = [];
		for (const r of results) {
			const word = r.word.toLowerCase();
			if (seen.has(word) || word.includes(' ') || word.length < 3 || !/^[a-z]+$/.test(word)) {
				continue;
			}
			seen.add(word);

			// Fetch metadata for this word
			const meta = await datamuseWords(`sp=${encodeURIComponent(word)}&md=dfprs`, 1);
			const m = meta[0] || r;
			const { posTags, pronunciation, frequency } = extractTags(m.tags || r.tags);
			const definitions = extractDefinitions(m.defs || r.defs);

			entries.push({
				word,
				difficulty: parseDifficulty(frequency),
				frequency,
				definitions: definitions.length > 0 ? definitions : [],
				posTags: posTags.length > 0 ? posTags : ['unknown'],
				syllables: m.numSyllables ?? 0,
				pronunciation,
				source: 'sug',
				discoveredAt: Date.now()
			});
		}
		discovered.push(...entries);
	}

	await saveEntries(discovered);
	return [...existing, ...discovered];
}

// ─── Expand via sp patterns ────────────────────────────────────

/**
 * Expand the pool by querying words matching common letter patterns.
 * This taps into Datamuse's 550K vocabulary via the spell constraint.
 */
async function expandViaPatterns(count = 50): Promise<VocabEntry[]> {
	const patterns = ['?????', '??????', '???????', '???*', '?a??', '?e??', '?o??'];
	const existing = await getAllPool();
	const seen = new Set<string>(existing.map((v) => v.word));
	const discovered: VocabEntry[] = [];

	for (const pattern of patterns) {
		if (discovered.length >= count) break;
		const results = await datamuseWords(`sp=${pattern}&md=dfprs`, 30);
		const entries = resultsToEntries(results, seen, 'bootstrap', count - discovered.length);
		discovered.push(...entries);
	}

	await saveEntries(discovered);
	return [...existing, ...discovered];
}

// ─── Grow via triggers ─────────────────────────────────────────

/**
 * Discover new words related to a given word via Datamuse triggers (rel_trg).
 * Called after a quiz to expand the pool organically.
 */
export async function growViaTriggers(seedWord: string, count = 10): Promise<VocabEntry[]> {
	const existing = await getAllPool();
	const seen = new Set<string>(existing.map((v) => v.word));

	const results = await datamuseWords(
		`rel_trg=${encodeURIComponent(seedWord)}&md=dfprs`,
		count + 5
	);
	const discovered = resultsToEntries(results, seen, 'trigger', count);

	await saveEntries(discovered);
	return [...existing, ...discovered];
}

// ─── Pool querying ─────────────────────────────────────────────

/**
 * Get all words from the pool, optionally filtered by difficulty.
 */
async function getPoolWords(difficulty?: 'easy' | 'medium' | 'hard'): Promise<VocabEntry[]> {
	const all = await getAllPool();
	if (difficulty) {
		return all.filter((w) => w.difficulty === difficulty);
	}
	return all;
}

/**
 * Get a random word from the pool, optionally filtered by difficulty.
 */
export async function getRandomPoolWord(
	difficulty?: 'easy' | 'medium' | 'hard'
): Promise<VocabEntry | null> {
	const pool = await getPoolWords(difficulty);
	if (pool.length === 0) return null;
	return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get multiple random words from the pool.
 */
async function getRandomPoolWords(
	count: number,
	difficulty?: 'easy' | 'medium' | 'hard'
): Promise<VocabEntry[]> {
	const pool = await getPoolWords(difficulty);
	if (pool.length === 0) return [];

	const shuffled = [...pool].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

/**
 * Ensure the pool has at least `minCount` words.
 * Bootstraps and expands if needed.
 */
export async function ensurePool(minCount = 200): Promise<void> {
	const pool = await getAllPool();
	if (pool.length >= minCount) return;

	// Bootstrap via /sug first
	await bootstrapPool(Math.min(minCount, 100));

	// If still not enough, expand via patterns
	const afterBoot = await getAllPool();
	if (afterBoot.length < minCount) {
		await expandViaPatterns(minCount - afterBoot.length);
	}

	const final = await getAllPool();
	if (final.length < minCount) {
		throw new Error(
			'Datamuse is unavailable or returned insufficient vocabulary for quiz generation'
		);
	}
}
