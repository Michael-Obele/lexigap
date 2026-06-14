<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import ConstructionIcon from '@lucide/svelte/icons/construction';
</script>

<div class="flex min-h-[80vh] items-center justify-center px-4">
	<Card.Root class="w-full max-w-md rounded-xl border-border/50 p-8 text-center">
		<div
			class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-indigo-500/10"
		>
			<GraduationCap class="size-8 text-indigo-400" />
		</div>
		<div class="mb-2 flex items-center justify-center gap-2">
			<ConstructionIcon class="size-5 text-indigo-400" />
			<h1 class="text-2xl font-bold text-foreground">Lessons Loading...</h1>
		</div>
		<p class="mb-2 text-sm text-muted-foreground">
			Our curriculum designers are crafting engaging lessons just for you. Check back soon for
			interactive grammar exercises and more!
		</p>
		<p class="mb-6 text-xs text-muted-foreground/60">— The LexiGap Team</p>
		<div class="flex justify-center">
			<a href="/dashboard">
				<Button class="gap-2">
					<ConstructionIcon class="size-4" />
					Back to Dashboard
				</Button>
			</a>
		</div>
	</Card.Root>
</div>
