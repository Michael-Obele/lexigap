/**
 * svelte-idb database schema for LexiGap.
 * Provides offline-first IndexedDB storage with Svelte 5 runes reactivity.
 */
import { createReactiveDB } from 'svelte-idb/svelte';

/** A word discovered via Datamuse, stored in the vocabulary pool */
export interface VocabEntry {
	id?: number;
	word: string;
	difficulty: 'easy' | 'medium' | 'hard';
	frequency: number; // occurrences per million (from Datamuse md=f)
	definitions: string[];
	posTags: string[]; // parts of speech: noun, verb, adj, adv
	syllables: number;
	pronunciation: string;
	source: 'bootstrap' | 'sug' | 'trigger' | 'quiz'; // how it was discovered
	discoveredAt: number; // timestamp
}

/** A completed quiz attempt */
export interface QuizResult {
	id?: number;
	completedAt: number;
	score: number;
	totalQuestions: number;
	correctAnswers: number;
	metrics: Array<{
		posTag: string;
		label: string;
		totalQuestions: number;
		correctAnswers: number;
		score: number;
	}>;
	/** True if this result has been synced to the server */
	synced: boolean;
	/** The server-side quiz_result id after sync */
	serverId?: string;
}

/** Individual answer within a quiz */
export interface QuizAnswer {
	id?: number;
	quizResultId: number; // FK to QuizResult.id
	questionIndex: number;
	sentence: string;
	blankWord: string;
	posTag: string;
	options: string[];
	correctIndex: number;
	selectedIndex: number;
	isCorrect: boolean;
}

/** Activity log entry for streak tracking */
export interface ActivityEntry {
	id?: number;
	timestamp: number;
	type: 'assessment' | 'lesson' | 'review' | 'login';
	description: string;
	metadata?: Record<string, unknown>;
}

/** User preferences stored locally */
export interface UserPreferences {
	id?: number;
	key: string;
	value: unknown;
}

export const db = createReactiveDB({
	name: 'lexigap',
	version: 1,
	stores: {
		vocabulary_pool: {
			keyPath: 'id',
			autoIncrement: true
		},
		quiz_results: {
			keyPath: 'id',
			autoIncrement: true
		},
		quiz_answers: {
			keyPath: 'id',
			autoIncrement: true
		},
		activity_log: {
			keyPath: 'id',
			autoIncrement: true
		},
		user_preferences: {
			keyPath: 'id',
			autoIncrement: true
		}
	}
});
