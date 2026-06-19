<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
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
		ArrowRight,
		WifiOff,
		AlertCircle
	} from '@lucide/svelte';
	import { db, type QuizResult, type ActivityEntry } from '$lib/db';
	import { Dialog } from '$lib/components/ui/dialog/index.js';

	const SEED_NAME_KEY = 'lexigap:user_name';

	// ─── State ─────────────────────────────────────────────────
	let userName = $state<string>('');
	let overallScore = $state<number | null>(null);
	let streak = $state(0);
	let recentActivity = $state<
		Array<{
			icon: string;
			title: string;
			meta: string;
			status: 'Completed' | 'In Progress' | 'Not Started';
		}>
	>([]);
	let metrics = $state<Array<{ label: string; score: number; tag: string }>>([]);
	let loading = $state(true);
	let showNameDialog = $state(false);
	let nameInput = $state('');

	// ─── Load data from svelte-idb ─────────────────────────────
	async function loadDashboard() {
		if (!browser) return;
		try {
			const results = (await db.quiz_results.getAll()) as unknown as QuizResult[];
			const activity = (await db.activity_log.getAll()) as unknown as ActivityEntry[];

			// Calculate overall score from latest result
			if (results.length > 0) {
				const sorted = results.sort((a, b) => b.completedAt - a.completedAt);
				overallScore = sorted[0].score;

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
				metrics = Array.from(metricMap.entries()).map(([tag, data]) => ({
					label: tag,
					tag,
					score: Math.round((data.correct / data.total) * 100)
				}));
			}

			// Calculate streak from activity log
			if (activity.length > 0) {
				const dates = [
					...new Set(activity.map((a) => new Date(a.timestamp).toISOString().slice(0, 10)))
				]
					.sort()
					.reverse();
				let currentStreak = 0;
				const today = new Date().toISOString().slice(0, 10);
				let checkDate = today;
				for (const date of dates) {
					if (date === checkDate || date === getPreviousDate(checkDate)) {
						currentStreak++;
						checkDate = date;
					} else if (date < checkDate) {
						break;
					}
				}
				streak = currentStreak;
			}

			// Recent activity
			recentActivity = activity
				.slice(-5)
				.reverse()
				.map((a) => ({
					icon:
						a.type === 'assessment' ? 'BrainCircuit' : a.type === 'lesson' ? 'BookOpen' : 'Route',
					title: a.description,
					meta: timeAgo(a.timestamp),
					status: 'Completed' as const
				}));
		} catch {
			// IndexedDB not available
		} finally {
			loading = false;
		}
	}

	function getPreviousDate(dateStr: string): string {
		const d = new Date(dateStr);
		d.setDate(d.getDate() - 1);
		return d.toISOString().slice(0, 10);
	}

	function timeAgo(timestamp: number): string {
		const diff = Date.now() - timestamp;
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return 'Just now';
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}

	// ─── Name dialog ───────────────────────────────────────────
	function checkName() {
		if (!browser) return;
		const stored = localStorage.getItem(SEED_NAME_KEY);
		if (stored) {
			userName = stored;
		} else {
			showNameDialog = true;
		}
	}

	function saveName() {
		const name = nameInput.trim();
		if (name) {
			userName = name;
			localStorage.setItem(SEED_NAME_KEY, name);
			showNameDialog = false;
			toast.success(`Welcome, ${name}!`);
		}
	}

	// ─── Dead link handler ─────────────────────────────────────
	function notReady(event: MouseEvent) {
		event.preventDefault();
		toast.info('This feature is not ready yet');
	}

	// ─── Init ──────────────────────────────────────────────────
	$effect(() => {
		loadDashboard();
		checkName();
	});

	// ─── Derived ───────────────────────────────────────────────
	let statusLabel = $derived(
		overallScore !== null
			? overallScore >= 70
				? 'Strong'
				: overallScore >= 40
					? 'Developing'
					: 'Focus Area'
			: null
	);
	let statusColor = $derived(
		statusLabel === 'Strong'
			? 'text-success border-success/30'
			: statusLabel === 'Developing'
				? 'text-warning border-warning/30'
				: 'text-destructive border-destructive/30'
	);
	let greeting = $derived(userName ? `Welcome back, ${userName}.` : 'Welcome back!');
</script>

{#if showNameDialog}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		role="dialog"
		aria-modal="true"
	>
		<Card.Root class="w-full max-w-sm rounded-xl border-border/50 p-6 shadow-lg">
			<h2 class="text-lg font-semibold">What's your name?</h2>
			<p class="mt-1 text-sm text-muted-foreground">We'll use this for your dashboard greeting.</p>
			<input
				type="text"
				placeholder="Enter your name"
				class="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				bind:value={nameInput}
				onkeydown={(e) => e.key === 'Enter' && saveName()}
			/>
			<div class="mt-4 flex justify-end gap-2">
				<Button
					variant="ghost"
					onclick={() => {
						showNameDialog = false;
					}}>Skip</Button
				>
				<Button onclick={saveName}>Save</Button>
			</div>
		</Card.Root>
	</div>
{/if}

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			<!-- Welcome Header -->
			<div class="flex flex-col gap-2 px-4 lg:px-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-semibold text-foreground">{greeting}</h1>
						<p class="text-muted-foreground">Here's your grammar profile.</p>
					</div>
					<a href="/assessment">
						<Button size="default">
							<Play class="mr-1 size-4" />
							{overallScore !== null ? 'Retake Assessment' : 'Start Assessment'}
						</Button>
					</a>
				</div>
			</div>

			{#if loading}
				<div class="flex items-center justify-center py-20">
					<p class="text-muted-foreground">Loading your profile...</p>
				</div>
			{:else}
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
								{#if overallScore !== null}
									<p class="text-5xl font-bold text-primary">{overallScore}%</p>
									<div class="mt-2 flex items-center gap-2">
										<Badge variant="outline" class={statusColor}>
											{#if statusLabel === 'Strong'}
												<TrendingUp class="size-3" />
											{:else if statusLabel === 'Developing'}
												<ArrowRight class="size-3" />
											{:else}
												<TrendingDown class="size-3" />
											{/if}
											{statusLabel}
										</Badge>
									</div>
								{:else}
									<p class="text-lg text-muted-foreground">No data yet</p>
									<p class="mt-1 text-sm text-muted-foreground">
										Take an assessment to get started
									</p>
								{/if}
							</div>
							{#if overallScore !== null}
								<Progress value={overallScore} class="w-32" />
							{/if}
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
								<p class="text-3xl font-bold text-warning">{streak}</p>
								<p class="text-sm text-muted-foreground">Day Streak</p>
								<p class="text-xs font-medium text-success">
									{streak > 0 ? 'Keep it up!' : 'Complete an assessment to start your streak'}
								</p>
							</div>
						</div>
					</Card.Root>

					<!-- Skill Cards from real data -->
					{#if metrics.length > 0}
						{#each metrics as metric}
							<Card.Root
								class="rounded-xl border border-border/50 p-5 transition-all duration-200 hover:border-primary/30"
							>
								<div class="mb-3 flex items-center gap-2">
									<div class="flex size-8 items-center justify-center rounded-md bg-muted">
										<BarChart3 class="size-4 text-primary" />
									</div>
									<span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
										{metric.label}
									</span>
								</div>
								<p class="mb-2 text-3xl font-bold text-foreground">{metric.score}%</p>
								<Progress value={metric.score} class="mb-3 h-1" />
								<Badge
									variant="outline"
									class={metric.score >= 70
										? 'border-success/30 text-success'
										: metric.score >= 40
											? 'border-warning/30 text-warning'
											: 'border-destructive/30 text-destructive'}
								>
									{metric.score >= 70 ? 'Strong' : metric.score >= 40 ? 'Developing' : 'Focus Area'}
								</Badge>
							</Card.Root>
						{/each}
					{/if}
				</div>

				<Separator class="mx-auto max-w-5xl" />

				<!-- Recent Activity -->
				<div class="px-4 lg:px-6">
					<Card.Root class="rounded-xl border border-border/50 p-6">
						<h3 class="mb-4 text-lg font-semibold">Recent Activity</h3>
						{#if recentActivity.length > 0}
							<div class="space-y-4">
								{#each recentActivity as activity}
									<div class="flex items-center gap-3">
										<div
											class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted"
										>
											{#if activity.icon === 'BrainCircuit'}
												<BrainCircuit class="size-4 text-muted-foreground" />
											{:else if activity.icon === 'BookOpen'}
												<BookOpen class="size-4 text-muted-foreground" />
											{:else}
												<Route class="size-4 text-muted-foreground" />
											{/if}
										</div>
										<div class="flex flex-1 items-center justify-between">
											<div>
												<p class="text-sm font-medium">{activity.title}</p>
												<p class="text-xs text-muted-foreground">{activity.meta}</p>
											</div>
											<Badge variant="outline" class="border-success/30 text-success">
												{activity.status}
											</Badge>
										</div>
									</div>
									<Separator />
								{/each}
							</div>
						{:else}
							<div class="flex flex-col items-center gap-2 py-6 text-center">
								<AlertCircle class="size-8 text-muted-foreground" />
								<p class="text-sm text-muted-foreground">No activity yet. Take an assessment!</p>
							</div>
						{/if}
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
									{overallScore !== null ? 'New Assessment' : 'Start Assessment'}
								</Button>
							</a>
							<!-- Dead links → show toast -->
							<Button variant="outline" onclick={notReady}>
								<BookOpen class="mr-1 size-4" />
								Review Mistakes
							</Button>
						</div>
					</Card.Root>
				</div>
			{/if}
		</div>
	</div>
</div>
