<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Route, RefreshCw, Zap, ArrowRight, Lock, CheckCircle2, Flame } from '@lucide/svelte';

	interface Module {
		id: number;
		title: string;
		description: string;
		lessons: number;
		completed: number;
		status: 'complete' | 'in-progress' | 'unlocked' | 'locked';
		icon: typeof Zap;
		color: string;
	}

	const modules: Module[] = [
		{
			id: 1,
			title: 'Mastering Past Tense',
			description: 'Learn to correctly use past tense verbs in various contexts.',
			lessons: 5,
			completed: 5,
			status: 'complete',
			icon: Zap,
			color: 'text-primary'
		},
		{
			id: 2,
			title: 'Common Prepositions',
			description: 'Master in, on, at, by, and other essential prepositions.',
			lessons: 8,
			completed: 3,
			status: 'in-progress',
			icon: ArrowRight,
			color: 'text-chart-2'
		},
		{
			id: 3,
			title: 'Plural Forms & Articles',
			description: 'Understand when to use a, an, the, and plural noun forms.',
			lessons: 6,
			completed: 0,
			status: 'unlocked',
			icon: Zap,
			color: 'text-chart-3'
		},
		{
			id: 4,
			title: 'Comparative & Superlative',
			description: 'Learn how to compare things using adjectives correctly.',
			lessons: 4,
			completed: 0,
			status: 'locked',
			icon: Zap,
			color: 'text-chart-4'
		},
		{
			id: 5,
			title: 'Adverb Position & Usage',
			description: 'Place adverbs correctly in sentences for clear meaning.',
			lessons: 5,
			completed: 0,
			status: 'locked',
			icon: Zap,
			color: 'text-chart-5'
		}
	];

	const totalLessons = modules.reduce((sum, m) => sum + m.lessons, 0);
	const completedLessons = modules.reduce((sum, m) => sum + m.completed, 0);
	const pathProgress = $derived(Math.round((completedLessons / totalLessons) * 100));

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
		variant: 'default' | 'outline' | 'ghost' | 'secondary';
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
							Based on your assessment, we identified {modules.length} focus areas. Complete them in order.
						</p>
					</div>
					<div class="flex items-center gap-4">
						<div class="hidden flex-col items-end sm:flex">
							<span class="text-sm text-muted-foreground">Path Progress</span>
							<Progress value={pathProgress} class="w-48" />
						</div>
						<Button variant="outline" size="sm">
							<RefreshCw class="mr-1 size-3.5" />
							Retake Assessment
						</Button>
					</div>
				</div>
			</div>

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
						<!-- Connector Line -->
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
												{#each Array(module.lessons) as _, i}
													<div
														class="size-2.5 rounded-full {i < module.completed
															? 'bg-success'
															: module.status === 'in-progress' && i === module.completed
																? 'bg-warning animate-pulse'
																: 'bg-border'}"
													/>
												{/each}
											</div>
											<span class="text-xs text-muted-foreground">
												{module.completed} of {module.lessons} lessons complete
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
		</div>
	</div>
</div>
