import { render } from 'preact';

import { notEmpty } from '../utils/not-empty.ts';
import { App } from './components/App';
import './style.css';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('root');

  if (notEmpty(container)) {
    render(<App />, container);
  } else {
    console.error('Failed to find container element for root');
  }
});
