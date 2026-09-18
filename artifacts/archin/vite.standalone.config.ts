/* Build config for the shareable, single-file export of the interiors landing
 * page — a one-off `pnpm run build:standalone-landing`, not part of the
 * regular site build or deploy. It has to live apart from vite.config.ts
 * because it wants the opposite of everything that one is tuned for: one HTML
 * file with the JS, CSS and every image inlined as data URIs, rather than a
 * hashed multi-file bundle meant to sit behind a CDN. That trade only makes
 * sense for a file someone emails or drops in a chat and opens straight from
 * disk — the live campaign page keeps using the normal build, where those
 * chunks are exactly what you want.
 */
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, '..', '..', 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist-standalone'),
    emptyOutDir: true,
    /* Every image the page uses — the gallery, the logo, the WhatsApp mark —
       is inlined as a data URI rather than left as a separate file the single
       HTML would otherwise have to fetch relative to wherever it is opened
       from. 100MB is comfortably past this page's total image weight; the
       point is "everything", not a tuned threshold. */
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, 'standalone-landing.html'),
    },
  },
});
