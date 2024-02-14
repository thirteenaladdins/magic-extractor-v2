<script>
	import { createEventDispatcher } from 'svelte';

	export let message = '';
	// export let index;
	export let style = ''; // Add a prop for dynamic styling

	let isVisible = true;
	const dispatch = createEventDispatcher();

	function closeAlert() {
		dispatch('dismiss');
		isVisible = false;
	}

	// Set a timeout to hide the alert and dispatch 'dismiss' event
	setTimeout(() => {
		closeAlert();
	}, 5000); // Adjust the time as needed
</script>

{#if isVisible}
	<div class="error-alert" {style}>
		<span>{message}</span>
		<button class="close-button" on:click={closeAlert}>×</button>
	</div>
{/if}

<style>
	.error-alert {
		position: fixed;
		top: 20px;
		right: 20px;
		background-color: #f44336;
		color: white;
		padding: 12px 20px;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
		z-index: 1000;
		display: flex;
		align-items: center;
		gap: 10px;
		transition: opacity 0.3s ease, transform 0.3s ease;
		transform: translateX(0);
		opacity: 1;
	}

	.error-alert .close-button {
		background: none;
		border: none;
		color: white;
		font-size: 20px;
		cursor: pointer;
	}

	.error-alert.hidden {
		opacity: 0;
		transform: translateX(20px);
	}
</style>
