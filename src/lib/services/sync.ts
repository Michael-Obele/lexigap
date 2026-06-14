/**
 * Sync service: pushes local svelte-idb data to the server.
 * Triggered on user login.
 */
import { db, type QuizResult, type QuizAnswer } from '$lib/db';

interface SyncPayload {
	results: Array<{
		score: number;
		totalQuestions: number;
		correctAnswers: number;
		completedAt: number;
		metrics: Array<{
			posTag: string;
			label: string;
			totalQuestions: number;
			correctAnswers: number;
			score: number;
		}>;
	}>;
}

interface SyncResponse {
	success: boolean;
	syncedCount: number;
	serverIds: string[];
	error?: string;
}

/**
 * Check for unsynced quiz results and push them to the server.
 * Called after user logs in.
 */
export async function syncLocalData(): Promise<SyncResponse> {
	try {
		// Get all unsynced results
		const allResults = (await db.quiz_results.getAll()) as unknown as QuizResult[];
		const unsynced = allResults.filter((r) => !r.synced);

		if (unsynced.length === 0) {
			return { success: true, syncedCount: 0, serverIds: [] };
		}

		const payload: SyncPayload = {
			results: unsynced.map((r) => ({
				score: r.score,
				totalQuestions: r.totalQuestions,
				correctAnswers: r.correctAnswers,
				completedAt: r.completedAt,
				metrics: r.metrics
			}))
		};

		// Send to server
		const res = await fetch('/api/sync', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			const errData = await res.json().catch(() => ({}));
			return {
				success: false,
				syncedCount: 0,
				serverIds: [],
				error: errData.error || `Server returned ${res.status}`
			};
		}

		const data: { syncedCount: number; serverIds: string[] } = await res.json();

		// Mark local results as synced
		for (const result of unsynced) {
			if (result.id !== undefined) {
				await db.quiz_results.put({
					...result,
					synced: true,
					serverId: data.serverIds[unsynced.indexOf(result)] || undefined
				} as unknown as Record<string, unknown>);
			}
		}

		return {
			success: true,
			syncedCount: data.syncedCount,
			serverIds: data.serverIds
		};
	} catch (err) {
		return {
			success: false,
			syncedCount: 0,
			serverIds: [],
			error: err instanceof Error ? err.message : 'Unknown sync error'
		};
	}
}

/**
 * Get the count of unsynced results.
 */
export async function getUnsyncedCount(): Promise<number> {
	try {
		const allResults = (await db.quiz_results.getAll()) as unknown as QuizResult[];
		return allResults.filter((r) => !r.synced).length;
	} catch {
		return 0;
	}
}
