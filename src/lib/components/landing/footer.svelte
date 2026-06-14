<script lang="ts">
	import { BookOpen, Code, Mail } from '@lucide/svelte';

	const productLinks = [
		{ href: '/assessment', label: 'Assessment' },
		{ href: '/learning-path', label: 'Learning Path' },
		{ href: '/lesson', label: 'Lessons' },
		{ href: '/dashboard', label: 'Dashboard' }
	];

	const resourceLinks = [
		{ href: '#features', label: 'Features' },
		{ href: '#how-it-works', label: 'How it Works' },
		{ href: '#powered-by', label: 'Powered By' }
	];
</script>

<footer class="border-t border-border/50 bg-muted/20">
	<div class="mx-auto max-w-5xl px-6 py-16">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-12">
			<!-- Brand -->
			<div class="md:col-span-5">
				<a href="/" class="flex items-center gap-2 font-semibold text-foreground">
					<div
						class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
					>
						<BookOpen class="size-3.5" />
					</div>
					LexiGap
				</a>
				<p class="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
					Algorithmic grammar assessment that generates personalized learning paths. No signup
					required.
				</p>
				<div class="mt-6 flex items-center gap-3">
					<a
						href="https://github.com/Michael-Obele/lexigap"
						aria-label="GitHub"
						target="_blank"
						rel="noopener noreferrer"
						class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
					>
						<Code class="size-4" />
					</a>
					<a
						href="mailto:hello@lexigap.com"
						aria-label="Email"
						class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
					>
						<Mail class="size-4" />
					</a>
				</div>
			</div>

			<!-- Links -->
			<div class="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
				<div>
					<h4 class="mb-3 text-sm font-semibold text-foreground">Product</h4>
					<ul class="space-y-2">
						{#each productLinks as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<h4 class="mb-3 text-sm font-semibold text-foreground">Resources</h4>
					<ul class="space-y-2">
						{#each resourceLinks as link}
							<li>
								<a
									href={link.href}
									class="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<h4 class="mb-3 text-sm font-semibold text-foreground">Legal</h4>
					<ul class="space-y-2">
						<li>
							<a
								href="/privacy"
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>Privacy</a
							>
						</li>
						<li>
							<a
								href="/terms"
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>Terms</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Bottom -->
		<div
			class="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row"
		>
			<p class="text-sm text-muted-foreground">© 2026 LexiGap. All rights reserved.</p>
			<p class="text-sm text-muted-foreground">Built with SvelteKit, compromise, and Datamuse.</p>
		</div>
	</div>
</footer>
