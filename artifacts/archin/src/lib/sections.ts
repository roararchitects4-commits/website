/* The home page is one long scroll, but its parts answer to real paths rather
   than #fragments: /work is what a visitor expects to be able to copy, send or
   bookmark, and unlike a fragment it survives being pasted somewhere that
   trims the URL. Each path here renders Home and lands on the section it
   names — the values are the ids those sections carry in the markup. */
/** The enquiry page, and the page a completed enquiry lands on. Pages of
 *  their own rather than sections of the home page, so they are not in the
 *  table below — but they live here all the same, because the header and the
 *  footer link to the first and the page itself renders that header and
 *  footer. Held by the page, this would be a cycle: the nav arrays are built
 *  at module scope and would read it as undefined part-way through, which
 *  blanks the site. This module imports nothing, so it cannot be caught in
 *  one.
 *
 *  The capital C is deliberate — it is the address that was asked for. Wouter
 *  matches case-sensitively, so App also answers to the all-lowercase spelling
 *  and sends it here, since that is what anyone typing the address by hand
 *  will reach for. */
export const CONTACT_PATH = '/Contactus';

/** Where the form goes once it has been sent. A real page with its own URL
 *  rather than a panel swapped in place, so the submission is something an
 *  analytics or ads conversion can be triggered on. */
export const THANK_YOU_PATH = '/thankyou';

export const SECTION_PATHS = {
  '/': 'top',
  '/work': 'work',
  '/about': 'studio',
} as const;

export type SectionPath = keyof typeof SECTION_PATHS;

/* The path arrives as it was typed, so a stray trailing slash would otherwise
   miss the table and fall through to the 404. */
const normalise = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path) || '/';

/* Undefined for anything that isn't one of the home page's sections — which is
   also how the router tells a section path from a 404. */
export function sectionIdFor(path: string): string | undefined {
  return SECTION_PATHS[normalise(path) as SectionPath];
}

export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  /* The hero carries id="top", but scrolling to it would stop at its
     scroll-margin rather than the true top of the document. */
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior });
}
