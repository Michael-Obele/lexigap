import { POS_LABELS, POS_COLORS, type ModuleData, type PathProgress } from '$lib/types/quiz';

/**
 * Default lessons that map to POS tags.
 * Each tag has a sequence of lessons.
 */
const DEFAULT_LESSONS: Record<
	string,
	{ title: string; description: string; order: number; minutes: number }[]
> = {
	Verb: [
		{
			title: 'Introduction to Verbs',
			description: 'Learn what verbs are and how they function in sentences.',
			order: 0,
			minutes: 5
		},
		{
			title: 'Past Tense Verbs',
			description: 'Master regular and irregular past tense verb forms.',
			order: 1,
			minutes: 8
		},
		{
			title: 'Present Tense Verbs',
			description: 'Understand simple present, present continuous, and present perfect.',
			order: 2,
			minutes: 8
		},
		{
			title: 'Future Tense Verbs',
			description: 'Learn to express future actions using will, going to, and present tense.',
			order: 3,
			minutes: 7
		},
		{
			title: 'Subject-Verb Agreement',
			description: 'Ensure verbs match their subjects in number and person.',
			order: 4,
			minutes: 6
		}
	],
	Preposition: [
		{
			title: 'Common Prepositions',
			description: 'Learn the most frequently used prepositions in English.',
			order: 0,
			minutes: 5
		},
		{
			title: 'Prepositions of Time',
			description: 'Master in, on, at, and other time-related prepositions.',
			order: 1,
			minutes: 7
		},
		{
			title: 'Prepositions of Place',
			description: 'Understand spatial prepositions like under, over, between.',
			order: 2,
			minutes: 7
		},
		{
			title: 'Prepositions in Phrasal Verbs',
			description: 'Common verb-preposition combinations and their meanings.',
			order: 3,
			minutes: 8
		}
	],
	Noun: [
		{
			title: 'Noun Basics',
			description: 'Identify and use common and proper nouns correctly.',
			order: 0,
			minutes: 5
		},
		{
			title: 'Plural Forms',
			description: 'Master regular and irregular plural noun forms.',
			order: 1,
			minutes: 6
		},
		{
			title: 'Countable & Uncountable Nouns',
			description: 'Understand the difference between countable and uncountable nouns.',
			order: 2,
			minutes: 7
		},
		{
			title: 'Articles with Nouns',
			description: 'Learn when to use a, an, and the with different types of nouns.',
			order: 3,
			minutes: 7
		}
	],
	Adjective: [
		{
			title: 'Adjective Basics',
			description: 'Learn how adjectives describe and modify nouns.',
			order: 0,
			minutes: 5
		},
		{
			title: 'Comparative Adjectives',
			description: 'Master comparative forms to compare two things.',
			order: 1,
			minutes: 7
		},
		{
			title: 'Superlative Adjectives',
			description: 'Learn superlative forms to describe extremes.',
			order: 2,
			minutes: 7
		},
		{
			title: 'Adjective Order',
			description: 'Understand the correct order of multiple adjectives before a noun.',
			order: 3,
			minutes: 6
		}
	],
	Adverb: [
		{
			title: 'Adverb Basics',
			description: 'Learn how adverbs modify verbs, adjectives, and other adverbs.',
			order: 0,
			minutes: 5
		},
		{
			title: 'Adverbs of Frequency',
			description: 'Master always, often, sometimes, rarely, never and their placement.',
			order: 1,
			minutes: 6
		},
		{
			title: 'Adverbs of Manner',
			description: 'Learn how to describe the way an action is performed.',
			order: 2,
			minutes: 6
		},
		{
			title: 'Adverb Position',
			description: 'Understand where to place adverbs in sentences for clarity.',
			order: 3,
			minutes: 7
		}
	]
};

/**
 * Generate a personalized learning path from quiz metrics.
 * Lesson modules are ordered by lowest score first.
 */
export function generateLearningPath(
	metrics: Array<{ posTag: string; score: number }>
): { tag: string; score: number; status: 'complete' | 'unlocked' | 'locked' }[] {
	// Sort by score ascending (worst performers first)
	const sorted = [...metrics].sort((a, b) => a.score - b.score);

	// Determine which modules are unlocked
	// The first one is always unlocked, rest are locked until previous is completed
	return sorted.map((m, i) => ({
		tag: m.posTag,
		score: m.score,
		status: i === 0 ? ('unlocked' as const) : ('locked' as const)
	}));
}

/**
 * Build the full path progress object for a user.
 */
export function buildPathProgress(
	completedTags: string[],
	inProgressTag: string | null,
	metrics: Array<{ posTag: string; score: number }>
): ModuleData[] {
	const path = generateLearningPath(metrics);

	return path.map((item) => {
		const isCompleted = completedTags.includes(item.tag);
		const isInProgress = inProgressTag === item.tag;

		const lessons = (DEFAULT_LESSONS[item.tag] || []).map((l, i) => ({
			id: `${item.tag}-${l.order}`,
			title: l.title,
			description: l.description,
			completed: isCompleted,
			orderIndex: l.order,
			estimatedMinutes: l.minutes
		}));

		let status: ModuleData['status'] = 'locked';
		if (isCompleted) status = 'complete';
		else if (isInProgress) status = 'in-progress';
		else if (item.status === 'unlocked') status = 'unlocked';

		return {
			tag: item.tag,
			title: POS_LABELS[item.tag] || item.tag,
			description: `Score: ${item.score}%. ${isCompleted ? 'All lessons completed.' : `${lessons.length} lessons to complete.`}`,
			icon: POS_LABELS[item.tag] || item.tag,
			color: POS_COLORS[item.tag] || 'text-primary',
			status,
			lessons
		};
	});
}

/**
 * Calculate how many lessons the user has completed.
 */
export function calculatePathProgress(modules: ModuleData[]): {
	completedLessons: number;
	totalLessons: number;
} {
	let completedLessons = 0;
	let totalLessons = 0;

	for (const mod of modules) {
		totalLessons += mod.lessons.length;
		for (const lesson of mod.lessons) {
			if (lesson.completed) completedLessons++;
		}
	}

	return { completedLessons, totalLessons };
}
