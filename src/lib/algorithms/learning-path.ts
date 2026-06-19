/**
 * Learning Path (shelved for Phase 2 redesign)
 *
 * This module previously housed the adaptive learning-path algorithm
 * that mapped quiz metrics → personalized lesson sequences.
 *
 * The approach was wrong for our goal (vocabulary size estimation, not
 * grammar drilling). The lesson-tree / POS-per-module model will be
 * redesigned from scratch after frequency-banded assessment is stable.
 *
 * See plan/todos.md for the redo track.
 */

import type { ModuleData, PathProgress } from '$lib/types/quiz';

/** Stub — returns no modules until learning path is redesigned */
export function buildPathProgress(
	_completedTags: string[],
	_inProgressTag: string | null,
	_metrics: Array<{ posTag: string; score: number }>
): ModuleData[] {
	return [];
}

/** Stub — returns zero progress */
export function calculatePathProgress(_modules: ModuleData[]): {
	completedLessons: number;
	totalLessons: number;
} {
	return { completedLessons: 0, totalLessons: 0 };
}

/** Stub — returns empty path */
export function generateLearningPath(
	_metrics: Array<{ posTag: string; score: number }>
): Array<{ tag: string; score: number; status: 'complete' | 'unlocked' | 'locked' }> {
	return [];
}

/** Stub — returns empty progress object */
export function buildFullPathProgress(
	_completedTags: string[],
	_inProgressTag: string | null,
	_metrics: Array<{ posTag: string; score: number }>
): PathProgress {
	return { modules: [], totalLessons: 0, completedLessons: 0, progress: 0 };
}
