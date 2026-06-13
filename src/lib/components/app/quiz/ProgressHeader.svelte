<script lang="ts">
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Clock } from '@lucide/svelte';

	interface Props {
		currentQuestion: number;
		totalQuestions: number;
		timeRemaining?: number; // in seconds
	}

	let { currentQuestion, totalQuestions, timeRemaining = 300 }: Props = $props();

	let progressValue = $derived((currentQuestion / totalQuestions) * 100);
	let minutes = $derived(Math.floor(timeRemaining / 60));
	let seconds = $derived(timeRemaining % 60);
	let timeColor = $derived(
		timeRemaining < 30
			? 'text-destructive'
			: timeRemaining < 60
				? 'text-warning'
				: 'text-muted-foreground'
	);
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">
			Question <span class="text-foreground font-bold">{currentQuestion}</span> of {totalQuestions}
		</span>
		<div class="flex items-center gap-2 {timeColor}">
			<Clock class="size-4" />
			<span class="font-mono text-sm font-semibold">
				{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
			</span>
		</div>
	</div>
	<Progress value={progressValue} class="h-2" />
</div>
