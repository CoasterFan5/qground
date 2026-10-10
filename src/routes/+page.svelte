<script>
	import { resolve } from '$app/paths';
</script>

<main class="landing">
	<div class="headerBanner">
		<h1>qGround</h1>
		<p>Play with bits and qubits!</p>
		<div class="buttons">
			<a class="button buttonPrimary" href={resolve('/play/classic', {})}>Classic</a>
			<a class="button buttonSecondary" href={resolve('/play/classic', {})}>Quantum</a>
		</div>
	</div>
</main>

<style>
	.landing {
		position: relative;
		isolation: isolate;
		display: grid;
		min-height: 100vh;
		min-height: 100svh;
		align-items: center;
		justify-items: center;
		overflow: hidden;
		padding: 2rem clamp(2rem, 10vw, 9rem) 12vh;
		background: var(--background);
	}

	.landing::before {
		position: absolute;
		z-index: -1;
		inset: 0;
		background-image:
			linear-gradient(to right, var(--border) 1px, transparent 1px),
			linear-gradient(to bottom, var(--border) 1px, transparent 1px);
		background-size: 48px 48px;
		content: '';
		mask-image: linear-gradient(135deg, #000 0%, transparent 82%);
		opacity: 0.55;
	}

	.headerBanner {
		width: min(100%, 760px);
		text-align: center;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 6vw, 4rem);
		font-weight: 600;
		letter-spacing: -0.09em;
		line-height: 0.95;
	}

	p {
		margin: 1.5rem 0 2.5rem;
		font-size: clamp(1rem, 2.5vw, 1.25rem);
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
	}

	.button {
		display: inline-flex;
		min-width: 9rem;
		min-height: 3.25rem;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.25rem;
		border: 1px solid var(--accent);
		border-radius: 4px;
		font-size: 0.95rem;
		text-decoration: none;
	}

	.buttonPrimary {
		background: var(--accent);
		color: var(--background);
	}

	.buttonSecondary {
		background: var(--background);
		color: inherit;
	}

	.button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}
</style>
