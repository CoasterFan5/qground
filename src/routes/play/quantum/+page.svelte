<script lang="ts">
	import { QuantumGridManager } from '#lib/quantum/qGridManager.js';
	import type { SimResult } from '#lib/quantum/types.js';
	import SimResultsDisplay from './SimResultsDisplay.svelte';

	const qGridManager = new QuantumGridManager(4, 4);
	let renderKey = $state(0);
	qGridManager.subscribeToChanges(() => {
		console.log('render key + 1');
		renderKey += 1;
	});
	qGridManager.setGate(1, 1, {
		gate: 'Hadamard'
	});
	qGridManager.setGate(1, 3, {
		gate: 'Measure'
	});

	let simResult: SimResult | undefined = $state(undefined);

	const runSimulation = (e: MouseEvent) => {
		simResult = qGridManager.runSimulation(100);
		e.stopPropagation();
	};
</script>

<div class="wrap">
	<SimResultsDisplay bind:simResult />
	<div class="gridContainer">
		{#key renderKey}
			<div class="qGrid">
				{#each qGridManager.getRows() as r, i (i)}
					<div class="qubitRow">
						<div class="bitLabel">
							qubit {i}
						</div>
						<div class="cells">
							{#each Array(qGridManager.columns) as _, j (j)}
								<div class="cell" class:filled={r[j] !== undefined}></div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/key}
	</div>
	<div class="tools">
		<button
			onclick={() => {
				qGridManager.addQubit();
			}}>Add qubit</button
		>
		<button
			onclick={() => {
				qGridManager.addColumn();
			}}
		>
			Add column</button
		>
		<button onclick={runSimulation}> Run Simulation</button>
	</div>
</div>

<style>
	.wrap {
		position: relative;
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		width: 100%;
		height: 100%;
		min-height: 0;
		min-width: 0;
		overflow: hidden;
	}
	.gridContainer {
		min-height: 0;
		min-width: 0;
		overflow: hidden;
	}
	.qGrid {
		width: 100%;
		height: 100%;
		min-height: 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		overflow: auto;
	}
	.qubitRow {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		width: max-content;
		min-width: 100%;
	}

	.bitLabel {
		box-sizing: border-box;
		flex: 0 0 100px;
		border: 1px solid var(--border);
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: left;
	}

	.cells {
		display: flex;
		flex: 0 0 auto;
	}

	.cell {
		box-sizing: border-box;
		flex: 0 0 40px;
		height: 40px;
		border: 1px solid var(--border);

		&.filled {
			background: green !important;
		}
	}

	.tools {
		box-sizing: border-box;
		flex: 0 0 auto;
		border-top: 1px solid var(--border);
		background: var(--secondary);
		width: 100%;
		padding: 0.25rem;

		button {
			background: unset;
			border: 1px solid var(--border);
			background: var(--background);
			padding: 0.5rem;
			border-radius: 0.25rem;
			cursor: pointer;

			&:hover {
				border: 1px solid var(--accent);
			}
		}
	}
</style>
