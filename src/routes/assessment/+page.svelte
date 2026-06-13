<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		BookOpen,
		ChevronLeft,
		ChevronRight,
		SkipForward,
		Flag,
		Flame,
		Target
	} from '@lucide/svelte';
	import AnswerOption from '$lib/components/app/quiz/AnswerOption.svelte';
	import ProgressHeader from '$lib/components/app/quiz/ProgressHeader.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();

	let questions = $derived(data.questions);
	let totalQuestions = $derived(questions.length);
	let currentQuestion = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let answered = $state(false);
	let streak = $state(0);
	let correctCount = $state(0);
	let userAnswers = $state<number[]>([]);
	let result: { score: number; correctCount: number } | null = $state(null);

	let currentQ = $derived(questions[currentQuestion]);
	let letters = ['A', 'B', 'C', 'D'];
	let accuracy = $derived(
		userAnswers.length > 0 ? Math.round((correctCount / userAnswers.length) * 100) : 0
	);

	function selectAnswer(index: number) {
		if (answered || result) return;
		selectedAnswer = index;
		answered = true;
		if (index === currentQ.correctIndex) {
			correctCount++;
			streak++;
		} else {
			streak = 0;
		}
	}

	function nextQuestion() {
		if (selectedAnswer !== null) {
			userAnswers[currentQuestion] = selectedAnswer;
		}
		if (currentQuestion < totalQuestions - 1) {
			currentQuestion++;
			selectedAnswer = null;
			answered = false;
		}
	}

	function prevQuestion() {
		if (currentQuestion > 0) {
			currentQuestion--;
			selectedAnswer = userAnswers[currentQuestion] ?? null;
			answered = selectedAnswer !== null;
		}
	}

	function skipQuestion() {
		if (currentQuestion < totalQuestions - 1) {
			currentQuestion++;
			selectedAnswer = null;
			answered = false;
		}
	}

	function finishQuiz() {
		if (selectedAnswer !== null) {
			userAnswers[currentQuestion] = selectedAnswer;
		}
		while (userAnswers.length < totalQuestions) {
			userAnswers.push(-1);
		}
		const correct = questions.filter((q, i) => userAnswers[i] === q.correctIndex).length;
		result = { score: Math.round((correct / totalQuestions) * 100), correctCount: correct };
	}

	function getAnswerState(
		index: number
	): 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled' {
		if (!answered) return 'default';
		if (index === currentQ.correctIndex) return 'correct';
		if (index === selectedAnswer && index !== currentQ.correctIndex) return 'incorrect';
		return 'disabled';
	}
</script>

<div class="flex min-h-screen flex-col bg-background">
	<header class="flex h-14 items-center justify-between border-b border-border px-6">
		<div class="flex items-center gap-3">
			<div
				class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
			>
				<BookOpen class="size-3.5" />
			</div>
			<span class="font-semibold">Grammar Assessment</span>
		</div>
		<a href="/">
			<Button variant="ghost" size="sm">Quit</Button>
		</a>
	</header>

	<main class="flex flex-1 flex-col items-center justify-center px-4 py-8">
		{#if result}
			<div class="w-full max-w-md text-center">
				<Card.Root class="rounded-xl border-border/50 p-8">
					<p class="text-6xl font-bold text-primary">{result.score}%</p>
					<p class="mt-2 text-lg font-semibold">Assessment Complete!</p>
					<p class="mt-1 text-sm text-muted-foreground">
						{result.correctCount} of {totalQuestions} correct
					</p>
					<div class="mt-6 flex flex-col gap-3">
						<a href="/dashboard">
							<Button class="w-full">View Dashboard</Button>
						</a>
						<a href="/learning-path">
							<Button variant="outline" class="w-full">View Learning Path</Button>
						</a>
					</div>
				</Card.Root>
			</div>
		{:else}
			<div class="w-full max-w-2xl space-y-6">
				<ProgressHeader currentQuestion={currentQuestion + 1} {totalQuestions} />

				<Card.Root class="rounded-xl border border-border/50 p-6 md:p-8">
					{#if currentQ.type === 'synonym'}
						<div class="mb-4">
							<Badge variant="secondary" class="text-xs">Vocabulary</Badge>
						</div>
					{/if}

					<div class="mb-8 text-center">
						<p class="font-serif text-xl leading-relaxed text-foreground md:text-2xl">
							{currentQ.sentence}
						</p>
					</div>

					<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each currentQ.options as option, index (option)}
							<AnswerOption
								letter={letters[index]}
								text={option}
								state={getAnswerState(index)}
								onclick={() => selectAnswer(index)}
							/>
						{/each}
					</div>

					<div class="flex items-center justify-between">
						<Button
							variant="outline"
							size="default"
							onclick={prevQuestion}
							disabled={currentQuestion === 0}
							type="button"
						>
							<ChevronLeft class="mr-1 size-4" />
							Previous
						</Button>
						<Button variant="ghost" size="default" onclick={skipQuestion} type="button">
							<SkipForward class="mr-1 size-4" />
							Skip
						</Button>
						{#if currentQuestion === totalQuestions - 1}
							<Button
								variant="default"
								size="default"
								disabled={!answered}
								onclick={finishQuiz}
								type="button"
							>
								Finish
								<ChevronRight class="ml-1 size-4" />
							</Button>
						{:else}
							<Button
								variant="default"
								size="default"
								disabled={!answered}
								onclick={nextQuestion}
								type="button"
							>
								Next
								<ChevronRight class="ml-1 size-4" />
							</Button>
						{/if}
					</div>
				</Card.Root>

				<div
					class="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3"
				>
					<Button variant="ghost" size="sm" class="gap-1 text-muted-foreground" type="button">
						<Flag class="size-3.5" />
						Report
					</Button>
					<div class="flex items-center gap-4">
						<Badge variant="outline" class="gap-1.5 border-warning/30 text-warning">
							<Flame class="size-3.5" />
							<span class="font-semibold">{streak}</span>
						</Badge>
						<Badge variant="outline" class="gap-1.5 border-primary/30 text-primary">
							<Target class="size-3.5" />
							<span class="font-semibold">{accuracy}%</span>
						</Badge>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
