import { createRoot } from 'react-dom/client';

import { App } from './components/App';
import './style.css';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');

  if (container != null) {
    const root = createRoot(container);
    root.render(<App />);
  } else {
    console.error('Failed to find container element for React root');
  }
});
