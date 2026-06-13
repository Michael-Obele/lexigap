<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		Play,
		Route,
		BookOpen,
		BrainCircuit,
		Zap,
		BarChart3,
		Target,
		Flame,
		TrendingUp,
		TrendingDown,
		ArrowRight
	} from '@lucide/svelte';

	interface SkillCard {
		name: string;
		score: number;
		icon: typeof Zap;
		color: string;
		status: 'Strong' | 'Developing' | 'Focus Area';
	}

	const skills: SkillCard[] = [
		{ name: 'Verbs', score: 80, icon: Zap, color: 'text-primary', status: 'Strong' },
		{
			name: 'Prepositions',
			score: 60,
			icon: ArrowRight,
			color: 'text-chart-2',
			status: 'Developing'
		},
		{ name: 'Nouns', score: 90, icon: Target, color: 'text-chart-3', status: 'Strong' },
		{ name: 'Adjectives', score: 75, icon: BarChart3, color: 'text-chart-4', status: 'Developing' }
	];

	interface Activity {
		icon: typeof BrainCircuit;
		title: string;
		meta: string;
		status: 'Completed' | 'In Progress' | 'Not Started';
	}

	const activities: Activity[] = [
		{ icon: BrainCircuit, title: 'Assessment — 78%', meta: '2 days ago', status: 'Completed' },
		{ icon: BookOpen, title: 'Lesson: Verbs', meta: '3 days ago', status: 'Completed' },
		{ icon: Route, title: 'Lesson: Prepositions', meta: 'In progress', status: 'In Progress' }
	];

	function getStatusColor(status: string): string {
		switch (status) {
			case 'Completed':
				return 'border-success/30 text-success';
			case 'In Progress':
				return 'border-primary/30 text-primary';
			default:
				return 'border-muted text-muted-foreground';
		}
	}

	function getSkillStatusColor(status: string): string {
		switch (status) {
			case 'Strong':
				return 'border-success/30 text-success';
			case 'Developing':
				return 'border-warning/30 text-warning';
			default:
				return 'border-destructive/30 text-destructive';
		}
	}
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<!-- Welcome Header -->
			<div class="flex flex-col gap-2 px-4 lg:px-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-semibold text-foreground">Welcome back, Alex.</h1>
						<p class="text-muted-foreground">Here's your grammar profile.</p>
					</div>
					<a href="/assessment">
						<Button size="default">
							<Play class="mr-1 size-4" />
							Retake Assessment
						</Button>
					</a>
				</div>
			</div>

			<!-- Bento Grid -->
			<div class="grid grid-cols-1 gap-4 px-4 md:grid-cols-4 lg:gap-6 lg:px-6">
				<!-- Overall Score Card -->
				<Card.Root
					class="col-span-1 rounded-xl border-t-2 border-t-primary border-border/50 p-6 transition-all duration-200 hover:border-primary/30 md:col-span-2"
				>
					<p class="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
						Overall Score
					</p>
					<div class="flex items-end justify-between">
						<div>
							<p class="text-5xl font-bold text-primary">78%</p>
							<div class="mt-2 flex items-center gap-2">
								<Badge variant="outline" class="border-success/30 text-success">
									<TrendingUp class="mr-1 size-3" />
									+5%
								</Badge>
								<span class="text-xs text-muted-foreground">from last assessment</span>
							</div>
						</div>
						<Progress value={78} class="w-32" />
					</div>
				</Card.Root>

				<!-- Streak Card -->
				<Card.Root
					class="col-span-1 rounded-xl border-t-2 border-t-warning border-border/50 p-6 transition-all duration-200 hover:border-warning/30 md:col-span-2"
				>
					<div class="flex items-center gap-4">
						<div class="flex size-12 items-center justify-center rounded-full bg-warning/10">
							<Flame class="size-6 text-warning" />
						</div>
						<div>
							<p class="text-3xl font-bold text-warning">5</p>
							<p class="text-sm text-muted-foreground">Day Streak</p>
							<p class="text-xs font-medium text-success">Keep it up!</p>
						</div>
					</div>
				</Card.Root>

				<!-- Skill Cards -->
				{#each skills as skill}
					<Card.Root
						class="rounded-xl border border-border/50 p-5 transition-all duration-200 hover:border-primary/30"
					>
						<div class="mb-3 flex items-center gap-2">
							<div class="flex size-8 items-center justify-center rounded-md bg-muted">
								<skill.icon class="size-4 {skill.color}" />
							</div>
							<span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
								{skill.name}
							</span>
						</div>
						<p class="mb-2 text-3xl font-bold text-foreground">{skill.score}%</p>
						<Progress value={skill.score} class="mb-3 h-1" />
						<Badge variant="outline" class={getSkillStatusColor(skill.status)}>
							{skill.status}
						</Badge>
					</Card.Root>
				{/each}
			</div>

			<Separator class="mx-auto max-w-5xl" />

			<!-- Recent Activity -->
			<div class="px-4 lg:px-6">
				<Card.Root class="rounded-xl border border-border/50 p-6">
					<h3 class="mb-4 text-lg font-semibold">Recent Activity</h3>
					<div class="space-y-4">
						{#each activities as activity}
							<div class="flex items-center gap-3">
								<div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
									<activity.icon class="size-4 text-muted-foreground" />
								</div>
								<div class="flex flex-1 items-center justify-between">
									<div>
										<p class="text-sm font-medium">{activity.title}</p>
										<p class="text-xs text-muted-foreground">{activity.meta}</p>
									</div>
									<Badge variant="outline" class={getStatusColor(activity.status)}>
										{activity.status}
									</Badge>
								</div>
							</div>
							<Separator />
						{/each}
					</div>
					<div class="mt-4">
						<Button variant="ghost" size="sm" class="gap-1">
							View All
							<ArrowRight class="size-3.5" />
						</Button>
					</div>
				</Card.Root>
			</div>

			<!-- Quick Actions -->
			<div class="px-4 lg:px-6">
				<Card.Root class="rounded-xl border border-border/50 p-6">
					<h3 class="mb-4 text-lg font-semibold">Quick Actions</h3>
					<div class="flex flex-wrap gap-4">
						<a href="/assessment">
							<Button variant="default">
								<Play class="mr-1 size-4" />
								Start New Assessment
							</Button>
						</a>
						<a href="/learning-path">
							<Button variant="outline">
								<Route class="mr-1 size-4" />
								View Learning Path
							</Button>
						</a>
						<a href="/lesson">
							<Button variant="outline">
								<BookOpen class="mr-1 size-4" />
								Review Mistakes
							</Button>
						</a>
					</div>
				</Card.Root>
			</div>
		</div>
	</div>
</div>
