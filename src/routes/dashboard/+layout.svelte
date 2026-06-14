<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { syncLocalData, getUnsyncedCount } from '$lib/services/sync';
	import AppSidebar from '$lib/components/app/layout/AppSidebar.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();

	// Auto-sync local data when user is logged in
	if (browser && page.data.user) {
		$effect(() => {
			getUnsyncedCount().then((count) => {
				if (count > 0) {
					toast.info(`Syncing ${count} offline result${count > 1 ? 's' : ''}...`, {
						duration: 3000
					});
					syncLocalData().then((result) => {
						if (result.success && result.syncedCount > 0) {
							toast.success(
								`Synced ${result.syncedCount} result${result.syncedCount > 1 ? 's' : ''}!`
							);
						} else if (!result.success) {
							toast.error(`Sync failed: ${result.error || 'Unknown error'}`);
						}
					});
				}
			});
		});
	}
</script>

<AppSidebar>
	{@render children()}
</AppSidebar>
