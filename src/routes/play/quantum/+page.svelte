<script lang="ts">
	let qubits = $state(30);
	let gateColumns = $state(40);
	const addQubit = () => {
		qubits += 1;
	};

	const addColumn = () => {
		gateColumns += 1;
	};
</script>

<div class="wrap">
	<div class="gridContainer">
		<div class="qGrid">
			{#each Array(qubits) as _, i (i)}
				<div class="qubitRow">
					<div class="bitLabel">
						qubit {i}
					</div>
					<div class="cells">
						{#each Array(gateColumns) as _, j (j)}
							<div class="cell"></div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="tools">
		<button onclick={addQubit}>Add qubit</button>
		<button onclick={addColumn}>Add column</button>
	</div>
</div>

<style>
	.wrap {
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
