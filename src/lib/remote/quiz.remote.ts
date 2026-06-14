import { error } from '@sveltejs/kit';
import { form, query } from '$app/server';
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

const QuizQuestionSchema = v.object({
	usedWords: v.array(v.string())
});

/**
 * Fetch a single quiz question so the assessment page can render immediately.
 * Each call requests only one question and avoids blocking on the full quiz.
 */
export const getQuizQuestion = query(QuizQuestionSchema, async ({ usedWords }) => {
	for (let attempt = 0; attempt < 15; attempt++) {
		const questions = await generateQuiz(1);
		const question = questions[0];
		if (!question) continue;
		if (usedWords.includes(question.blankWord)) continue;
		return question;
	}

	error(503, 'Datamuse could not produce a new quiz question');
});

const QuizSubmitSchema = v.object({
	questions: v.string(),
	answers: v.array(v.number())
});

/**
 * Score a completed quiz (form flavor).
 * Validates answers, computes metrics, returns results.
 */
export const submitQuiz = form(QuizSubmitSchema, async ({ questions, answers }) => {
	const parsedQuestions: GeneratedQuestion[] = JSON.parse(questions);
	const score = calculateScore(parsedQuestions, answers);
	const correctAnswers = parsedQuestions.filter((q, i) => answers[i] === q.correctIndex).length;

	return {
		score,
		correctAnswers,
		totalQuestions: parsedQuestions.length,
		metrics: calculateMetrics(parsedQuestions, answers)
	};
});
