<script lang="ts">
	import type { SimResult } from '#lib/quantum/types.js';
	import { fly } from 'svelte/transition';

	let {
		simResult = $bindable(undefined)
	}: {
		simResult: SimResult | undefined;
	} = $props();

	let simResultWrap = $state<HTMLDivElement | undefined>(undefined);

	const windowClickHandler = (e: MouseEvent) => {
		if (simResult) {
			if (simResultWrap && !e.composedPath().includes(simResultWrap)) {
				e.preventDefault();
			}
			simResult = undefined;
		}
	};
</script>

{#snippet measurementGraph(measurementData: { 1: number; 0: number })}
	<div class="labelWrap">
		<span class="label">0: {measurementData[0]}</span>
		<span class="label">1: {measurementData[1]}</span>
	</div>
	<div class="measurementWrap">
		<div
			class="graph"
			style="--l: {measurementData[0] / (measurementData[0] + measurementData[1])}"
		></div>
	</div>
{/snippet}

<svelte:window onclick={windowClickHandler} />
{#if simResult}
	<div
		class="wrap"
		bind:this={simResultWrap}
		transition:fly={{
			x: 250,
			y: 0,
			duration: 100
		}}
	>
		{#each Object.entries(simResult) as a, i (i)}
			Qubit {a[0]}
			{@render measurementGraph(a[1])}
		{/each}
	</div>
{/if}

<style>
	.wrap {
		position: absolute;
		right: 0px;
		top: 5%;
		height: 90%;
		border-color: var(--border);
		background: var(--secondary);
		border-style: solid;
		border-width: 1px 0px 1px 1px;
		box-shadow: 1px 1px 3px 3px var(--shadow);
		border-radius: 0.25rem 0 0 0.25rem;
		width: 20rem;
		padding: 0.5rem;
	}

	.measurementWrap {
		width: 100%;
		height: 2rem;
		border: 1px solid var(--border);
		background: var(--accent);
		border-radius: 0.25rem;
		overflow: hidden;
	}

	.graph {
		width: calc(100% * var(--l));
		height: 2rem;
		background: var(--secondary);
	}

	.labelWrap {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
