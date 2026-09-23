<script lang="ts">
	import { renderFunctionMap, type Renderer } from '#lib/renderers/renderers.js';
	import { onMount } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { renderGrid } from './renderGrid';
	import { gridItemHandlers } from '#lib/gridItems/gridItems.ts';
	import type { GridItem } from '#lib/gridItems/types.ts';

	const GRID_SIZE = 40;

	const items: GridItem[] = [];

	const canvasPosition: { x: number; y: number } = { x: 0, y: 0 };

	let canvasElement = $state<HTMLCanvasElement | undefined>();

	const doRender = () => {
		if (!canvasElement) {
			console.log('no canvas');
			return;
		}

		const ctx = canvasElement.getContext('2d');

		if (!ctx) {
			console.log('no cyx');
			return;
		}
		console.log('doing render');
		ctx.clearRect(0, 0, canvasElement.clientWidth, canvasElement.clientHeight);
		canvasElement.width = canvasElement.clientWidth;
		canvasElement.height = canvasElement.clientHeight;
		// ok so to get the true x we need to get a new offset
		// Basically, 0,0 needs to be the center of the canvas when we are at 0, 0
		const offsetX = canvasElement.width / 2 - canvasPosition.x;
		const offsetY = canvasElement.height / 2 + canvasPosition.y;
		ctx.beginPath();
		renderGrid({
			ctx,
			offsetX,
			offsetY,
			width: canvasElement.width,
			height: canvasElement.height,
			gridSize: GRID_SIZE
		});
		for (const item of items) {
			ctx.beginPath();

			gridItemHandlers[item.type].renderer(item, {
				ctx,
				width: canvasElement.width,
				height: canvasElement.height
			});
		}
	};

	onMount(() => {
		doRender();
	});

	let downStartPos: { x: number; y: number } = { x: 0, y: 0 };
	let isMouseDown = false;
	const canvasMouseDownHandler: MouseEventHandler<HTMLCanvasElement> = (e) => {
		downStartPos.x = e.clientX;
		downStartPos.y = e.clientY;
		isMouseDown = true;
	};
	const windowMouseMoveEvent: MouseEventHandler<Window> = (e) => {
		if (!isMouseDown) {
			return;
		}
		const deltaX = e.clientX - downStartPos.x;
		const deltaY = e.clientY - downStartPos.y;
		canvasPosition.x -= deltaX;
		canvasPosition.y += deltaY;
		downStartPos.x = e.clientX;
		downStartPos.y = e.clientY;
		doRender();
	};

	const windowMouseUpHandler: MouseEventHandler<Window> = () => {
		isMouseDown = false;
	};
</script>

<svelte:window onmouseup={windowMouseUpHandler} onmousemove={windowMouseMoveEvent} />
<canvas bind:this={canvasElement} onmousedown={canvasMouseDownHandler}> </canvas>

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
