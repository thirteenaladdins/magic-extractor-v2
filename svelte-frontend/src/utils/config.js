// src/utils/config.js

let cachedBaseUrl = null;

export function getBaseUrl() {
	if (cachedBaseUrl !== null) {
		return cachedBaseUrl;
	}

	switch (import.meta.env.VITE_ENV) {
		case 'development':
			cachedBaseUrl = import.meta.env.VITE_BASE_URL_DEVELOPMENT;
			break;
		case 'test':
			cachedBaseUrl = import.meta.env.VITE_BASE_URL_TEST;
			break;
		case 'production':
			cachedBaseUrl = import.meta.env.VITE_BASE_URL_PRODUCTION;
			break;
		default:
			cachedBaseUrl = 'https://als-toolkit-test-199b8323b120.herokuapp.com/';
	}

	return cachedBaseUrl;
}
