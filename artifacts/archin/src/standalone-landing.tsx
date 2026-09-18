/* Entry point for the standalone, single-file export of the interiors
 * landing page — see scripts/build-standalone-landing.mjs for the build that
 * uses it. It exists so that export can mount InteriorsLandingPage directly,
 * without going through App's <Switch> route matching, which depends on
 * window.location and would otherwise need a server to answer to the right
 * path. A plain wouter Router is still wrapped around it because the page's
 * "See all projects" link is a wouter <Link>; nothing here ever navigates it
 * away from this single page.
 */
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Router as WouterRouter } from 'wouter';

import InteriorsLandingPage from './pages/InteriorsLandingPage';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <WouterRouter>
      <InteriorsLandingPage />
    </WouterRouter>
  </HelmetProvider>,
);
