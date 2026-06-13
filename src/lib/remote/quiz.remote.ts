import { generateQuiz, calculateMetrics, calculateScore } from '$lib/algorithms/generator';
import type { GeneratedQuestion } from '$lib/types/quiz';
import * as v from 'valibot';

/**
 * Schema for quiz answers submission.
 */
const QuizAnswerSchema = v.object({
	answers: v.array(v.number())
});

export type QuizAnswerData = v.InferInput<typeof QuizAnswerSchema>;

/**
 * Fetch a freshly generated quiz (query flavor).
 * Used by the load function to generate 20 questions on the fly.
 */
export async function getQuizData(count: number = 20): Promise<{
	questions: GeneratedQuestion[];
}> {
	const questions = await generateQuiz(count);
	return { questions };
}

/**
 * Score a completed quiz (form flavor).
 * Validates answers, computes metrics, returns results.
 */
export async function submitQuiz(data: FormData): Promise<{
	score: number;
	correctAnswers: number;
	totalQuestions: number;
	metrics: Array<{
		posTag: string;
		label: string;
		totalQuestions: number;
		correctAnswers: number;
		score: number;
	}>;
	error?: string;
}> {
	const raw = v.parse(QuizAnswerSchema, {
		answers: data.getAll('answers').map(Number)
	});

	if (!raw.answers || raw.answers.length === 0) {
		return {
			score: 0,
			correctAnswers: 0,
			totalQuestions: 0,
			metrics: [],
			error: 'No answers provided'
		};
	}

	// We need the original questions to score — they'll be passed via a hidden field or session
	const questionsJson = data.get('questions') as string;
	if (!questionsJson) {
		return {
			score: 0,
			correctAnswers: 0,
			totalQuestions: 0,
			metrics: [],
			error: 'Questions data missing'
		};
	}

	const questions: GeneratedQuestion[] = JSON.parse(questionsJson);
	const score = calculateScore(questions, raw.answers);
	const correctAnswers = questions.filter((q, i) => raw.answers[i] === q.correctIndex).length;

	return {
		score,
		correctAnswers,
		totalQuestions: questions.length,
		metrics: calculateMetrics(questions, raw.answers)
	};
}
