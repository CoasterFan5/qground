<script lang="ts">
	import { renderGrid } from './renderGrid';
	import { onMount } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { SvelteSet } from 'svelte/reactivity';

	const GRID_SIZE = 40;

	/**
	 *  This takes in a real position based on 0,0 being the top left of the canvas, and turns it into a grid tile, both rendered and real
	 */

	const canvasPosition: { x: number; y: number } = { x: 0, y: 0 };
	let mousePosition: { x: number; y: number } = { x: 0, y: 0 };

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
		const width = canvasElement.clientWidth;
		const height = canvasElement.clientHeight;
		if (canvasElement.width !== width || canvasElement.height !== height) {
			canvasElement.width = width;
			canvasElement.height = height;
		}
		ctx.clearRect(0, 0, width, height);
		renderGrid({
			ctx,
			canvasX: canvasPosition.x,
			canvasY: canvasPosition.y,
			width,
			height,
			gridSize: GRID_SIZE,
			cursorPosition: mousePosition
		});
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
		const boundingBox = canvasElement?.getBoundingClientRect();

		if (!boundingBox) {
			return;
		}

		mousePosition.x = e.clientX - boundingBox.x;
		mousePosition.y = e.clientY - boundingBox.y;
		if (isMouseDown) {
			const deltaX = e.clientX - downStartPos.x;
			const deltaY = e.clientY - downStartPos.y;
			canvasPosition.x -= deltaX;
			canvasPosition.y += deltaY;
			downStartPos.x = e.clientX;
			downStartPos.y = e.clientY;
		}
		doRender();
	};

	let keyMap: Set<string> = new SvelteSet();

	onMount(() => {
		const i = setInterval(() => {
			let moved = false;
			if (keyMap.has('w') || keyMap.has('arrowup')) {
				canvasPosition.y += 5;
				moved = true;
			}
			if (keyMap.has('s') || keyMap.has('arrowdown')) {
				canvasPosition.y -= 5;
				moved = true;
			}
			if (keyMap.has('d') || keyMap.has('arrowright')) {
				canvasPosition.x += 5;
				moved = true;
			}
			if (keyMap.has('a') || keyMap.has('arrowleft')) {
				canvasPosition.x -= 5;
				moved = true;
			}
			if (moved) {
				doRender();
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
</script>

<svelte:window
	onmouseup={windowMouseUpHandler}
	onmousemove={windowMouseMoveEvent}
	onkeydown={windowKeyDownHandler}
	onkeyup={windowKeyUpHandler}
	onresize={() => {
		doRender();
	}}
/>
<div class="wrap">
	<div class="centerMark"></div>
	<canvas bind:this={canvasElement} onmousedown={canvasMouseDownHandler}> </canvas>
</div>

<style>
	.wrap {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
	}

	.centerMark {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 2rem;
		width: 2rem;
		background: yellow;
		transform: translate(-50%, -50%);
	}
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
