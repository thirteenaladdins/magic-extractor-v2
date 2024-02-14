<!-- <script context="module">
	
</script> -->

<script>
	import { getBaseUrl } from '../utils/config.js';

	const baseUrl = getBaseUrl();

	export async function load({ fetch }) {
		// Place server-side logic here, such as data fetching
		const baseUrl = getBaseUrl();
		let serverAwake = false;
		let showSuccessMessage = false;

		try {
			const response = await fetch(`${baseUrl}/ping`);
			const data = await response.json();
			if (data.message === 'pong') {
				serverAwake = true;
				showSuccessMessage = true;
			}
		} catch (error) {
			console.error('Error pinging server:', error);
		}
		return {
			props: { serverAwake, showSuccessMessage }
		};
	}

	import { goto } from '$app/navigation';
	import { sessionData } from '../store/sessionStore.js';
	// import { version } from '../utils/version.js';
	import { onMount, onDestroy } from 'svelte';
	import { loading } from '../store/loadingStore.js';
	import { duplicateError } from '../store/duplicateErrorStore.js';

	// this is used for duplicates at the moment should I change this?
	import { errorMessage } from '../store/errorMessageStore.js';

	import SideNav from '../components/SideNav.svelte';
	import DropAreaFileUpload from '../components/DropAreaFileUpload.svelte';
	import ErrorAlert from '../components/ErrorAlert.svelte';
	import { selectedItem } from '../store/selectedItemStore.js';
	// import Footer from "../components/Footer.svelte";

	import { fileCount } from '../store/fileCountStore.js';
	// import { writable } from 'svelte/store';
	import Loading from '../components/Loading.svelte';

	// HANDLE DRAG AND DROP
	import {
		handleDragEnter,
		handleDragLeave,
		handleDragEnd,
		handleDrop
	} from '../utils/dragAndDrop';

	import {
		setHighlight,
		increaseCounter,
		decreaseCounter,
		resetCounter
	} from '../utils/dragState.js';

	import { isHighlighted } from '../utils/dragState.js';
	import ErrorComponent from '../components/ErrorAlert.svelte';

	let highlighted;

	isHighlighted.subscribe((value) => {
		highlighted = value;
	});

	console.log(import.meta.env);
	console.log('Base URL:', baseUrl);

	let uploadSuccessful = false;
	let responseData = null;
	export let serverAwake;
	export let showSuccessMessage;

	let showError;
	let dropArea;

	let isDuplicate;

	// errorMessage.subscribe((value) => {
	// 	showError = !!value; // Update showError based on the error message
	// 	if (showError) {
	// 		loading.set(false); // Stop loading when there's an error
	// 	}
	// });

	// Subscription to errorMessage store
	errorMessage.subscribe((value) => {
		if (value) {
			const newMessage = {
				id: `msg-${messageIdCounter++}`,
				text: value
			};
			messages = [...messages, newMessage];
			errorMessage.set(''); // Reset the store
		}
	});

	let dots = 3;
	let interval;

	if (typeof window !== undefined) {
		onMount(() => {
			interval = setInterval(() => {
				if (dots < 3) {
					dots += 1;
				} else {
					dots = 1;
				}
			}, 500); // Change the interval as per your requirement
		});
	}

	onDestroy(() => {
		clearInterval(interval); // Cleanup to avoid memory leaks
	});

	// add this to a separate file or remove it altogether
	if (typeof window != undefined) {
		onMount(async () => {
			try {
				// loading.set(false); // Set loading true only if there is no current error
				// if (showError) return;

				const response = await fetch(`${baseUrl}/ping`);
				const data = await response.json();

				if (data.message === 'pong') {
					console.log(data);
					serverAwake = true;
					showSuccessMessage = true;

					setTimeout(() => {
						showSuccessMessage = false;
					}, 2000); // Message will disappear after 2 seconds
				} else {
					console.error('Ping failed!');
				}
			} catch (error) {
				console.error('Error pinging server:', error);
				// handleError(
				// 	'Failed to connect to the server. Please check your internet connection and try again.'
				// );
			}
		});
	}

	let showLoading = false;
	let startTime;

	$: if ($loading && !showLoading && !showError) {
		console.log(showError);
		// Only show loading if loading is true, not already showing, and no error
		console.log('loading, not show loading and not show error');
		showLoading = true;
		startTime = Date.now();
	}

	function handleSuccess(event) {
		uploadSuccessful = true;
		responseData = event.detail;
		sessionData.set(responseData);

		const elapsedTime = Date.now() - startTime;
		const delay = Math.max(0, 1500 - elapsedTime);
		if ($selectedItem === 'Annotate') {
			setTimeout(() => {
				goto('/pdf').then(() => {
					loading.set(false);
					showLoading = false;
				});
			}, delay);
		} else {
			setTimeout(() => {
				goto('/results').then(() => {
					loading.set(false);
					showLoading = false;
				});
			}, delay);
		}
	}

	function handleError(event) {
		let error = event.detail.message || 'An error occurred.';
		loading.set(false);
		console.log('handle error', error);
		errorMessage.set('');
		errorMessage.set(error); // This sets the error in the store
		// showLoading = false;
		showError = true; // Ensure this is set to true to display the error
	}

	// function handleError(error) {
	// 	let error = error.detail.message || 'An error occurred.';
	// 	errorMessage.set(''); // Reset before setting new message
	// 	errorMessage.set(error);
	// }

	function highlight(event) {
		event.preventDefault();
		setHighlight(true);
	}

	// let messages = ['Error Message 1', 'Error Message 2', 'Error Message 3'];
	let messages = [];
	let messageIdCounter = 0;
	// init array
	// each time errorMessage store is updated - add to the array
	//

	// Reactive statement
	// $: if ($errorMessage) {
	// 	messages.push($errorMessage);
	// 	console.log(messages);
	// 	errorMessage.set(''); // Reset the store if needed
	// }

	$: if ($errorMessage) {
		console.log('Before updating messages:', messages);
		messages = [...messages, $errorMessage];
		console.log('After updating messages:', messages);
		errorMessage.set(''); // Reset the store if needed
	}

	// Function to remove a message
	function removeMessage(messageId) {
		messages = messages.filter((msg) => msg.id !== messageId);
	}

	// Reactive statement to update positions
	$: positions = messages.map((_, index) => {
		const top = 20 + index * 50;
		console.log(`Message ${index} position: ${top}px`);
		return { top };
	});
	// style={`top: ${20 + index * 50}px;`}
</script>

<!-- TODO: fix this so the error messages don't overlap
and they are dismissed in order -->

{#each messages as message, index}
	<!-- {console.log(message)} -->
	<ErrorAlert message={message.text} on:dismiss={() => removeMessage(message.id)} />
{/each}

<!-- {#each messages as message, index (index)}
	<ErrorAlert {message} style="top: {20 + index * 50}px" on:dismiss={() => removeMessage(index)} />
{/each} -->

<div
	class="outerContainer {highlighted ? 'highlighted' : ''}"
	role="button"
	bind:this={dropArea}
	on:dragenter={() => handleDragEnter(event, increaseCounter, setHighlight)}
	on:dragover={highlight}
	on:dragleave={() => handleDragLeave(event, decreaseCounter, setHighlight)}
	on:dragend={() => handleDragEnd(event, resetCounter, setHighlight)}
	on:drop={() => handleDrop(event, resetCounter, setHighlight)}
	tabindex="0"
>
	<!-- Left column -->
	<div class="left-column">
		<SideNav />
	</div>

	<!-- <div class="dropContainer" /> -->
	<!-- Middle column -->
	<div class="middleColumn">
		<!-- Top part of the middle column -->
		<div class="middleTop server-message-wrapper">
			{#if !serverAwake}
				<p>Waking up server, please wait{'.'.repeat(dots)}</p>
			{/if}

			{#if showSuccessMessage}
				<p>Server connection established.</p>
			{/if}

			{#if $duplicateError}
				<p class="duplicate-error">{$duplicateError}</p>
			{/if}

			{#if $fileCount}
				<p>You have selected {$fileCount} file{$fileCount === 1 ? '' : 's'}</p>
			{/if}
		</div>

		<div class="middle">
			<div class="dropArea uniformWidth">
				<DropAreaFileUpload on:uploadSuccess={handleSuccess} on:uploadFailed={handleError} />
			</div>
		</div>

		<!-- Bottom part of the middle column -->
		<div class="middleBottom" />
	</div>

	<!-- Right column -->
	<div class="right-column" />
</div>

<style>
	/* * {
		margin: 0;
		padding: 0;
	} */

	.outerContainer {
		display: flex;
		height: 90vh;
	}

	.left-column {
		flex: 1; /* This ensures each column takes equal width */
		/* padding: 1rem; */
	}

	.middleColumn {
		display: flex;
		flex-direction: column; /* Divides the middle column horizontally */
	}

	.right-column {
		flex: 1; /* This ensures each column takes equal width */
		/* padding: 1rem; */
	}

	.middleTop {
		flex: 1; /* Each part of the middle column takes equal height */
		padding: 1rem;
	}

	.middle {
		flex: 4; /* Each part of the middle column takes equal height */
		padding: 1rem;
	}
	.middleBottom {
		flex: 1; /* Each part of the middle column takes equal height */
		padding: rem;
	}

	.duplicate-error {
		color: red;
	}

	.server-message-wrapper {
		font-family: Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
			Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
		font-size: 14px;
	}

	/* set this to the selection  */
	.outerContainer.highlighted {
		opacity: 0.25;
		/* opacity: inherit; */
		/* Additional styles to indicate highlighting */
	}
</style>
