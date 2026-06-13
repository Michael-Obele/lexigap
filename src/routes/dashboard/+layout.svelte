<script lang="ts">
	import AppSidebar from '$lib/components/app/layout/AppSidebar.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<AppSidebar>
	{@render children()}
</AppSidebar>
