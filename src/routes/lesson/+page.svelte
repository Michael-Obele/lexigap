<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from '$lib/components/ui/breadcrumb/index.js';
	import {
		BrainCircuit,
		Lightbulb,
		AlertTriangle,
		CheckCircle2,
		XCircle,
		ChevronLeft,
		ChevronRight,
		ArrowLeft
	} from '@lucide/svelte';

	let selectedAnswer = $state<number | null>(null);
	let answered = $state(false);
	let isCorrect = $state(false);

	const exerciseOptions = ['go', 'went', 'gone', 'going'];
	const correctAnswerIndex = 1; // "went"
	const letters = ['A', 'B', 'C', 'D'];

	function selectAnswer(index: number) {
		if (answered) return;
		selectedAnswer = index;
		answered = true;
		isCorrect = index === correctAnswerIndex;
	}

	const lessonProgress = [true, true, false, false, false]; // Lesson 3 of 5
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<!-- Breadcrumb -->
			<div class="px-4 lg:px-6">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/learning-path">Learning Path</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink href="/learning-path">Verbs</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Lesson 2</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<!-- Lesson Header -->
			<div class="px-4 lg:px-6">
				<h1 class="mb-2 text-3xl font-bold text-foreground">Mastering the Past Tense</h1>
				<p class="text-sm text-muted-foreground">
					Lesson 2 of 5 in the <span class="font-medium text-primary">Verbs</span> module
				</p>
			</div>

			<Separator class="mx-auto max-w-5xl" />

			<!-- Content Area -->
			<div class="mx-auto w-full max-w-3xl px-4 lg:px-6">
				<div class="space-y-8">
					<!-- Explanation Block -->
					<div>
						<h2 class="mb-4 text-xl font-semibold font-sans">Understanding Past Tense</h2>
						<p class="font-serif text-base leading-relaxed text-foreground">
							The past tense describes actions that have already happened. In English, regular verbs
							form the past tense by adding
							<Badge variant="outline" class="border-primary/30 text-primary">-ed</Badge>
							to the base form. Irregular verbs have unique past tense forms that must be memorized.
						</p>
					</div>

					<!-- Example Block -->
					<Card.Root class="rounded-lg border-l-4 border-l-chart-2 border-border/50 bg-card p-5">
						<p class="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Examples
						</p>
						<div class="space-y-4">
							<div>
								<p class="font-serif text-lg text-foreground">
									"She <span class="font-semibold text-primary">walked</span> to the store yesterday."
								</p>
								<p class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
									<Lightbulb class="size-3.5" />
									Walked = past tense of "walk"
								</p>
							</div>
							<Separator />
							<div>
								<p class="font-serif text-lg text-foreground">
									"They <span class="font-semibold text-primary">played</span> soccer last weekend."
								</p>
								<p class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
									<Lightbulb class="size-3.5" />
									Played = past tense of "play"
								</p>
							</div>
						</div>
					</Card.Root>

					<!-- Tip Block -->
					<Card.Root class="rounded-lg border border-warning/20 bg-warning/5 p-5">
						<div class="flex items-start gap-3">
							<Lightbulb class="mt-0.5 size-5 shrink-0 text-warning" />
							<div>
								<p class="mb-1 text-sm font-semibold text-warning">Pro Tip</p>
								<p class="text-sm text-foreground">
									Most regular verbs form the past tense by adding "-ed" to the base form. For verbs
									ending in "e", just add "d" (like "love" → "loved").
								</p>
							</div>
						</div>
					</Card.Root>

					<!-- Warning Block -->
					<Card.Root class="rounded-lg border border-destructive/20 bg-destructive/5 p-5">
						<div class="flex items-start gap-3">
							<AlertTriangle class="mt-0.5 size-5 shrink-0 text-destructive" />
							<div>
								<p class="mb-1 text-sm font-semibold text-destructive">Common Mistake</p>
								<p class="text-sm text-foreground">
									"I did went" is incorrect. Use "I went" or "I did go" — never both "did" and the
									past tense form together.
								</p>
							</div>
						</div>
					</Card.Root>

					<!-- Interactive Exercise -->
					<Card.Root class="rounded-xl border-2 border-border/50 p-6">
						<div class="mb-4 flex items-center gap-2">
							<BrainCircuit class="size-5 text-primary" />
							<h3 class="text-lg font-semibold">Interactive Exercise</h3>
						</div>

						<!-- Sentence -->
						<div class="mb-6 text-center">
							<p class="font-serif text-xl leading-relaxed text-foreground">
								"He
								<span
									class="inline-block min-w-20 border-b-2 border-dashed border-primary px-2 text-primary"
								>
									{answered ? exerciseOptions[selectedAnswer!] : '\u00A0'}
								</span>
								to the party last night."
							</p>
						</div>

						<!-- Options -->
						<div class="mb-6 grid grid-cols-2 gap-4">
							{#each exerciseOptions as option, index}
								<button
									type="button"
									class="flex min-h-12 items-center rounded-lg border px-4 py-3 text-left transition-all duration-150 {!answered
										? 'border-border bg-card hover:bg-muted hover:border-ring'
										: index === correctAnswerIndex
											? 'border-success bg-success/10'
											: index === selectedAnswer && !isCorrect
												? 'border-destructive bg-destructive/10'
												: 'cursor-not-allowed opacity-50'}"
									onclick={() => selectAnswer(index)}
									disabled={answered}
								>
									<span
										class="mr-3 flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold {!answered
											? 'bg-muted text-muted-foreground'
											: index === correctAnswerIndex
												? 'bg-success/20 text-success'
												: index === selectedAnswer && !isCorrect
													? 'bg-destructive/20 text-destructive'
													: 'bg-muted text-muted-foreground'}"
									>
										{letters[index]}
									</span>
									<span class="flex-1 font-medium">{option}</span>
									{#if answered && index === correctAnswerIndex}
										<CheckCircle2 class="ml-2 size-5 text-success" />
									{/if}
									{#if answered && index === selectedAnswer && !isCorrect}
										<XCircle class="ml-2 size-5 text-destructive" />
									{/if}
								</button>
							{/each}
						</div>

						<!-- Feedback -->
						{#if answered}
							<div class="mb-4 rounded-lg p-4 {isCorrect ? 'bg-success/10' : 'bg-destructive/10'}">
								<div class="flex items-center gap-2">
									{#if isCorrect}
										<CheckCircle2 class="size-5 text-success" />
										<span class="font-semibold text-success">Correct!</span>
									{:else}
										<XCircle class="size-5 text-destructive" />
										<span class="font-semibold text-destructive">Not quite.</span>
									{/if}
								</div>
								<p class="mt-2 text-sm text-muted-foreground">
									"Went" is the past tense of "go". It's an irregular verb — the past tense doesn't
									follow the regular "-ed" pattern.
								</p>
							</div>
						{/if}
					</Card.Root>
				</div>
			</div>

			<!-- Lesson Navigation (Sticky Bottom) -->
			<div class="sticky bottom-0 border-t border-border/50 bg-card px-4 py-4 lg:px-6">
				<div class="mx-auto flex max-w-3xl items-center justify-between">
					<Button variant="outline" size="default" disabled>
						<ChevronLeft class="mr-1 size-4" />
						Previous
					</Button>

					<!-- Progress Dots -->
					<div class="flex items-center gap-2">
						{#each lessonProgress as completed, i}
							<div
								class="rounded-full transition-all duration-200 {completed
									? 'size-3 bg-success'
									: i === 2
										? 'size-3 bg-primary'
										: 'size-2 bg-border'}"
							/>
						{/each}
					</div>
					<span class="text-xs text-muted-foreground">Lesson 3 of 5</span>

					<Button variant="default" size="default">
						Next
						<ChevronRight class="ml-1 size-4" />
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
