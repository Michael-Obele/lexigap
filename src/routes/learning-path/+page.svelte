<script lang="ts">
	import { browser } from '$app/environment';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		Route,
		RefreshCw,
		Zap,
		ArrowRight,
		Lock,
		CheckCircle2,
		Flame,
		AlertCircle,
		BrainCircuit
	} from '@lucide/svelte';
	import { db, type QuizResult } from '$lib/db';
	import { calculateMetrics } from '$lib/algorithms/generator';
	import { buildPathProgress, calculatePathProgress } from '$lib/algorithms/learning-path';

	// ─── State ─────────────────────────────────────────────────
	let modules = $state<
		Array<{
			tag: string;
			title: string;
			description: string;
			icon: string;
			color: string;
			status: 'complete' | 'in-progress' | 'unlocked' | 'locked';
			lessons: Array<{
				id: string;
				title: string;
				description: string;
				completed: boolean;
				orderIndex: number;
				estimatedMinutes: number;
			}>;
		}>
	>([]);
	let totalLessons = $state(0);
	let completedLessons = $state(0);
	let loading = $state(true);
	let hasData = $state(false);
	let pathProgress = $derived(
		totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
	);

	// ─── Load data ─────────────────────────────────────────────
	async function loadLearningPath() {
		if (!browser) return;
		try {
			const results = (await db.quiz_results.getAll()) as unknown as QuizResult[];

			if (results.length === 0) {
				loading = false;
				return;
			}

			// Aggregate metrics from all results
			const metricMap = new Map<string, { total: number; correct: number }>();
			for (const r of results) {
				for (const m of r.metrics) {
					const existing = metricMap.get(m.posTag) || { total: 0, correct: 0 };
					existing.total += m.totalQuestions;
					existing.correct += m.correctAnswers;
					metricMap.set(m.posTag, existing);
				}
			}

			const metrics = Array.from(metricMap.entries()).map(([posTag, data]) => ({
				posTag,
				score: Math.round((data.correct / data.total) * 100)
			}));

			// Sort by worst score first
			metrics.sort((a, b) => a.score - b.score);

			// Determine completed/in-progress based on scores
			const completedTags: string[] = metrics.filter((m) => m.score >= 80).map((m) => m.posTag);
			const inProgressTag: string | null =
				metrics.find((m) => m.score < 80 && m.score >= 40)?.posTag ?? null;

			const built = buildPathProgress(completedTags, inProgressTag, metrics);
			const { completedLessons: cl, totalLessons: tl } = calculatePathProgress(built);

			modules = built;
			totalLessons = tl;
			completedLessons = cl;
			hasData = true;
		} catch {
			// IndexedDB not available
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		loadLearningPath();
	});

	// ─── Dead link handler ─────────────────────────────────────
	function notReady(event: MouseEvent) {
		event.preventDefault();
		toast.info('This feature is not ready yet');
	}

	// ─── Helpers ───────────────────────────────────────────────
	function getStatusBadge(status: string): {
		variant: 'outline' | 'default' | 'secondary';
		color: string;
		label: string;
	} {
		switch (status) {
			case 'complete':
				return { variant: 'outline', color: 'border-success/30 text-success', label: 'Complete' };
			case 'in-progress':
				return { variant: 'default', color: '', label: 'In Progress' };
			case 'unlocked':
				return { variant: 'outline', color: 'border-primary/30 text-primary', label: 'Unlocked' };
			default:
				return { variant: 'outline', color: 'border-muted text-muted-foreground', label: 'Locked' };
		}
	}

	function getNodeColor(status: string): string {
		switch (status) {
			case 'complete':
				return 'bg-success border-success';
			case 'in-progress':
				return 'bg-warning border-warning';
			case 'unlocked':
				return 'bg-primary border-primary';
			default:
				return 'bg-muted border-border';
		}
	}

	function getButtonProps(status: string): {
		variant: 'default' | 'outline' | 'ghost';
		disabled: boolean;
		label: string;
	} {
		switch (status) {
			case 'complete':
				return { variant: 'ghost', disabled: false, label: 'Review' };
			case 'in-progress':
				return { variant: 'outline', disabled: false, label: 'Continue' };
			case 'unlocked':
				return { variant: 'default', disabled: false, label: 'Start Module' };
			default:
				return { variant: 'ghost', disabled: true, label: 'Locked' };
		}
	}
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<!-- Header -->
			<div class="flex flex-col gap-2 px-4 lg:px-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-semibold text-foreground">Your Personalized Curriculum</h1>
						<p class="text-muted-foreground">
							{hasData
								? `Based on your assessment, we identified ${modules.length} focus areas.`
								: 'Take an assessment to generate your personalized learning path.'}
						</p>
					</div>
					<div class="flex items-center gap-4">
						<div class="hidden flex-col items-end sm:flex">
							<span class="text-sm text-muted-foreground">Path Progress</span>
							<Progress value={pathProgress} class="w-48" />
						</div>
						<a href="/assessment">
							<Button variant="outline" size="sm">
								<RefreshCw class="mr-1 size-3.5" />
								Retake Assessment
							</Button>
						</a>
					</div>
				</div>
			</div>

			{#if loading}
				<div class="flex items-center justify-center py-20">
					<p class="text-muted-foreground">Analyzing your results...</p>
				</div>
			{:else if !hasData}
				<div class="flex flex-col items-center justify-center gap-4 py-20">
					<BrainCircuit class="size-12 text-muted-foreground" />
					<p class="text-lg font-medium text-muted-foreground">No assessment data yet</p>
					<p class="text-sm text-muted-foreground">
						Complete an assessment to unlock your personalized learning path.
					</p>
					<a href="/assessment">
						<Button variant="default">Start Assessment</Button>
					</a>
				</div>
			{:else}
				<!-- Legend -->
				<div class="flex flex-wrap items-center gap-6 px-4 lg:px-6">
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<div class="size-4 rounded-full bg-primary border border-primary" />
						Unlocked
					</div>
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<div class="size-4 rounded-full bg-muted border border-border" />
						Locked
					</div>
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<div class="size-4 rounded-full bg-success border border-success" />
						Complete
					</div>
					<div class="flex items-center gap-2 text-sm text-muted-foreground">
						<Flame class="size-4 text-warning" />
						In Progress
					</div>
				</div>

				<!-- Module Timeline -->
				<div class="px-4 lg:px-6">
					<div class="relative space-y-6">
						{#each modules as module, index}
							{#if index > 0}
								<div
									class="absolute left-5 top-0 h-6 w-0.5 -translate-x-1/2 bg-border"
									style="top: -24px;"
								/>
							{/if}

							<Card.Root
								class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
							>
								<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<div class="flex items-start gap-4">
										<!-- Node -->
										<div
											class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 {getNodeColor(
												module.status
											)}"
										>
											{#if module.status === 'complete'}
												<CheckCircle2 class="size-5 text-success-foreground" />
											{:else if module.status === 'locked'}
												<Lock class="size-4 text-muted-foreground" />
											{:else if module.status === 'in-progress'}
												<Flame class="size-4 text-warning-foreground" />
											{:else}
												<div class="size-3 rounded-full bg-primary-foreground/50" />
											{/if}
										</div>

										<!-- Content -->
										<div class="flex flex-col gap-1">
											<div class="flex items-center gap-2">
												<h3 class="text-lg font-semibold">{module.title}</h3>
												<Badge
													variant={getStatusBadge(module.status).variant}
													class={getStatusBadge(module.status).color}
												>
													{getStatusBadge(module.status).label}
												</Badge>
											</div>
											<p class="text-sm text-muted-foreground">{module.description}</p>
											<div class="mt-2 flex items-center gap-4">
												<div class="flex items-center gap-1">
													{#each Array(module.lessons.length) as _, i}
														<div
															class="size-2.5 rounded-full {i <
															module.lessons.filter((l) => l.completed).length
																? 'bg-success'
																: module.status === 'in-progress' &&
																	  i === module.lessons.filter((l) => l.completed).length
																	? 'bg-warning animate-pulse'
																	: 'bg-border'}"
														/>
													{/each}
												</div>
												<span class="text-xs text-muted-foreground">
													{module.lessons.filter((l) => l.completed).length} of {module.lessons
														.length} lessons complete
												</span>
											</div>
										</div>
									</div>

									<!-- Action Button -->
									<div class="ml-14 md:ml-0">
										<Button
											variant={getButtonProps(module.status).variant}
											size="default"
											disabled={getButtonProps(module.status).disabled}
											onclick={module.status !== 'locked' ? notReady : undefined}
										>
											{getButtonProps(module.status).label}
											{#if getButtonProps(module.status).variant === 'default'}
												<ArrowRight class="ml-1 size-4" />
											{/if}
										</Button>
									</div>
								</div>
							</Card.Root>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
