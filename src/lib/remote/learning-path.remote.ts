import { form, getRequestEvent, query } from '$app/server';
import { buildPathProgress, calculatePathProgress } from '$lib/algorithms/learning-path';
import prisma from '$lib/server/prisma';
import type { ModuleData } from '$lib/types/quiz';
import * as v from 'valibot';

/**
 * Fetches the user's learning path data (query flavor).
 * Generates personalized path from quiz metrics stored in Prisma.
 */
export const getLearningPathData = query(async () => {
	const userId = getRequestEvent().locals.user?.id;

	if (!userId) {
		return {
			modules: [],
			totalLessons: 0,
			completedLessons: 0,
			progress: 0
		};
	}

	const metricsRows = await prisma.grammarMetric.findMany({
		where: { userId }
	});

	if (metricsRows.length === 0) {
		return {
			modules: [],
			totalLessons: 0,
			completedLessons: 0,
			progress: 0
		};
	}

	const metricMap = new Map<string, { totalQuestions: number; correctAnswers: number }>();
	for (const metric of metricsRows) {
		const existing = metricMap.get(metric.posTag) ?? { totalQuestions: 0, correctAnswers: 0 };
		existing.totalQuestions += metric.totalQuestions;
		existing.correctAnswers += metric.correctAnswers;
		metricMap.set(metric.posTag, existing);
	}

	const metrics = Array.from(metricMap.entries())
		.map(([posTag, data]) => ({
			posTag,
			score:
				data.totalQuestions > 0
					? Math.round((data.correctAnswers / data.totalQuestions) * 100)
					: 0
		}))
		.sort((a, b) => a.score - b.score);

	const completedTags = metrics.filter((metric) => metric.score >= 80).map((metric) => metric.posTag);
	const inProgressTag = metrics.find((metric) => metric.score < 80 && metric.score >= 40)?.posTag ?? null;

	const modules = buildPathProgress(completedTags, inProgressTag, metrics);
	const { completedLessons, totalLessons } = calculatePathProgress(modules);

	return {
		modules,
		totalLessons,
		completedLessons,
		progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
	};
});

/**
 * Updates lesson progress (form flavor).
 */
const UpdateLessonProgressSchema = v.object({
	lessonId: v.string(),
	completed: v.string()
});

export const updateLessonProgress = form(
	UpdateLessonProgressSchema,
	async ({ lessonId, completed }) => {
		const userId = getRequestEvent().locals.user?.id;
		const shouldMarkComplete = completed === 'true';

		if (!userId || !lessonId) {
			return { success: false };
		}

		await prisma.lessonProgress.upsert({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			},
			update: {
				completed: shouldMarkComplete,
				completedAt: shouldMarkComplete ? new Date() : null
			},
			create: {
				userId,
				lessonId,
				completed: shouldMarkComplete,
				completedAt: shouldMarkComplete ? new Date() : null
			}
		});

		return { success: true };
	}
);
