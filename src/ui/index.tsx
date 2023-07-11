import { createRoot } from 'react-dom/client';

import { notEmpty } from '../utils/not-empty.ts';
import { App } from './components/App';
import './style.css';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('root');

  if (notEmpty(container)) {
    const root = createRoot(container);
    root.render(<App />);
  } else {
    console.error('Failed to find container element for React root');
  }
});
