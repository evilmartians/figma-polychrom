import { mount } from 'svelte';

import { notEmpty } from '../utils/not-empty.ts';
import App from './components/App.svelte';
import './style.css';

const container = document.getElementById('root');

if (!notEmpty(container)) {
	console.error('Failed to find container element for Svelte root');
}

const app = mount(App, {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	target: container!
});

// eslint-disable-next-line import/no-default-export
export default app;
