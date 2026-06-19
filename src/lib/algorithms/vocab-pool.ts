/**
 * Seedless Vocabulary Pool
 *
 * Replaces the hardcoded SEEDS array with a dynamic system:
 * 1. Bootstrap: Datamuse `/sug` with random letter prefixes → discover initial words
 * 2. Expand: Datamuse `sp` patterns → more words with frequency data
 * 3. Grow: After quizzes, use `rel_trg` from used words → discover related words
 * 4. Cache: All discovered words stored in an in-memory store
 *
 * NOTE: Quiz generation runs server-side in SvelteKit remotes, so we use an
 * in-memory Map (not IndexedDB, which is browser-only). The pool persists
 * for the lifetime of the server process.
 */

import type { VocabEntry } from '$lib/db';

// ─── In-memory store ────────────────────────────────────────
//
// IndexedDB (svelte-idb) is browser-only. Since quiz generation runs on the
// server, we use a simple module-level Map. This persists across requests
// within the same server process.

const poolStore = new Map<number, VocabEntry>();
let nextId = 1;

async function getAllPool(): Promise<VocabEntry[]> {
	return Array.from(poolStore.values());
}

async function addEntry(entry: VocabEntry): Promise<void> {
	const id = nextId++;
	poolStore.set(id, { ...entry, id });
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
 *
 * Resilient: individual API failures are caught and skipped — one failed call
 * does not abort the entire bootstrap.
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
		let results: DatamuseResult[];
		try {
			results = await datamuseSug(randomPrefix(), 15);
		} catch {
			// /sug call failed — skip this round and try next prefix
			continue;
		}

		const entries: VocabEntry[] = [];
		for (const r of results) {
			const word = r.word.toLowerCase();
			if (seen.has(word) || word.includes(' ') || word.length < 3 || !/^[a-z]+$/.test(word)) {
				continue;
			}
			seen.add(word);

			// Fetch metadata for this word — wrap in try/catch so a single
			// failed metadata lookup doesn't abort the whole bootstrap
			let frequency = 0;
			let posTags: string[] = [];
			let pronunciation = '';
			let definitions: string[] = [];
			let syllables = 0;

			try {
				const meta = await datamuseWords(`sp=${encodeURIComponent(word)}&md=dfprs`, 1);
				const m = meta[0];
				if (m) {
					const extracted = extractTags(m.tags || []);
					posTags = extracted.posTags;
					pronunciation = extracted.pronunciation;
					frequency = extracted.frequency;
					definitions = extractDefinitions(m.defs || []);
					syllables = m.numSyllables ?? 0;
				}
			} catch {
				// Metadata fetch failed — use sug result data as-is (no freq/pos)
				const extracted = extractTags(r.tags || []);
				posTags = extracted.posTags;
				pronunciation = extracted.pronunciation;
				frequency = extracted.frequency;
				definitions = extractDefinitions(r.defs || []);
			}

			entries.push({
				word,
				difficulty: parseDifficulty(frequency),
				frequency,
				definitions: definitions.length > 0 ? definitions : [],
				posTags: posTags.length > 0 ? posTags : ['unknown'],
				syllables,
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
 * Resilient: individual pattern failures are caught and skipped.
 */
async function expandViaPatterns(count = 50): Promise<VocabEntry[]> {
	const patterns = ['?????', '??????', '???????', '???*', '?a??', '?e??', '?o??'];
	const existing = await getAllPool();
	const seen = new Set<string>(existing.map((v) => v.word));
	const discovered: VocabEntry[] = [];

	for (const pattern of patterns) {
		if (discovered.length >= count) break;
		try {
			const results = await datamuseWords(`sp=${pattern}&md=dfprs`, 30);
			const entries = resultsToEntries(results, seen, 'bootstrap', count - discovered.length);
			discovered.push(...entries);
		} catch {
			// Pattern query failed — skip and try the next one
			continue;
		}
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
 *
 * Resilient: never throws — if Datamuse is unreachable the pool stays
 * at whatever size it has, and callers handle empty-pool scenarios.
 */
export async function ensurePool(minCount = 200): Promise<void> {
	const pool = await getAllPool();
	if (pool.length >= minCount) return;

	// Bootstrap via /sug first
	try {
		await bootstrapPool(Math.min(minCount, 100));
	} catch (e) {
		console.warn('[Pool] bootstrapPool failed:', e);
	}

	// If still not enough, expand via patterns
	const afterBoot = await getAllPool();
	if (afterBoot.length < minCount) {
		try {
			await expandViaPatterns(minCount - afterBoot.length);
		} catch (e) {
			console.warn('[Pool] expandViaPatterns failed:', e);
		}
	}

	const final = await getAllPool();
	if (final.length < minCount) {
		console.warn(
			`[Pool] Only ${final.length}/${minCount} words available. Quiz may have fewer questions.`
		);
	}
}

// ─── Frequency Bands ─────────────────────────────────────────

/**
 * Frequency bands based on Google Books Ngrams occurrences per million.
 * Roughly maps to Nation's Vocabulary Size Test bands.
 *
 * Band 1 (f ≥ 50):   Top ~1K-2K word families  — "the", "time", "water"
 * Band 2 (f ≥ 10):   Top ~3K-5K                 — "context", "principle"
 * Band 3 (f ≥ 3):    Top ~6K-10K                — "tender", "sediment"
 * Band 4 (f ≥ 1):    Top ~11K-14K               — "anecdote", "fortify"
 * Band 5 (f < 1):    Beyond 14K                 — "peripatetic", "xenolith"
 */
export type FrequencyBand = 1 | 2 | 3 | 4 | 5;

export function getFrequencyBand(frequency: number): FrequencyBand {
	if (frequency >= 50) return 1;
	if (frequency >= 10) return 2;
	if (frequency >= 3) return 3;
	if (frequency >= 1) return 4;
	return 5;
}

/**
 * Get all pool words within a specific frequency band.
 */
export async function getPoolWordsByBand(band: FrequencyBand): Promise<VocabEntry[]> {
	const all = await getAllPool();
	return all.filter((w) => getFrequencyBand(w.frequency) === band);
}

/**
 * Get a random word from the pool within a specific frequency band.
 * Returns null if no words exist in that band.
 */
export async function getRandomPoolWordByBand(band: FrequencyBand): Promise<VocabEntry | null> {
	const pool = await getPoolWordsByBand(band);
	if (pool.length === 0) return null;
	return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Ensure the pool has at least `targetPerBand` words in each frequency band.
 * This is critical for band-stratified quiz sampling.
 * Resilient: never throws — bands that can't be filled stay sparse.
 */
export async function ensurePoolBandCoverage(targetPerBand = 30): Promise<void> {
	const all = await getAllPool();

	// Count words per band
	const bandCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
	for (const w of all) {
		const band = getFrequencyBand(w.frequency);
		bandCounts[band] = (bandCounts[band] || 0) + 1;
	}

	// Find bands that need more words
	const neededBands = Object.entries(bandCounts)
		.filter(([_, count]) => count < targetPerBand)
		.map(([band]) => Number(band));

	if (neededBands.length === 0) return;

	// Expand pool to fill sparse bands
	// Use sp patterns with md=f to find words across frequency spectrum
	const seen = new Set<string>(all.map((v) => v.word));
	const discovered: VocabEntry[] = [];

	// Try different word-length patterns to get diverse frequencies
	const patterns = [
		'???',
		'????',
		'?????',
		'??????',
		'???????',
		'????????',
		'*a*',
		'*e*',
		'*i*',
		'*o*',
		'*u*'
	];

	for (const pattern of patterns) {
		if (neededBands.every((b) => (bandCounts[b] || 0) >= targetPerBand)) break;

		const results = await datamuseWords(`sp=${pattern}&md=dfprs`, 40);

		for (const r of results) {
			if (neededBands.every((b) => (bandCounts[b] || 0) >= targetPerBand)) break;

			const word = r.word.toLowerCase();
			if (seen.has(word) || word.includes(' ') || word.length < 2 || !/^[a-z]+$/.test(word)) {
				continue;
			}
			seen.add(word);

			const { posTags, pronunciation, frequency } = extractTags(r.tags || []);
			const definitions = extractDefinitions(r.defs || []);
			const band = getFrequencyBand(frequency);

			// Only add if we need this band
			if (neededBands.includes(band) && (bandCounts[band] || 0) < targetPerBand) {
				discovered.push({
					word,
					difficulty: parseDifficulty(frequency),
					frequency,
					definitions: definitions.length > 0 ? definitions : [],
					posTags: posTags.length > 0 ? posTags : ['unknown'],
					syllables: r.numSyllables ?? 0,
					pronunciation,
					source: 'bootstrap',
					discoveredAt: Date.now()
				});
				bandCounts[band] = (bandCounts[band] || 0) + 1;
			}
		}
	}

	await saveEntries(discovered);
}
