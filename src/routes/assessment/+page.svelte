<script lang="ts">
	import { onMount } from 'svelte';
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
		Target,
		AlarmClock,
		LoaderCircle,
		Wifi,
		WifiOff,
		Speech,
		Hash,
		Info
	} from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import AnswerOption from '$lib/components/app/quiz/AnswerOption.svelte';
	import ProgressHeader from '$lib/components/app/quiz/ProgressHeader.svelte';
	import { db } from '$lib/db';
	import { getQuizQuestion } from '$lib/remote';
	import type { GeneratedQuestion } from '$lib/types/quiz';
	import { calculateMetrics } from '$lib/algorithms/generator';

	const TOTAL_QUESTIONS = 20;

	let questions = $state<GeneratedQuestion[]>([]);
	let loadingQuestion = $state(false);
	let questionError = $state<string | null>(null);
	let totalQuestions = $derived(TOTAL_QUESTIONS);
	let currentQuestion = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let answered = $state(false);
	let streak = $state(0);
	let correctCount = $state(0);
	let userAnswers = $state<number[]>([]);
	let savedResultId = $state<number | null>(null);
	let result: {
		score: number;
		correctCount: number;
		metrics: Array<{
			posTag: string;
			label: string;
			totalQuestions: number;
			correctAnswers: number;
			score: number;
		}>;
	} | null = $state(null);

	let currentQ = $derived(questions[currentQuestion] ?? null);
	let letters = ['A', 'B', 'C', 'D'];
	let accuracy = $derived(
		userAnswers.length > 0 ? Math.round((correctCount / userAnswers.length) * 100) : 0
	);
	let isOnline = $derived(typeof navigator !== 'undefined' ? navigator.onLine : true);

	// ─── Timer ─────────────────────────────────────────────────
	const TOTAL_TIME = 600; // 10 minutes in seconds
	let timeRemaining = $state(TOTAL_TIME);
	let timerExpired = $state(false);
	let timerInterval: ReturnType<typeof setInterval> | null = null;
	let generationToastId: string | number | null = null;

	function startTimer() {
		if (timerInterval || result || timerExpired || loadingQuestion) return;

		timerInterval = setInterval(() => {
			if (result || timerExpired || loadingQuestion) return;

			timeRemaining = Math.max(0, timeRemaining - 1);

			if (timeRemaining <= 0) {
				timerExpired = true;
				stopTimer();
				void finishQuiz();
			}
		}, 1000);
	}

	function stopTimer() {
		if (!timerInterval) return;
		clearInterval(timerInterval);
		timerInterval = null;
	}

	function pauseTimer() {
		stopTimer();
	}

	function resumeTimer() {
		if (result || timerExpired || loadingQuestion) return;
		startTimer();
	}

	async function syncQuestionBuffer() {
		if (result || timerExpired) return;
		await ensureQuestion(currentQuestion, { showToast: !currentQ });
		await ensureQuestion(currentQuestion + 1);
	}

	onMount(() => {
		startTimer();
		void syncQuestionBuffer();

		return () => {
			stopTimer();
		};
	});

	function formatTime(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	const timerColor = $derived(
		timeRemaining > 120 ? 'text-success' : timeRemaining > 30 ? 'text-warning' : 'text-destructive'
	);

	const timerProgress = $derived(Math.round((timeRemaining / TOTAL_TIME) * 100));

	async function ensureQuestion(
		index: number,
		options: { showToast?: boolean; retryLabel?: string } = {}
	) {
		if (index >= TOTAL_QUESTIONS) return;
		if (questions[index] || loadingQuestion) return;

		pauseTimer();
		loadingQuestion = true;
		questionError = null;

		if (options.showToast) {
			generationToastId = toast.loading(options.retryLabel ?? 'Generating your next question...');
		}

		try {
			const nextQuestion = await getQuizQuestion({
				usedWords: questions.map((question) => question.blankWord)
			});

			if (!questions.some((question) => question.blankWord === nextQuestion.blankWord)) {
				questions = [...questions, nextQuestion];
			}
		} catch (caughtError) {
			questionError =
				caughtError instanceof Error ? caughtError.message : 'Unable to load question';
			if (options.showToast) {
				toast.error('Question generation failed. Please try again.');
			}
		} finally {
			loadingQuestion = false;
			if (generationToastId !== null) {
				toast.dismiss(generationToastId);
				generationToastId = null;
			}
			resumeTimer();
		}
	}

	async function retryQuestion() {
		await ensureQuestion(currentQuestion, {
			showToast: true,
			retryLabel: 'Retrying question generation...'
		});
	}

	function selectAnswer(index: number) {
		if (answered || result || !currentQ) return;
		selectedAnswer = index;
		answered = true;

		const isCorrect = index === currentQ.correctIndex;
		if (isCorrect) {
			correctCount++;
			streak++;
		} else {
			streak = 0;
		}

		// Save answer to IndexedDB as user progresses
		saveCurrentAnswer(isCorrect);
	}

	async function saveCurrentAnswer(isCorrect: boolean) {
		if (selectedAnswer === null || !currentQ) return;
		try {
			await db.quiz_answers.add({
				quizResultId: savedResultId ?? 0,
				questionIndex: currentQuestion,
				sentence: currentQ.sentence,
				blankWord: currentQ.blankWord,
				posTag: currentQ.posTag,
				options: currentQ.options,
				correctIndex: currentQ.correctIndex,
				selectedIndex: selectedAnswer,
				isCorrect
			} as unknown as Record<string, unknown>);
		} catch {
			// Silently handle — IndexedDB may not be available
		}
	}

	async function saveQuizResult(score: number, correct: number) {
		const metrics = calculateMetrics(questions, userAnswers);
		try {
			const newResult = {
				completedAt: Date.now(),
				score,
				totalQuestions,
				correctAnswers: correct,
				metrics,
				synced: false
			};
			const id = await db.quiz_results.add(newResult as unknown as Record<string, unknown>);
			savedResultId = Number(id);

			// Log activity for streak tracking
			await db.activity_log.add({
				timestamp: Date.now(),
				type: 'assessment',
				description: `Completed assessment with ${score}% (${correct}/${totalQuestions} correct)`
			} as unknown as Record<string, unknown>);
		} catch {
			// IndexedDB may not be available
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
			void syncQuestionBuffer();
		}
	}

	function prevQuestion() {
		if (currentQuestion > 0) {
			currentQuestion--;
			selectedAnswer = userAnswers[currentQuestion] ?? null;
			answered = selectedAnswer !== null;
			void syncQuestionBuffer();
		}
	}

	function skipQuestion() {
		if (currentQuestion < totalQuestions - 1) {
			currentQuestion++;
			selectedAnswer = null;
			answered = false;
			void syncQuestionBuffer();
		}
	}

	async function finishQuiz() {
		if (result) return;
		stopTimer();
		timerExpired = true;
		if (!currentQ) return;
		if (selectedAnswer !== null) {
			userAnswers[currentQuestion] = selectedAnswer;
		}
		while (userAnswers.length < totalQuestions) {
			userAnswers.push(-1);
		}
		const correct = questions.filter((q, i) => userAnswers[i] === q.correctIndex).length;
		const score = Math.round((correct / totalQuestions) * 100);
		const metrics = calculateMetrics(questions, userAnswers);

		result = { score, correctCount: correct, metrics };

		// Persist to IndexedDB
		await saveQuizResult(score, correct);

		if (!isOnline) {
			toast.info('Saved offline. Will sync when you log in.', { duration: 4000 });
		} else {
			toast.success('Assessment saved!');
		}
	}

	function getAnswerState(
		index: number
	): 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled' {
		if (!currentQ) return 'disabled';
		if (!answered) return 'default';
		if (index === currentQ.correctIndex) return 'correct';
		if (index === selectedAnswer && index !== currentQ.correctIndex) return 'incorrect';
		return 'disabled';
	}

	function getQuestionTypeLabel(type: string): string {
		const labels: Record<string, string> = {
			synonym: 'Vocabulary',
			antonym: 'Vocabulary',
			association: 'Vocabulary',
			'means-like': 'Vocabulary',
			phrase: 'Vocabulary',
			homophone: 'Phonetics',
			'adjective-noun': 'Vocabulary',
			cloze: 'Grammar'
		};
		return labels[type] || 'Vocabulary';
	}

	const tagBadgeColors: Record<string, string> = {
		Verb: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
		Noun: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
		Preposition: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
		Adjective: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
		Adverb: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
		Conjunction: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
		Article: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
		Vocabulary: 'bg-primary/10 text-primary border-primary/30'
	};
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
			{#if !isOnline}
				<Badge variant="outline" class="border-warning/30 text-warning gap-1">
					<WifiOff class="size-3" />
					Offline
				</Badge>
			{:else}
				<Badge variant="outline" class="border-success/30 text-success gap-1">
					<Wifi class="size-3" />
					Online
				</Badge>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			<Badge
				variant="outline"
				class="gap-1.5 rounded-full px-3 py-1.5 font-mono {loadingQuestion
					? 'border-warning/30 text-warning'
					: timerColor}"
				title={loadingQuestion ? 'Timer paused while generating the next question' : undefined}
			>
				{#if loadingQuestion}
					<LoaderCircle class="size-3.5 animate-spin" />
					Paused
				{:else}
					<AlarmClock class="size-3.5" />
				{/if}
				<span class="font-semibold">{formatTime(timeRemaining)}</span>
			</Badge>
			<a href="/">
				<Button variant="ghost" size="sm">Quit</Button>
			</a>
		</div>
	</header>

	<!-- Timer Progress Bar -->
	<div class="h-1 w-full bg-muted">
		<div
			class="h-full transition-all duration-1000 ease-linear {timeRemaining > 120
				? 'bg-primary'
				: timeRemaining > 30
					? 'bg-warning'
					: 'bg-destructive'}"
			style="width: {timerProgress}%"
		></div>
	</div>

	<main class="flex flex-1 flex-col items-center justify-center px-4 py-8">
		{#if result}
			<div class="w-full max-w-md text-center">
				<Card.Root class="rounded-xl border-border/50 p-8">
					<p class="text-6xl font-bold text-primary">{result.score}%</p>
					<p class="mt-2 text-lg font-semibold">Assessment Complete!</p>
					<p class="mt-1 text-sm text-muted-foreground">
						{result.correctCount} of {totalQuestions} correct
					</p>

					{#if result.metrics.length > 1}
						<div class="mt-6 space-y-2 text-left">
							<p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Breakdown
							</p>
							{#each result.metrics as metric (metric.posTag)}
								<div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
									<span class="text-sm font-medium">{metric.label}</span>
									<div class="flex items-center gap-2">
										<span class="text-xs text-muted-foreground">
											{metric.correctAnswers}/{metric.totalQuestions}
										</span>
										<span
											class="text-sm font-bold {metric.score >= 70
												? 'text-success'
												: metric.score >= 40
													? 'text-warning'
													: 'text-destructive'}"
										>
											{metric.score}%
										</span>
									</div>
								</div>
							{/each}
						</div>
					{/if}

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
					{#if currentQ}
						<div class="mb-4 flex flex-wrap items-center gap-2">
							<Badge variant="secondary" class="text-xs">
								{getQuestionTypeLabel(currentQ.type)}
							</Badge>
							{#if currentQ.posTag !== 'Vocabulary'}
								<Badge
									variant="outline"
									class="border-border/50 text-xs {tagBadgeColors[currentQ.posTag] || ''}"
								>
									{currentQ.posTag}
								</Badge>
							{/if}
							{#if currentQ.definition}
								<div class="group relative">
									<Info class="size-3.5 text-muted-foreground cursor-help" />
									<div
										class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
									>
										{currentQ.definition}
									</div>
								</div>
							{/if}
							{#if currentQ.pronunciation}
								<div class="flex items-center gap-1 text-xs text-muted-foreground">
									<Speech class="size-3" />
									/{currentQ.pronunciation}/
								</div>
							{/if}
							{#if currentQ.syllables && currentQ.syllables > 0}
								<div class="flex items-center gap-1 text-xs text-muted-foreground">
									<Hash class="size-3" />
									{currentQ.syllables} syll.
								</div>
							{/if}
						</div>

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
					{:else}
						<div class="space-y-4 py-8 text-center">
							<div class="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
								{#if loadingQuestion}
									<LoaderCircle class="size-5 animate-spin text-muted-foreground" />
								{:else}
									<Info class="size-5 text-muted-foreground animate-pulse" />
								{/if}
							</div>
							<p class="text-lg font-medium text-foreground">
								{loadingQuestion ? 'Generating your next question...' : 'Question not ready yet'}
							</p>
							<p class="text-sm text-muted-foreground">
								Datamuse is being queried in the background. The quiz will continue as soon as the
								next question is ready.
							</p>
							{#if questionError}
								<p class="text-sm text-warning">{questionError}</p>
							{/if}
							<Button variant="outline" onclick={retryQuestion} disabled={loadingQuestion}>
								{#if loadingQuestion}
									<LoaderCircle class="mr-1 size-4 animate-spin" />
									Retrying...
								{:else}
									Retry
								{/if}
							</Button>
						</div>
					{/if}
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
