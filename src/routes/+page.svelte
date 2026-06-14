<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		ArrowRight,
		BrainCircuit,
		Route,
		Target,
		Zap,
		BarChart3,
		Puzzle,
		Check
	} from '@lucide/svelte';
	import Footer from '$lib/components/landing/footer.svelte';
	import { TextHighlighter } from '$lib/components/fancy/text-highlighter';
	import { MediaBetweenText } from '$lib/components/fancy/media-between-text';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	// Live demo cycling words
	const demoWords = ['sat', 'slept', 'jumped', 'rested'];
	let demoIndex = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			demoIndex = (demoIndex + 1) % demoWords.length;
		}, 2000);
		return () => clearInterval(interval);
	});
</script>

<!-- Hero Section -->
<section class="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
	<!-- Ambient background -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute -top-1/4 left-1/2 size-150 -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
		></div>
		<div class="absolute bottom-0 right-0 size-100 rounded-full bg-primary/3 blur-[100px]"></div>
	</div>

	<div class="relative mx-auto max-w-4xl text-center">
		<Badge variant="outline" class="mb-6 border-primary/30 text-primary">
			Algorithmic Assessment
		</Badge>

		<!-- <MediaBetweenText
			firstText="Master"
			secondText="Grammar"
			mediaUrl="Your"
			mediaType="text"
			triggerType="hover"
			class="mb-6 gap-2 font-sans text-5xl font-bold text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
			mediaContainerClass="overflow-hidden"
			leftTextClass="text-foreground"
			rightTextClass="text-foreground"
		/> -->

		<h1
			class="mb-6 font-sans text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
		>
			Master Grammar.<br />
			One

			<span class="relative inline-block">
				<TextHighlighter
					as="span"
					triggerType="inView"
					highlightColor="oklch(0.55 0.12 165 / 0.25)"
					class="text-primary"
				>
					Gap
				</TextHighlighter>
			</span> at a Time.
		</h1>

		<p class="mx-auto mb-10 max-w-xl font-serif text-lg text-muted-foreground sm:text-xl">
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

		<!-- Media Between Text -->
		<div class="mt-8 flex justify-center">
			<MediaBetweenText
				firstText="Find"
				secondText="Your Gaps"
				mediaUrl="/mock-grammar.svg"
				mediaType="image"
				triggerType="hover"
				class="items-center gap-2 text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl"
				mediaContainerClass="h-12 overflow-hidden rounded-md sm:h-14 md:h-16"
				leftTextClass="text-foreground"
				rightTextClass="text-foreground"
			/>
		</div>
	</div>

	<!-- Bento Preview Cards -->
	<div class="relative mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<BrainCircuit class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 font-sans text-lg font-semibold">Grammar Profile</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Visual breakdown of your strengths and weaknesses across parts of speech.
			</p>
		</Card.Root>
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<Route class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 font-sans text-lg font-semibold">Learning Path</h3>
			<p class="font-serif text-sm text-muted-foreground">
				A personalized curriculum tailored to your specific gaps.
			</p>
		</Card.Root>
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<Target class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 font-sans text-lg font-semibold">Progress Tracking</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Daily streaks, accuracy trends, and skill mastery over time.
			</p>
		</Card.Root>
	</div>
</section>

<Separator class="mx-auto max-w-5xl" />

<!-- Live Concept Section -->
<section id="concept" class="mx-auto max-w-5xl px-6 py-20">
	<div class="mb-12 text-center">
		<h2 class="mb-4 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
			See It in Action
		</h2>
		<p class="mx-auto max-w-xl font-serif text-muted-foreground">
			Watch how LexiGap identifies gaps in real sentences and generates targeted practice.
		</p>
	</div>

	<div class="rounded-xl border border-border/50 bg-card p-8 md:p-12">
		<div class="flex flex-col items-center gap-8">
			<div class="font-mono text-xl text-foreground md:text-2xl">
				The cat
				<span
					class="relative inline-flex min-w-[6ch] overflow-hidden border-b-2 border-primary align-middle"
					style="height: 1.25em;"
				>
					{#key demoWords[demoIndex]}
						<span
							class="absolute inset-x-0 flex h-full items-center justify-center text-primary"
							in:fly={{ y: 20, duration: 260, easing: cubicOut }}
							out:fly={{ y: -20, duration: 200, easing: cubicOut }}
						>
							{demoWords[demoIndex]}
						</span>
					{/key}
				</span>
				on the mat.
			</div>
			<div class="flex flex-wrap items-center justify-center gap-3">
				{#each demoWords as word, i (word)}
					<span
						class="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 {i ===
						demoIndex
							? 'bg-primary text-primary-foreground'
							: 'bg-muted text-muted-foreground'}"
					>
						{#if i === demoIndex}
							<span in:fly={{ y: 6, duration: 200 }} out:fly={{ y: -6, duration: 150 }}>
								<Check class="size-3.5" />
							</span>
						{/if}
						{word}
					</span>
				{/each}
			</div>
			<p class="max-w-md text-center text-sm text-muted-foreground">
				The algorithm cycles through possible words, testing your knowledge of verb forms and
				context.
			</p>
		</div>
	</div>
</section>

<Separator class="mx-auto max-w-5xl" />

<!-- Features Section -->
<section id="features" class="mx-auto max-w-5xl px-6 py-20">
	<div class="mb-12 text-center">
		<h2 class="mb-4 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
			Why LexiGap?
		</h2>
		<p class="mx-auto max-w-xl font-serif text-muted-foreground">
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
			<h3 class="mb-2 font-sans text-xl font-semibold">Dynamic Generation</h3>
			<p class="mb-4 font-serif text-muted-foreground">
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
			<h3 class="mb-2 font-sans text-lg font-semibold">Grammar Analysis</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Identify weaknesses across 8+ parts of speech with visual radar charts.
			</p>
		</Card.Root>

		<!-- Personalized Path -->
		<Card.Root
			class="rounded-xl border border-border/50 p-6 transition-all duration-200 hover:border-primary/30"
		>
			<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
				<Puzzle class="size-6 text-primary" />
			</div>
			<h3 class="mb-2 font-sans text-lg font-semibold">Personalized Path</h3>
			<p class="font-serif text-sm text-muted-foreground">
				A curriculum tailored to your specific gaps, not generic lessons.
			</p>
		</Card.Root>
	</div>
</section>

<Separator class="mx-auto max-w-5xl" />

<!-- How It Works Section -->
<section id="how-it-works" class="mx-auto max-w-5xl px-6 py-20">
	<div class="mb-12 text-center">
		<h2 class="mb-4 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
			How It Works
		</h2>
		<p class="mx-auto max-w-xl font-serif text-muted-foreground">
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
				<span class="absolute -right-2 -top-2 font-sans text-4xl font-bold text-primary/10">01</span
				>
			</div>
			<h3 class="mb-2 font-sans text-xl font-semibold">Assess</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Take a 20-question rapid-fire cloze and vocabulary quiz.
			</p>
		</div>

		<!-- Step 2 -->
		<div class="flex flex-col items-center text-center">
			<div class="relative mb-6">
				<div class="flex size-16 items-center justify-center rounded-full bg-muted">
					<BarChart3 class="size-8 text-primary" />
				</div>
				<span class="absolute -right-2 -top-2 font-sans text-4xl font-bold text-primary/10">02</span
				>
			</div>
			<h3 class="mb-2 font-sans text-xl font-semibold">Analyze</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Get a detailed grammar profile showing your strengths and weaknesses.
			</p>
		</div>

		<!-- Step 3 -->
		<div class="flex flex-col items-center text-center">
			<div class="relative mb-6">
				<div class="flex size-16 items-center justify-center rounded-full bg-muted">
					<Route class="size-8 text-primary" />
				</div>
				<span class="absolute -right-2 -top-2 font-sans text-4xl font-bold text-primary/10">03</span
				>
			</div>
			<h3 class="mb-2 font-sans text-xl font-semibold">Learn</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Follow a personalized learning path focused on your weakest areas.
			</p>
		</div>
	</div>
</section>

<Separator class="mx-auto max-w-5xl" />

<!-- Powered By Section -->
<section id="powered-by" class="mx-auto max-w-5xl px-6 py-16">
	<div class="text-center">
		<h2 class="mb-4 font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
			Powered By
		</h2>
		<p class="mx-auto mb-10 max-w-xl font-serif text-muted-foreground">
			LexiGap relies on these amazing open tools and APIs.
		</p>
	</div>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<Card.Root class="rounded-xl border border-border/50 p-6 text-center">
			<div class="mb-3 flex justify-center">
				<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
					<span class="font-sans text-lg font-bold text-primary">DM</span>
				</div>
			</div>
			<h3 class="mb-2 font-sans text-lg font-semibold">Datamuse API</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Powers synonym, antonym, and distractor generation with real word frequency and
				pronunciation data.
			</p>
		</Card.Root>
		<Card.Root class="rounded-xl border border-border/50 p-6 text-center">
			<div class="mb-3 flex justify-center">
				<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
					<span class="font-sans text-lg font-bold text-primary">C9</span>
				</div>
			</div>
			<h3 class="mb-2 font-sans text-lg font-semibold">compromise</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Lightweight NLP library for POS tagging and sentence parsing — runs entirely in the browser.
			</p>
		</Card.Root>
		<Card.Root class="rounded-xl border border-border/50 p-6 text-center">
			<div class="mb-3 flex justify-center">
				<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
					<span class="font-sans text-lg font-bold text-primary">TL</span>
				</div>
			</div>
			<h3 class="mb-2 font-sans text-lg font-semibold">textlens</h3>
			<p class="font-serif text-sm text-muted-foreground">
				Readability scoring and text analysis for calibrated difficulty levels.
			</p>
		</Card.Root>
	</div>
</section>

<Separator class="mx-auto max-w-5xl" />

<!-- CTA Section -->
<section class="mx-auto max-w-5xl px-6 py-20 text-center">
	<h2 class="mb-4 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
		Ready to find your grammar gaps?
	</h2>
	<p class="mx-auto mb-8 max-w-md font-serif text-muted-foreground">
		Start your free assessment and get a personalized learning path in under 5 minutes.
	</p>
	<a href="/assessment">
		<Button size="lg" class="rounded-full px-8 text-base">
			Start Free Assessment
			<ArrowRight class="ml-2 size-4" />
		</Button>
	</a>
</section>
