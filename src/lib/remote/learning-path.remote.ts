import { query } from '$app/server';

/**
 * Learning path (shelved for Phase 2 redesign).
 *
 * Returns empty data until the frequency-banded assessment is stable
 * and the learning-path model is redesigned.
 */
export const getLearningPathData = query(async () => {
	return {
		modules: [],
		totalLessons: 0,
		completedLessons: 0,
		progress: 0
	};
});

/**
 * Stub — no-op until learning path is redesigned.
 */
export const updateLessonProgress = query(async () => {
	return { success: true };
});
