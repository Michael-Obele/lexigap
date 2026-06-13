<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Check, X } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLButtonElement> {
		letter: string;
		text: string;
		state?: 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';
	}

	let { letter, text, state = 'default', class: className, ...restProps }: Props = $props();
</script>

<button
	type="button"
	class={cn(
		'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-150',
		state === 'default' && 'border-border bg-card hover:bg-muted hover:border-ring',
		state === 'selected' && 'border-primary bg-primary/10',
		state === 'correct' && 'border-success bg-success/10',
		state === 'incorrect' && 'border-destructive bg-destructive/10',
		state === 'disabled' && 'cursor-not-allowed opacity-50',
		className
	)}
	disabled={state === 'disabled'}
	{...restProps}
>
	<span
		class={cn(
			'flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold',
			state === 'default' && 'bg-muted text-muted-foreground',
			state === 'selected' && 'bg-primary/20 text-primary',
			state === 'correct' && 'bg-success/20 text-success',
			state === 'incorrect' && 'bg-destructive/20 text-destructive',
			state === 'disabled' && 'bg-muted text-muted-foreground'
		)}
	>
		{letter}
	</span>
	<span class="flex-1 font-medium">{text}</span>
	{#if state === 'correct'}
		<Check class="size-5 text-success" />
	{/if}
	{#if state === 'incorrect'}
		<X class="size-5 text-destructive" />
	{/if}
</button>
