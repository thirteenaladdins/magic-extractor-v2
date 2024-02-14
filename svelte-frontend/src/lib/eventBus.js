// eventBus.js
import { writable } from 'svelte/store';

export const eventBus = writable({});

export function emitEvent(eventType, payload) {
	eventBus.set({ eventType, payload });
}
