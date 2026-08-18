/* The home page is one long scroll, but its parts answer to real paths rather
   than #fragments: /work is what a visitor expects to be able to copy, send or
   bookmark, and unlike a fragment it survives being pasted somewhere that
   trims the URL. Each path here renders Home and lands on the section it
   names — the values are the ids those sections carry in the markup. */
export const SECTION_PATHS = {
  '/': 'top',
  '/work': 'work',
  '/about': 'studio',
  '/contact': 'contact',
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
