<script lang="ts">
	import { Progress } from '$lib/components/ui/progress/index.js';

	interface Props {
		currentQuestion: number;
		totalQuestions: number;
	}

	let { currentQuestion, totalQuestions }: Props = $props();

	let progressValue = $derived((currentQuestion / totalQuestions) * 100);
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">
			Question <span class="text-foreground font-bold">{currentQuestion}</span> of {totalQuestions}
		</span>
	</div>
	<Progress value={progressValue} class="h-2" />
</div>
