/**
 * Dashboard data remote (query flavor).
 * Fetches user profile, quiz results, and learning path progress.
 */

export async function getDashboardData(userId: string): Promise<{
	overallScore: number;
	scoreTrend: Array<{ date: string; score: number }>;
	metrics: Array<{ posTag: string; label: string; score: number }>;
	streak: number;
	recentActivity: Array<{
		icon: string;
		title: string;
		meta: string;
		status: 'Completed' | 'In Progress' | 'Not Started';
	}>;
}> {
	// Placeholder — will be connected to Prisma when DB is available
	return {
		overallScore: 78,
		scoreTrend: [
			{ date: '2026-06-07', score: 72 },
			{ date: '2026-06-09', score: 75 },
			{ date: '2026-06-11', score: 78 }
		],
		metrics: [{ posTag: 'Vocabulary', label: 'Vocabulary', score: 78 }],
		streak: 5,
		recentActivity: []
	};
}
