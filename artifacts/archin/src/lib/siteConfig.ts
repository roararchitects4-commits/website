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

/* The studio's WhatsApp/voice line, in the two shapes the site needs it: bare
   digits with the country code for wa.me and tel:, and a spaced form to print.
   Lived as a lone constant inside FloatingSocialIcons until the campaign
   landing page needed to call and message the same line — a phone number
   copied into a second file is one that eventually only gets changed in one. */
export const PHONE_E164 = '917659024247';
export const PHONE_DISPLAY = '+91 76590 24247';
export const WHATSAPP_URL = (message: string) =>
  `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(message)}`;
