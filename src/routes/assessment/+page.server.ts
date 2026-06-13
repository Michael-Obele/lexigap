import { generateQuiz } from '$lib/algorithms/generator';
import type { GeneratedQuestion } from '$lib/types/quiz';

export async function load() {
	const questions = await generateQuiz(20);
	return { questions };
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const questionsJson = data.get('questions') as string;
		const answersRaw = data.getAll('answers[]').map(Number);

		if (!questionsJson || answersRaw.length === 0) {
			return { success: false, error: 'Missing data' };
		}

		const questions: GeneratedQuestion[] = JSON.parse(questionsJson);
		const correctCount = questions.filter((q, i) => answersRaw[i] === q.correctIndex).length;
		const score = Math.round((correctCount / questions.length) * 100);

		return {
			success: true,
			score,
			correctCount,
			totalQuestions: questions.length,
			answers: answersRaw
		};
	}
};
