<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import ConstructionIcon from '@lucide/svelte/icons/construction';
</script>

<div class="flex min-h-[80vh] items-center justify-center px-4">
	<Card.Root class="w-full max-w-md rounded-xl border-border/50 p-8 text-center">
		<div class="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-amber-500/10">
			<SettingsIcon class="size-8 text-amber-400" />
		</div>
		<div class="mb-2 flex items-center justify-center gap-2">
			<ConstructionIcon class="size-5 text-amber-400" />
			<h1 class="text-2xl font-bold text-foreground">Workshop in Progress!</h1>
		</div>
		<p class="mb-2 text-sm text-muted-foreground">
			We're busy tuning every knob and flipping every switch. Settings will be ready soon so you can
			make this app truly yours.
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
