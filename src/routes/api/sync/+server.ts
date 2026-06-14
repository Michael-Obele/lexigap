import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

/**
 * POST /api/sync
 *
 * Receives unsynced quiz results from svelte-idb and persists them to Prisma.
 * Requires authentication — returns 401 if no session.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	// Auth gate
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { results } = body as {
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
		};

		if (!results || !Array.isArray(results) || results.length === 0) {
			return json({ error: 'No results provided' }, { status: 400 });
		}

		const serverIds: string[] = [];

		for (const result of results) {
			// Create the quiz result in Prisma
			const created = await prisma.quizResult.create({
				data: {
					userId: locals.user.id,
					score: result.score,
					totalQuestions: result.totalQuestions,
					correctAnswers: result.correctAnswers,
					completedAt: new Date(result.completedAt),
					// Create grammar metrics for each POS tag
					metrics: {
						create: result.metrics.map((m) => ({
							posTag: m.posTag,
							totalQuestions: m.totalQuestions,
							correctAnswers: m.correctAnswers,
							score: m.score
						}))
					}
				}
			});

			serverIds.push(created.id);
		}

		return json({
			success: true,
			syncedCount: results.length,
			serverIds
		});
	} catch (err) {
		console.error('Sync error:', err);
		return json({ error: err instanceof Error ? err.message : 'Sync failed' }, { status: 500 });
	}
};
