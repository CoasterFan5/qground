<script lang="ts">
	import { onMount } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { SvelteSet } from 'svelte/reactivity';
	import { GridManager } from './gridManager';
	import { GridItem, type Placeable } from '#lib/gridItems/types.js';
	import { saveProject } from './save.remote';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import PlayIcon from '~icons/ph/play';
	import SaveIcon from '~icons/ph/floppy-disk';

	type GridItemInit = () => GridItem | undefined;

	const {
		placeOverride,
		project,
		isPlacing
	}: {
		placeOverride: () => GridItemInit | false;
		project: { type: Placeable; x: number; y: number }[];
		isPlacing: boolean;
	} = $props();

	const GRID_SIZE = 40;
	const gridManager = new GridManager(GRID_SIZE);

	/**
	 *  This takes in a real position based on 0,0 being the top left of the canvas, and turns it into a grid tile, both rendered and real
	 */

	const canvasPosition: { x: number; y: number } = { x: 0, y: 0 };

	let canvasElement = $state<HTMLCanvasElement | undefined>();
	$effect(() => {
		if (canvasElement) {
			gridManager.setCanvas(canvasElement);
			gridManager.resizeCanvas();
		}
	});

	onMount(() => {
		gridManager.loadProject(project);
	});

	let downStartPos: { x: number; y: number } = { x: 0, y: 0 };
	let isMouseDown = false;
	const canvasMouseDownHandler: MouseEventHandler<HTMLCanvasElement> = (e) => {
		downStartPos.x = e.clientX;
		downStartPos.y = e.clientY;
		isMouseDown = true;
	};
	const windowMouseMoveEvent: MouseEventHandler<Window> = (e) => {
		const boundingBox = canvasElement?.getBoundingClientRect();

		if (!boundingBox) {
			return;
		}

		gridManager.updateCusorPosition(() => {
			return {
				x: e.clientX - boundingBox.x,
				y: e.clientY - boundingBox.y
			};
		});
		if (isMouseDown) {
			const deltaX = e.clientX - downStartPos.x;
			const deltaY = e.clientY - downStartPos.y;
			canvasPosition.x -= deltaX;
			canvasPosition.y += deltaY;
			downStartPos.x = e.clientX;
			downStartPos.y = e.clientY;
		}
	};

	let keyMap: Set<string> = new SvelteSet();

	onMount(() => {
		const i = setInterval(() => {
			let xUpdate = 0;
			let yUpdate = 0;
			if (keyMap.has('w') || keyMap.has('arrowup')) {
				yUpdate += 5;
			}
			if (keyMap.has('s') || keyMap.has('arrowdown')) {
				yUpdate += -5;
			}
			if (keyMap.has('d') || keyMap.has('arrowright')) {
				xUpdate += 5;
			}
			if (keyMap.has('a') || keyMap.has('arrowleft')) {
				xUpdate += -5;
			}
			if (xUpdate != 0 || yUpdate != 0) {
				gridManager.updateCanvasPosition(({ x, y }) => {
					return {
						x: x + xUpdate,
						y: y + yUpdate
					};
				});
			}
		}, 1000 / 30);
		return () => {
			clearInterval(i);
		};
	});

	const windowKeyDownHandler = (e: KeyboardEvent) => {
		keyMap = keyMap.add(e.key.toLowerCase());
	};
	const windowKeyUpHandler = (e: KeyboardEvent) => {
		keyMap.delete(e.key.toLowerCase());
	};

	const windowMouseUpHandler: MouseEventHandler<Window> = () => {
		isMouseDown = false;
	};

	const gridClickHandler: MouseEventHandler<HTMLCanvasElement> = (e) => {
		const placing = placeOverride();
		if (placing) {
			const gridPos = gridManager.getCusorGridPosition();
			gridManager.setItemAtPosition(gridPos.x, gridPos.y, placing());
			return;
		}
		gridManager.onClick(e);
	};
</script>

<svelte:window
	onmouseup={windowMouseUpHandler}
	onmousemove={windowMouseMoveEvent}
	onkeydown={windowKeyDownHandler}
	onkeyup={windowKeyUpHandler}
	onresize={() => {
		gridManager.resizeCanvas();
	}}
/>
<div class="wrap">
	{#if isPlacing}
		<div class="placing">Placing item, click any grid tile!</div>
	{/if}
	<canvas onclick={gridClickHandler} bind:this={canvasElement} onmousedown={canvasMouseDownHandler}>
	</canvas>
	<div class="tools">
		<button onclick={() => gridManager.runSimulation()}><PlayIcon /></button>
		<button
			onclick={() => {
				// im inlining this cause I can
				saveProject(gridManager.toJson())
					.then((a) => {
						toast.success('Saved; Copy url to share!');
						goto(`/play/classic?project=${a.message}`, {
							invalidateAll: true
						});
					})
					.catch((e) => {
						console.error(e);
						toast.error('Save Failed');
					});
			}}><SaveIcon /></button
		>
	</div>
</div>

<style>
	.wrap {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
	}

	canvas {
		width: 100%;
		height: 100%;
	}

	.tools {
		position: absolute;
		right: 0.5rem;
		top: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid var(--border);
		background: var(--background);
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.05);
		display: flex;
		flex-direction: column;
		overflow: hidden;

		button {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0.3rem;
			outline: 0px;
			border: 0px;
			font-size: 1rem;
			cursor: pointer;
			&:hover {
				color: var(--accent);
			}
		}
	}

	.placing {
		position: absolute;
		left: 50%;
		top: 1rem;
		font-size: 1rem;
		font-weight: 700;
		transform: translateX(-50%);
		color: var(--accent);
	}
</style>
