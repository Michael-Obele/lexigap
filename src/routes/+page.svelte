<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		BookOpen,
		ArrowRight,
		Zap,
		BarChart3,
		Route,
		Target,
		BrainCircuit
	} from '@lucide/svelte';

	let scrolled = $state(false);

	function handleScroll() {
		scrolled = window.scrollY > 20;
	}

	import { onMount } from 'svelte';

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<!-- Navigation -->
<nav
	class="fixed top-0 left-0 right-0 z-30 transition-all duration-200"
	class:border-b={scrolled}
	class:bg-background={scrolled}
	class:backdrop-blur-md={scrolled}
>
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
		<a href="/" class="flex items-center gap-2 font-semibold">
			<div
				class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
			>
				<BookOpen class="size-4" />
			</div>
			LexiGap
		</a>
		<div class="hidden items-center gap-8 md:flex">
			<a
				href="#features"
				class="text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				Features
			</a>
			<a
				href="#how-it-works"
				class="text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				How it works
			</a>
		</div>
		<div class="flex items-center gap-3">
			<a href="/login">
				<Button variant="ghost" size="sm">Log in</Button>
			</a>
			<a href="/register">
				<Button size="sm">Get Started</Button>
			</a>
		</div>
	</div>
</nav>

<!-- Hero Section -->
<section class="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24">
	<div class="mx-auto max-w-3xl text-center">
		<div class="mb-6 flex items-center justify-center">
			<Badge variant="outline" class="border-primary/30 text-primary">Algorithmic Assessment</Badge>
		</div>
		<h1
			class="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl"
		>
			Master Grammar.<br />
			<span class="text-primary">One Gap at a Time.</span>
		</h1>
		<p class="mx-auto mb-10 max-w-xl text-lg text-muted-foreground sm:text-xl">
			Algorithmic cloze tests generate a personalized learning path in under 5 minutes.
		</p>
		<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
			<a href="/assessment">
				<Button size="lg" class="rounded-full px-8 text-base">
					Start Assessment
					<ArrowRight class="ml-2 size-4" />
				</Button>
			</a>
		</div>
		<p class="mt-4 text-sm text-muted-foreground">No signup required</p>
	</div>

	<!-- Bento Preview Cards -->
	<div class="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<BrainCircuit class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 text-lg font-semibold">Grammar Profile</h3>
			<p class="text-sm text-muted-foreground">
				Visual breakdown of your strengths and weaknesses across parts of speech.
			</p>
		</Card.Root>
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<Route class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 text-lg font-semibold">Learning Path</h3>
			<p class="text-sm text-muted-foreground">
				A personalized curriculum tailored to your specific gaps.
			</p>
		</Card.Root>
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<Target class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 text-lg font-semibold">Progress Tracking</h3>
			<p class="text-sm text-muted-foreground">
				Daily streaks, accuracy trends, and skill mastery over time.
			</p>
		</Card.Root>
	</div>
</section>

<Separator class="mx-auto max-w-5xl" />

<!-- Features Section -->
<section id="features" class="mx-auto max-w-5xl px-6 py-20">
	<div class="mb-12 text-center">
		<h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why LexiGap?</h2>
		<p class="mx-auto max-w-xl text-muted-foreground">
			Deterministic algorithms, not expensive LLMs. Fast, private, and accurate.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-2">
		<!-- Large Card: Dynamic Generation -->
		<Card.Root
			class="col-span-1 row-span-1 rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30 md:col-span-1 md:row-span-2"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<Zap class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 text-xl font-semibold">Dynamic Generation</h3>
			<p class="mb-4 text-muted-foreground">
				NLP-powered cloze tests created algorithmically from curated text corpora. No manual
				question banks needed.
			</p>
			<div class="rounded-lg bg-muted/50 p-4 font-mono text-sm text-muted-foreground">
				<span class="text-primary">compromise</span>(text)<br />
				&nbsp;&nbsp;.match('#Verb')<br />
				&nbsp;&nbsp;.blank()<br />
				&nbsp;&nbsp;.distractors()
			</div>
		</Card.Root>

		<!-- Grammar Analysis -->
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<BarChart3 class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 text-lg font-semibold">Grammar Analysis</h3>
			<p class="text-sm text-muted-foreground">
				Identify weaknesses across 8+ parts of speech with visual radar charts.
			</p>
		</Card.Root>

		<!-- Personalized Path -->
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<Route class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 text-lg font-semibold">Personalized Path</h3>
			<p class="text-sm text-muted-foreground">
				A curriculum tailored to your specific gaps, not generic lessons.
			</p>
		</Card.Root>
	</div>
</section>

<Separator class="mx-auto max-w-5xl" />

<!-- How It Works Section -->
<section id="how-it-works" class="mx-auto max-w-5xl px-6 py-20">
	<div class="mb-12 text-center">
		<h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
		<p class="mx-auto max-w-xl text-muted-foreground">
			Three simple steps to a better command of English grammar.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		<!-- Step 1 -->
		<div class="flex flex-col items-center text-center">
			<div class="relative mb-6">
				<div class="flex size-16 items-center justify-center rounded-full bg-muted">
					<BrainCircuit class="size-8 text-primary" />
				</div>
				<span class="absolute -right-2 -top-2 text-4xl font-bold text-primary/10">01</span>
			</div>
			<h3 class="mb-2 text-xl font-semibold">Assess</h3>
			<p class="text-sm text-muted-foreground">
				Take a 20-question rapid-fire cloze and vocabulary quiz.
			</p>
		</div>

		<!-- Step 2 -->
		<div class="flex flex-col items-center text-center">
			<div class="relative mb-6">
				<div class="flex size-16 items-center justify-center rounded-full bg-muted">
					<BarChart3 class="size-8 text-primary" />
				</div>
				<span class="absolute -right-2 -top-2 text-4xl font-bold text-primary/10">02</span>
			</div>
			<h3 class="mb-2 text-xl font-semibold">Analyze</h3>
			<p class="text-sm text-muted-foreground">
				Get a detailed grammar profile showing your strengths and weaknesses.
			</p>
		</div>

		<!-- Step 3 -->
		<div class="flex flex-col items-center text-center">
			<div class="relative mb-6">
				<div class="flex size-16 items-center justify-center rounded-full bg-muted">
					<Route class="size-8 text-primary" />
				</div>
				<span class="absolute -right-2 -top-2 text-4xl font-bold text-primary/10">03</span>
			</div>
			<h3 class="mb-2 text-xl font-semibold">Learn</h3>
			<p class="text-sm text-muted-foreground">
				Follow a personalized learning path focused on your weakest areas.
			</p>
		</div>
	</div>
</section>

<Separator class="mx-auto max-w-5xl" />

<!-- CTA Footer -->
<section class="mx-auto max-w-5xl px-6 py-20 text-center">
	<h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
		Ready to find your grammar gaps?
	</h2>
	<p class="mx-auto mb-8 max-w-md text-muted-foreground">
		Start your free assessment and get a personalized learning path in under 5 minutes.
	</p>
	<a href="/assessment">
		<Button size="lg" class="rounded-full px-8 text-base">
			Start Free Assessment
			<ArrowRight class="ml-2 size-4" />
		</Button>
	</a>

	<div class="mt-16 border-t border-border pt-8">
		<div class="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
			<span>© LexiGap</span>
			<span class="transition-colors hover:text-foreground">Privacy</span>
			<span class="transition-colors hover:text-foreground">Terms</span>
			<span class="transition-colors hover:text-foreground">GitHub</span>
		</div>
	</div>
</section>
