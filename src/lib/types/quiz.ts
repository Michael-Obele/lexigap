/**
 * Types for the quiz generation system
 */

export type QuestionType =
	| 'synonym'
	| 'antonym'
	| 'association'
	| 'means-like'
	| 'phrase'
	| 'cloze'
	| 'homophone'
	| 'adjective-noun';

export interface GeneratedQuestion {
	sentence: string;
	blankWord: string;
	posTag: string;
	options: string[];
	correctIndex: number;
	type: QuestionType;
	difficulty: string;
	/** Optional metadata enriched from Datamuse */
	definition?: string;
	pronunciation?: string;
	syllables?: number;
	frequency?: number; // occurrences per million
}

export interface QuizResult {
	questions: GeneratedQuestion[];
	answers: number[];
	score: number;
	metrics: PartOfSpeechMetric[];
}

export interface PartOfSpeechMetric {
	posTag: string;
	label: string;
	totalQuestions: number;
	correctAnswers: number;
	score: number;
}

export interface ModuleData {
	tag: string;
	title: string;
	description: string;
	icon: string;
	color: string;
	status: 'complete' | 'in-progress' | 'unlocked' | 'locked';
	lessons: LessonData[];
}

export interface LessonData {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	orderIndex: number;
	estimatedMinutes: number;
}

export interface PathProgress {
	modules: ModuleData[];
	totalLessons: number;
	completedLessons: number;
	progress: number;
}

export const POS_LABELS: Record<string, string> = {
	Verb: 'Verbs',
	Noun: 'Nouns',
	Preposition: 'Prepositions',
	Adjective: 'Adjectives',
	Adverb: 'Adverbs',
	Conjunction: 'Conjunctions',
	Article: 'Articles',
	Pronoun: 'Pronouns',
	'Auxiliary Verb': 'Auxiliary Verbs',
	'Past Tense': 'Past Tense Verbs',
	Vocabulary: 'Vocabulary'
};

export const POS_COLORS: Record<string, string> = {
	Verb: 'text-primary',
	Noun: 'text-chart-3',
	Preposition: 'text-chart-2',
	Adjective: 'text-chart-4',
	Adverb: 'text-chart-5',
	Conjunction: 'text-chart-1',
	Article: 'text-chart-2',
	Pronoun: 'text-chart-3',
	Vocabulary: 'text-chart-4'
};
