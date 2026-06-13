import { buildPathProgress, calculatePathProgress } from '$lib/algorithms/learning-path';
import type { ModuleData } from '$lib/types/quiz';

/**
 * Fetches the user's learning path data (query flavor).
 * Generates personalized path from quiz metrics stored in DB.
 */
export async function getLearningPathData(userId: string): Promise<{
	modules: ModuleData[];
	totalLessons: number;
	completedLessons: number;
	progress: number;
}> {
	// Placeholder — will query from Prisma when DB is available
	const metrics: Array<{ posTag: string; score: number }> = [
		{ posTag: 'Verb', score: 70 },
		{ posTag: 'Preposition', score: 45 },
		{ posTag: 'Noun', score: 90 },
		{ posTag: 'Adjective', score: 60 },
		{ posTag: 'Adverb', score: 55 }
	];

	const completedTags: string[] = [];
	const inProgressTag: string | null = metrics.sort((a, b) => a.score - b.score)[0]?.posTag ?? null;

	const modules = buildPathProgress(completedTags, inProgressTag, metrics);
	const { completedLessons, totalLessons } = calculatePathProgress(modules);

	return {
		modules,
		totalLessons,
		completedLessons,
		progress: Math.round((completedLessons / totalLessons) * 100)
	};
}

/**
 * Updates lesson progress (form flavor).
 */
export async function updateLessonProgress(data: FormData): Promise<{ success: boolean }> {
	const lessonId = data.get('lessonId') as string;
	const completed = data.get('completed') === 'true';

	if (!lessonId) {
		return { success: false };
	}

	// TODO: Persist to Prisma
	return { success: true };
}
