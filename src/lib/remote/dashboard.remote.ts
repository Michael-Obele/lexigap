import { getRequestEvent, query } from '$app/server';
import prisma from '$lib/server/prisma';
import { POS_LABELS } from '$lib/types/quiz';

type DashboardRecentActivity = {
	icon: string;
	title: string;
	meta: string;
	status: 'Completed' | 'In Progress' | 'Not Started';
};

type DashboardData = {
	overallScore: number | null;
	scoreTrend: Array<{ date: string; score: number }>;
	metrics: Array<{ posTag: string; label: string; score: number }>;
	streak: number;
	recentActivity: DashboardRecentActivity[];
};

const blankDashboardData: DashboardData = {
	overallScore: null,
	scoreTrend: [],
	metrics: [],
	streak: 0,
	recentActivity: []
};

/**
 * Dashboard data remote (query flavor).
 * Fetches profile, quiz results, and lesson progress from Prisma.
 */
export const getDashboardData = query(async () => {
	const userId = getRequestEvent().locals.user?.id;

	if (!userId) {
		return blankDashboardData;
	}

	const [quizResults, grammarMetrics, lessonProgress] = await Promise.all([
		prisma.quizResult.findMany({
			where: { userId },
			orderBy: { completedAt: 'asc' }
		}),
		prisma.grammarMetric.findMany({
			where: { userId }
		}),
		prisma.lessonProgress.findMany({
			where: { userId },
			include: {
				lesson: true
			},
			orderBy: { updatedAt: 'desc' }
		})
	]);

	if (quizResults.length === 0 && grammarMetrics.length === 0 && lessonProgress.length === 0) {
		return blankDashboardData;
	}

	const scoreTrend = quizResults.slice(-7).map((result) => ({
		date: result.completedAt.toISOString().slice(0, 10),
		score: Math.round(result.score)
	}));

	const overallScore = quizResults.at(-1)?.score ?? null;

	const metricMap = new Map<string, { totalQuestions: number; correctAnswers: number }>();
	for (const metric of grammarMetrics) {
		const existing = metricMap.get(metric.posTag) ?? { totalQuestions: 0, correctAnswers: 0 };
		existing.totalQuestions += metric.totalQuestions;
		existing.correctAnswers += metric.correctAnswers;
		metricMap.set(metric.posTag, existing);
	}

	const metrics = Array.from(metricMap.entries()).map(([posTag, data]) => ({
		posTag,
		label: POS_LABELS[posTag] ?? posTag,
		score:
			data.totalQuestions > 0
				? Math.round((data.correctAnswers / data.totalQuestions) * 100)
				: 0
	}));

	const activityDates = [
		...quizResults.map((result) => result.completedAt),
		...lessonProgress
			.filter((progress) => progress.completedAt)
			.map((progress) => progress.completedAt as Date)
	];

	const streak = calculateStreak(activityDates);

	const recentActivity = [
		...quizResults.map((result) => ({
			timestamp: result.completedAt,
			icon: 'BrainCircuit',
			title: 'Assessment completed',
			meta: `${Math.round(result.score)}% · ${timeAgo(result.completedAt)}`,
			status: 'Completed' as const
		})),
		...lessonProgress
			.filter((progress) => progress.completed && progress.completedAt)
			.map((progress) => ({
				timestamp: progress.completedAt as Date,
				icon: 'BookOpen',
				title: progress.lesson.title,
				meta: timeAgo(progress.completedAt as Date),
				status: 'Completed' as const
			}))
	]
		.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
		.slice(0, 5)
		.map(({ timestamp: _timestamp, ...activity }) => activity);

	return {
		overallScore,
		scoreTrend,
		metrics,
		streak,
		recentActivity
	};
});

function calculateStreak(dates: Date[]): number {
	if (dates.length === 0) return 0;

	const uniqueDates = [...new Set(dates.map((date) => date.toISOString().slice(0, 10)))].sort().reverse();
	let currentStreak = 0;
	const today = new Date().toISOString().slice(0, 10);
	let checkDate = today;

	for (const date of uniqueDates) {
		if (date === checkDate || date === getPreviousDate(checkDate)) {
			currentStreak++;
			checkDate = date;
		} else if (date < checkDate) {
			break;
		}
	}

	return currentStreak;
}

function getPreviousDate(dateStr: string): string {
	const date = new Date(dateStr);
	date.setDate(date.getDate() - 1);
	return date.toISOString().slice(0, 10);
}

function timeAgo(timestamp: Date): string {
	const diff = Date.now() - timestamp.getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return 'Just now';
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}
