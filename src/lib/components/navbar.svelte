<script lang="ts">
	import { page } from '$app/state';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import RouteIcon from '@lucide/svelte/icons/route';
	import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
	import BrainCircuitIcon from '@lucide/svelte/icons/brain-circuit';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import LogInIcon from '@lucide/svelte/icons/log-in';
	import UserPlusIcon from '@lucide/svelte/icons/user-plus';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { setMode, resetMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';

	const appLinks = [
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
		{ href: '/assessment', label: 'Assessment', icon: BrainCircuitIcon },
		{ href: '/learning-path', label: 'Learning Path', icon: RouteIcon },
		{ href: '/lesson', label: 'Lessons', icon: GraduationCapIcon },
		{ href: '/settings', label: 'Settings', icon: SettingsIcon }
	];

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

	// Route detection
	const path = $derived(page.url.pathname);
	const isLanding = $derived(path === '/');
	const isAuthPage = $derived(path === '/login' || path === '/register');

	function handleScroll() {
		scrolled = window.scrollY > 20;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function isActive(href: string): boolean {
		if (href === '/dashboard') return path.startsWith('/dashboard');
		return path.startsWith(href);
	}

	function navigate(path: string) {
		mobileMenuOpen = false;
		window.location.href = path;
	}

	function navLinkClass(href: string, base: string) {
		const state = isActive(href)
			? 'bg-primary/10 text-primary'
			: 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground';
		return `${base} ${state}`;
	}

	const navClasses = $derived(
		isLanding
			? `sticky top-0 z-40 flex h-14 w-full items-center transition-all duration-200 ${
					scrolled
						? 'border-b border-border/50 bg-background/80 backdrop-blur-md'
						: 'border-b border-transparent bg-transparent'
				}`
			: 'sticky top-0 z-40 flex h-14 w-full items-center border-b border-border/50 bg-background/80 backdrop-blur-md'
	);
</script>

<nav class={navClasses}>
	<div class="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 lg:px-6">
		<!-- Left: Brand -->
		<a href="/" class="flex items-center gap-2 font-semibold text-foreground">
			<div
				class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
			>
				<BookOpenIcon class="size-3.5" />
			</div>
			LexiGap
		</a>

		<!-- Center/Left: App Nav Links (desktop) -->
		{#if !isLanding && !isAuthPage}
			<div class="hidden flex-1 items-center justify-center gap-1 md:flex">
				{#each appLinks as link (link.href)}
					<a
						href={link.href}
						class={navLinkClass(
							link.href,
							'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors'
						)}
					>
						<link.icon class="size-4" />
						{link.label}
					</a>
				{/each}
			</div>
		{:else}
			<div class="hidden flex-1 md:block"></div>
		{/if}

		<!-- Right: Actions -->
		<div class="flex items-center gap-2">
			<!-- Desktop: Landing Page Actions -->
			{#if isLanding}
				<div class="hidden items-center gap-2 md:flex">
					<a href="/login">
						<Button variant="ghost" size="sm">Log in</Button>
					</a>
					<a href="/register">
						<Button size="sm">Get Started</Button>
					</a>
				</div>
			{/if}

			<!-- Desktop: Theme Toggle -->
			<div class="hidden md:block">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class={buttonVariants({ variant: 'outline', size: 'icon' }) + ' relative'}
					>
						<SunIcon
							class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
						/>
						<MoonIcon
							class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
						/>
						<span class="sr-only">Toggle theme</span>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item onclick={() => setMode('light')}>Light</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => setMode('dark')}>Dark</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<!-- Mobile: Hamburger Menu -->
			<Sheet.Root bind:open={mobileMenuOpen}>
				<Sheet.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
					<MenuIcon class="size-4" />
					<span class="sr-only">Open menu</span>
				</Sheet.Trigger>
				<Sheet.Portal>
					<Sheet.Overlay />
					<Sheet.Content side="right" class="w-72">
						<Sheet.Header class="border-b border-border/50 pb-4">
							<div class="flex items-center gap-2 font-semibold">
								<div
									class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
								>
									<BookOpenIcon class="size-3.5" />
								</div>
								LexiGap
							</div>
						</Sheet.Header>

						<div class="flex flex-col gap-1 px-2 py-4">
							{#if isLanding}
								<!-- Landing page mobile nav -->
								<button
									onclick={() => navigate('/login')}
									class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground"
								>
									<LogInIcon class="size-4" />
									Log in
								</button>
								<button
									onclick={() => navigate('/register')}
									class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground"
								>
									<UserPlusIcon class="size-4" />
									Get Started
								</button>
							{:else}
								<!-- App pages mobile nav -->
								{#each appLinks as link (link.href)}
									<button
										onclick={() => navigate(link.href)}
										class={navLinkClass(
											link.href,
											'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors'
										)}
									>
										<link.icon class="size-4" />
										{link.label}
									</button>
								{/each}
							{/if}
						</div>

						<!-- Mobile Theme Section -->
						<div class="border-t border-border/50 px-4 py-4">
							<p class="mb-3 text-xs font-medium text-muted-foreground">Theme</p>
							<div class="flex gap-2">
								<button
									onclick={() => {
										setMode('light');
										mobileMenuOpen = false;
									}}
									class="flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50"
								>
									<SunIcon class="size-4" />
									Light
								</button>
								<button
									onclick={() => {
										setMode('dark');
										mobileMenuOpen = false;
									}}
									class="flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50"
								>
									<MoonIcon class="size-4" />
									Dark
								</button>
								<button
									onclick={() => {
										resetMode();
										mobileMenuOpen = false;
									}}
									class="flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50"
								>
									<span class="text-xs">Auto</span>
								</button>
							</div>
						</div>
					</Sheet.Content>
				</Sheet.Portal>
			</Sheet.Root>
		</div>
	</div>
</nav>
