<script lang="ts">
	import { placeables, type GridItem, type Placeable } from '#lib/gridItems/types.js';
	import GateCanvas from './GateCanvas.svelte';
	import { placeableDetails } from './placeables';

	const { data } = $props();

	let placingKey = $state<Placeable | undefined>(undefined);

	type PlacingOverrideReturnFunction = (() => GridItem | undefined) | false;
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
				class:active={placingKey == p}
				onclick={() => {
					placingKey = p;
				}}>{placeableDetails[p].displayName}</button
			>
		{/each}
	</div>
	<GateCanvas {placeOverride} project={data.project} isPlacing={placingKey !== undefined} />
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

	.topBarItem {
		border: 1px solid var(--border);
		padding: 0.5rem;
		border-radius: 0.25rem;
		background: var(--background);
		outline: 0px;

		&.active {
			border: 1px solid var(--accent);
		}

		&:hover {
			background: var(--secondary);
		}
	}
</style>
