/* Used to build canonical URLs, Open Graph tags, and sitemap.xml entries.
   Must be the host that actually serves a 200, or the canonical points Google
   somewhere it cannot follow and the page goes unindexed — which is exactly
   what the previous value did: roarchitects.co does not resolve at all.

   www, not the bare domain: Vercel serves this site with www as the primary
   domain and 308s roararchitects.com to it, so the bare host is the redirect
   and www is the destination. No trailing slash — every consumer appends its
   own path. */
export const SITE_URL = 'https://www.roararchitects.com';
export const SITE_NAME = 'ROAR Architects';
