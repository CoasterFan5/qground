<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

<div class="wrap">
	<div class="sidebar">
		<div class="header">qGround</div>
		<div class="sidebarButtons">
			<a class="sidebarButton" href={resolve('/play/classic', {})}>Classic</a>
		</div>
	</div>
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
		background: var(--secondary);
		border-right: 1px solid var(--border);

		.header {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.2rem;
			width: 100%;
			margin-top: 1rem;
		}
	}

	.sidebarButtons {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
	}

	.sidebarButton {
		display: flex;
		padding: 0.25rem;
		width: 100%;
		border-radius: 0.25rem;
		color: var(--color);
		text-decoration: none;
		&:hover {
			background: var(--background);
			color: var(--accent);
		}
	}

	.content {
		width: 100%;
		height: 100%;
	}
</style>
