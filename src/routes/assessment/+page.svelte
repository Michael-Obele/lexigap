<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
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

	// Mock quiz data
	const totalQuestions = 20;
	let currentQuestion = $state(1);
	let selectedAnswer = $state<number | null>(null);
	let answered = $state(false);
	let streak = $state(5);
	let correctCount = $state(12);
	let timeRemaining = $state(272);

	interface Question {
		sentence: string;
		blank: string;
		options: string[];
		correctIndex: number;
		type: 'cloze' | 'synonym';
	}

	const questions: Question[] = [
		{
			sentence: 'The committee _______ the proposal yesterday.',
			blank: 'approved',
			options: ['approve', 'approved', 'approves', 'approving'],
			correctIndex: 1,
			type: 'cloze'
		},
		{
			sentence: 'She has been _______ to the store three times today.',
			blank: 'going',
			options: ['go', 'went', 'gone', 'going'],
			correctIndex: 2,
			type: 'cloze'
		},
		{
			sentence: 'The cat sat _______ the mat.',
			blank: 'on',
			options: ['in', 'on', 'at', 'by'],
			correctIndex: 1,
			type: 'cloze'
		},
		{
			sentence: 'He is _______ than his brother.',
			blank: 'taller',
			options: ['tall', 'taller', 'tallest', 'more tall'],
			correctIndex: 1,
			type: 'cloze'
		},
		{
			sentence: 'They _______ playing football when it started to rain.',
			blank: 'were',
			options: ['was', 'were', 'are', 'is'],
			correctIndex: 1,
			type: 'cloze'
		}
	];

	let currentQ = $derived(questions[(currentQuestion - 1) % questions.length]);
	let letters = ['A', 'B', 'C', 'D'];
	let progressValue = $derived((currentQuestion / totalQuestions) * 100);
	let accuracy = $derived(
		correctCount > 0 ? Math.round((correctCount / currentQuestion) * 100) : 0
	);

	function selectAnswer(index: number) {
		if (answered) return;
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
		if (currentQuestion < totalQuestions) {
			currentQuestion++;
			selectedAnswer = null;
			answered = false;
		}
	}

	function prevQuestion() {
		if (currentQuestion > 1) {
			currentQuestion--;
			selectedAnswer = null;
			answered = false;
		}
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
	<!-- Minimal Header -->
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

	<!-- Main Content -->
	<main class="flex flex-1 flex-col items-center justify-center px-4 py-8">
		<div class="w-full max-w-2xl space-y-6">
			<!-- Progress -->
			<ProgressHeader {currentQuestion} {totalQuestions} {timeRemaining} />

			<!-- Question Card -->
			<Card.Root class="rounded-xl border border-border/50 p-6 md:p-8">
				<!-- Question Type Badge -->
				{#if currentQ.type === 'synonym'}
					<div class="mb-4">
						<Badge variant="secondary" class="text-xs">Synonym Matching</Badge>
					</div>
				{/if}

				<!-- Sentence -->
				<div class="mb-8 text-center">
					<p class="font-serif text-xl leading-relaxed text-foreground md:text-2xl">
						{#each currentQ.sentence.split('_______') as part, i}
							{part}
							{#if i < currentQ.sentence.split('_______').length - 1}
								<span
									class="inline-block min-w-20 border-b-2 border-dashed border-primary px-2 text-primary"
								>
									{answered ? currentQ.blank : '\u00A0'}
								</span>
							{/if}
						{/each}
					</p>
				</div>

				<!-- Answer Options -->
				<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each currentQ.options as option, index}
						<AnswerOption
							letter={letters[index]}
							text={option}
							state={getAnswerState(index)}
							onclick={() => selectAnswer(index)}
						/>
					{/each}
				</div>

				<!-- Navigation -->
				<div class="flex items-center justify-between">
					<Button
						variant="outline"
						size="default"
						onclick={prevQuestion}
						disabled={currentQuestion === 1}
					>
						<ChevronLeft class="mr-1 size-4" />
						Previous
					</Button>
					<Button
						variant="ghost"
						size="default"
						onclick={() => {
							selectedAnswer = null;
							answered = false;
						}}
					>
						<SkipForward class="mr-1 size-4" />
						Skip
					</Button>
					<Button variant="default" size="default" onclick={nextQuestion} disabled={!answered}>
						{currentQuestion === totalQuestions ? 'Finish' : 'Next'}
						<ChevronRight class="ml-1 size-4" />
					</Button>
				</div>
			</Card.Root>

			<!-- Footer Stats -->
			<div
				class="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3"
			>
				<div class="flex items-center gap-2">
					<Button variant="ghost" size="sm" class="gap-1 text-muted-foreground">
						<Flag class="size-3.5" />
						Report
					</Button>
				</div>
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
	</main>
</div>
