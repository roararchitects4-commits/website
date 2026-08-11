// Regenerates public/sitemap.xml from the live blog content + work categories,
// so it never has to be hand-updated when a new post or gallery category is added.
// Runs automatically before every `vite build` (see package.json).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const siteConfigSrc = readFileSync(path.join(root, 'src/lib/siteConfig.ts'), 'utf8');
const siteUrlMatch = siteConfigSrc.match(/SITE_URL\s*=\s*'([^']+)'/);
const SITE_URL = (siteUrlMatch ? siteUrlMatch[1] : 'https://www.example.com').replace(/\/$/, '');

const blogDir = path.join(root, 'src/content/blog');
const blogSlugs = readdirSync(blogDir)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const raw = readFileSync(path.join(blogDir, file), 'utf8');
    const match = raw.match(/^\*\*URL Slug:\*\*\s*(.+)$/m);
    return match ? match[1].trim().replace(/^\/?blog\//, '').replace(/\/$/, '') : null;
  })
  .filter(Boolean);

const workCategoriesSrc = readFileSync(path.join(root, 'src/data/workCategories.ts'), 'utf8');
const gallerySlugs = [...workCategoriesSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

const staticPaths = ['/', '/blog'];
const galleryPaths = gallerySlugs.map((slug) => `/gallery/${slug}`);
const blogPaths = blogSlugs.map((slug) => `/blog/${slug}`);

const allPaths = [...staticPaths, ...galleryPaths, ...blogPaths];

const urlEntries = allPaths
  .map((p) => `  <url>\n    <loc>${SITE_URL}${p}</loc>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml written with ${allPaths.length} URLs`);
