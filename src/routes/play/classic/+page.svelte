<script lang="ts">
	import GateCanvas from './GateCanvas.svelte';
	import { type Placeable, placeableDetails, placeables } from './placeables';

	let placingKey = $state<Placeable | undefined>(undefined);

	const placeOverride = () => {
		if (placingKey) {
			return placeableDetails[placingKey].builder;
		}
		return;
	};
</script>

<div class="wrap">
	<div class="topBar">
		{#each placeables as p, i (i)}
			<button
				class="topBarItem"
				onclick={() => {
					placingKey = p;
				}}>{placeableDetails[p].displayName}</button
			>
		{/each}

		<button class="topBarItem">Item2</button>
	</div>
	<GateCanvas {placeOverride} />
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
