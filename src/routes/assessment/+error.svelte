<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { AlertTriangle, RefreshCw } from '@lucide/svelte';

	let { error, status } = $props<{ error: App.Error; status: number }>();

	async function retry() {
		await invalidateAll();
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-10">
	<Card.Root class="w-full max-w-lg rounded-xl border-border/50 p-8 text-center">
		<div
			class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
		>
			<AlertTriangle class="size-6" />
		</div>
		<p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
			Assessment unavailable
		</p>
		<h1 class="mt-2 text-2xl font-semibold text-foreground">Datamuse is not responding</h1>
		<p class="mt-3 text-sm leading-6 text-muted-foreground">
			We could not generate a full quiz because the Datamuse API is unavailable or returned too
			little content. Please try again after a moment.
		</p>
		<p class="mt-4 text-xs text-muted-foreground">Status {status}: {error.message}</p>

		<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
			<Button onclick={retry} class="gap-2">
				<RefreshCw class="size-4" />
				Retry quiz
			</Button>
			<a href="/dashboard">
				<Button variant="outline" class="w-full sm:w-auto">Go to dashboard</Button>
			</a>
		</div>
	</Card.Root>
</div>
