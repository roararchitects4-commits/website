import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App';
import { captureAttribution } from './lib/attribution';

import './index.css';

/* Before the first render, and outside React: this has to read the URL the
   visitor actually arrived on, and the router rewrites it. Run from an effect
   inside a component it would be a race against that rewrite — and against
   StrictMode calling it twice. */
captureAttribution();

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
