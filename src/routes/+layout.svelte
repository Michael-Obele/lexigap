<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser, dev } from '$app/environment';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { Agentation, type AnnotationProps } from 'sv-agentation';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/landing/footer.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar />
<div class="min-h-screen">
	{@render children()}
</div>
<Footer />

{#if browser && dev}
	<Agentation />
{/if}
