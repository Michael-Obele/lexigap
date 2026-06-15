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

const QuizBatchSchema = v.object({
	count: v.pipe(v.number(), v.minValue(1), v.maxValue(3)),
	usedWords: v.array(v.string())
});

/**
 * Fetch a single quiz question so the assessment page can render immediately.
 * Each call requests only one question and avoids blocking on the full quiz.
 */
/**
 * Generate all quiz questions in a single server-side call.
 * Uses parallel generation (concurrency limit 5) to be much faster than
 * fetching one question at a time across multiple network round-trips.
 */
export const getQuiz = query(async () => {
	const questions = await generateQuiz(20);
	if (questions.length === 0) {
		error(503, 'Datamuse could not produce any quiz questions');
	}
	return questions;
});

/**
 * Fetch a small batch of quiz questions so the assessment stays ahead of the user.
 */
export const getQuizBatch = query(QuizBatchSchema, async ({ count, usedWords }) => {
	console.log('[getQuizBatch] Called:', { count, usedWordsCount: usedWords.length });

	const questions: GeneratedQuestion[] = [];
	const seenWords = new Set(usedWords);
	let attempts = 0;

	while (questions.length < count && attempts < 4) {
		attempts++;
		const batch = await generateQuiz(count - questions.length);

		for (const question of batch) {
			if (seenWords.has(question.blankWord)) {
				console.log('[getQuizBatch] Skipping duplicate:', question.blankWord);
				continue;
			}
			seenWords.add(question.blankWord);
			questions.push(question);
			if (questions.length === count) break;
		}
	}

	if (questions.length === 0) {
		console.error('[getQuizBatch] Failed — could not produce any questions');
		error(503, 'Datamuse could not produce any quiz questions');
	}

	console.log('[getQuizBatch] Returning:', {
		requested: count,
		returned: questions.length,
		words: questions.map((q) => q.blankWord)
	});

	return questions;
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
