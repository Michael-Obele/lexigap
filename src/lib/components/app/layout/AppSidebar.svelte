<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import {
		BookOpen,
		LayoutDashboard,
		BrainCircuit,
		Route,
		GraduationCap,
		Settings,
		Flame
	} from '@lucide/svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	function navigate(path: string) {
		window.location.href = path;
	}
</script>

<Sidebar.Provider>
	<div class="flex min-h-screen w-full">
		<Sidebar.Root class="border-r border-border/50">
			<Sidebar.Header class="flex h-14 items-center border-b border-border/50 px-4">
				<div class="flex items-center gap-2">
					<div
						class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
					>
						<BookOpen class="size-3.5" />
					</div>
					<span class="font-semibold text-foreground">LexiGap</span>
				</div>
				<Sidebar.Trigger class="-ms-1" />
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton onclick={() => navigate('/dashboard')} isActive>
								<LayoutDashboard class="size-4" />
								Dashboard
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton onclick={() => navigate('/assessment')}>
								<BrainCircuit class="size-4" />
								Assessment
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton onclick={() => navigate('/learning-path')}>
								<Route class="size-4" />
								Learning Path
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton onclick={() => navigate('/lesson')}>
								<GraduationCap class="size-4" />
								Lessons
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Group>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Account</Sidebar.GroupLabel>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton onclick={() => navigate('/settings')}>
								<Settings class="size-4" />
								Settings
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Group>
				<Sidebar.Footer>
					<div class="flex items-center gap-2 px-2 py-2">
						<div class="flex size-8 items-center justify-center rounded-full bg-warning/10">
							<Flame class="size-4 text-warning" />
						</div>
						<div class="flex flex-col">
							<span class="text-sm font-medium">5 Day Streak</span>
							<span class="text-xs text-muted-foreground">Keep it up!</span>
						</div>
					</div>
				</Sidebar.Footer>
			</Sidebar.Content>
		</Sidebar.Root>
		<Sidebar.Inset>
			{@render children()}
		</Sidebar.Inset>
	</div>
</Sidebar.Provider>
