<script lang="ts">
	import { BookOpen, Code, Mail, ArrowUpRight } from '@lucide/svelte';

	const links = [
		{
			title: 'Product',
			items: [
				{ href: '/assessment', label: 'Assessment' },
				{ href: '/learning-path', label: 'Learning Path' },
				{ href: '/lesson', label: 'Lessons' },
				{ href: '/dashboard', label: 'Dashboard' }
			]
		},
		{
			title: 'Resources',
			items: [
				{ href: '#features', label: 'Features' },
				{ href: '#how-it-works', label: 'How it Works' },
				{ href: '#powered-by', label: 'Powered By' }
			]
		},
		{
			title: 'Legal',
			items: [
				{ href: '/privacy', label: 'Privacy Policy' },
				{ href: '/terms', label: 'Terms of Service' }
			]
		}
	];
</script>

<footer class="relative overflow-hidden bg-background pt-24 pb-8 sm:pt-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<!-- Brand and Mission -->
			<div class="space-y-8 xl:col-span-1">
				<a href="/" class="group flex items-center gap-3">
					<div
						class="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-6"
					>
						<BookOpen class="size-5" />
					</div>
					<span class="text-2xl font-bold tracking-tight text-foreground">LexiGap</span>
				</a>
				<p class="max-w-xs text-lg font-medium leading-relaxed text-muted-foreground">
					Algorithmic grammar assessment.<br />
					Personalized learning paths.<br />
					<span class="text-foreground">Zero friction.</span>
				</p>
				<div class="flex gap-4">
					<a
						href="https://github.com/Michael-Obele/lexigap"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub"
						class="group flex size-12 items-center justify-center rounded-full border border-border bg-transparent text-muted-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
					>
						<Code class="size-5 transition-transform group-hover:scale-110" />
					</a>
					<a
						href="mailto:hello@lexigap.com"
						aria-label="Email"
						class="group flex size-12 items-center justify-center rounded-full border border-border bg-transparent text-muted-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
					>
						<Mail class="size-5 transition-transform group-hover:scale-110" />
					</a>
				</div>
			</div>

			<!-- Navigation -->
			<div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
				<div class="md:grid md:grid-cols-2 md:gap-8">
					<div>
						<h3 class="text-sm font-semibold tracking-wider text-foreground uppercase">
							{links[0].title}
						</h3>
						<ul class="mt-6 space-y-4">
							{#each links[0].items as item}
								<li>
									<a
										href={item.href}
										class="group flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
									>
										{item.label}
										<ArrowUpRight
											class="ml-1 size-3 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
										/>
									</a>
								</li>
							{/each}
						</ul>
					</div>
					<div class="mt-10 md:mt-0">
						<h3 class="text-sm font-semibold tracking-wider text-foreground uppercase">
							{links[1].title}
						</h3>
						<ul class="mt-6 space-y-4">
							{#each links[1].items as item}
								<li>
									<a
										href={item.href}
										class="group flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
									>
										{item.label}
										<ArrowUpRight
											class="ml-1 size-3 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
										/>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
				<div class="md:grid md:grid-cols-2 md:gap-8">
					<div>
						<h3 class="text-sm font-semibold tracking-wider text-foreground uppercase">
							{links[2].title}
						</h3>
						<ul class="mt-6 space-y-4">
							{#each links[2].items as item}
								<li>
									<a
										href={item.href}
										class="group flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
									>
										{item.label}
										<ArrowUpRight
											class="ml-1 size-3 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
										/>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Giant typography watermark & Bottom bar -->
	<div class="relative mt-24 border-t border-border/40 pt-8 sm:mt-32">
		<div
			class="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden opacity-5 pointer-events-none select-none"
		>
			<span
				class="whitespace-nowrap font-black tracking-tighter"
				style="font-size: clamp(6rem, 20vw, 24rem); line-height: 1;"
			>
				LEXIGAP
			</span>
		</div>

		<div
			class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row lg:px-8"
		>
			<p class="text-xs font-medium tracking-wide text-muted-foreground">
				&copy; {new Date().getFullYear()} LEXIGAP. ALL RIGHTS RESERVED.
			</p>
			<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
				<span>BUILT WITH</span>
				<span class="rounded bg-accent px-1.5 py-0.5 text-foreground">SVELTEKIT</span>
				<span class="rounded bg-accent px-1.5 py-0.5 text-foreground">COMPROMISE</span>
			</div>
		</div>
	</div>
</footer>
