<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import '@fontsource/ibm-plex-mono';
	import { Toaster } from 'svelte-french-toast';

	let { children } = $props();
</script>

<svelte:head>
	<title>qGround</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
{@render children()}

<style>
	:global(body) {
		margin: 0px;
		padding: 0px;
		height: 100vh;
		width: 100%;
		display: flex;

		font-weight: 400;
		font-style: normal;
		--background: #fafafa;
		--shadow: rgba(0, 0, 0, 0.05);
		--border: #c9c9ca;
		--secondary: #ebebec;
		--accent: #ff7518;
	}

	:global(*) {
		font-family: 'IBM Plex Mono', monospace;
		box-sizing: border-box;
	}
</style>
