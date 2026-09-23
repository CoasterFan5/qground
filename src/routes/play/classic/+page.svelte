<script>
	import GateCanvas from './GateCanvas.svelte';
</script>

<div class="wrap">
	<div class="topBar">
		<div class="topBarItem">Item1</div>
		<div class="topBarItem">Item2</div>
	</div>
	<GateCanvas />
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.topBar {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		border-bottom: 1px solid var(--border);
		background: var(--secondary);
		padding: 0.25rem;
	}
</style>
