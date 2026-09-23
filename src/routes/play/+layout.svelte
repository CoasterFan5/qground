<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

<div class="wrap">
	<div class="sidebar">sidebar</div>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: center;
		height: 100%;
	}

	.sidebar {
		height: 100%;
		max-width: 15rem;
		width: 100%;
		padding: 1rem;
		background: var(--secondary);
		border-right: 1px solid var(--border);
	}

	.content {
		width: 100%;
		height: 100%;
	}
</style>
