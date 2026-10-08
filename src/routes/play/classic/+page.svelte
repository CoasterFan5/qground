<script lang="ts">
	import type { GridItem } from '#lib/gridItems/types.js';
	import GateCanvas from './GateCanvas.svelte';
	import { type Placeable, placeableDetails, placeables } from './placeables';

	let placingKey = $state<Placeable | undefined>(undefined);

	type PlacingOverrideReturnFunction = (() => GridItem) | false;
	const placeOverride: () => PlacingOverrideReturnFunction = () => {
		if (placingKey) {
			return placeableDetails[placingKey].builder;
		}
		return false;
	};
</script>

<div class="wrap">
	<div class="topBar">
		<button
			onclick={() => {
				placingKey = undefined;
			}}
		>
			cancel
		</button>
		{#each placeables as p, i (i)}
			<button
				class="topBarItem"
				onclick={() => {
					placingKey = p;
				}}>{placeableDetails[p].displayName}</button
			>
		{/each}
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
