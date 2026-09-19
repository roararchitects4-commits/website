/* The thin layer between the site and the GTM container loaded in index.html.
 *
 * Everything goes through `pushEvent` rather than touching `window.dataLayer`
 * at the call site, for two reasons: the array has to be created if GTM has not
 * finished loading (it is a plain array until the container replaces it, and a
 * push onto a missing one throws), and an event pushed from a component that
 * also runs during a build would otherwise have to guard for `window` itself.
 *
 * Event names are the ones GA4 already understands — `generate_lead` is a
 * recommended event, so it reports without a custom definition, and `form_start`
 * matches the name GA4's own enhanced measurement uses. The pair is what makes
 * the funnel legible: `form_start` without `generate_lead` is an abandoned form,
 * and the ratio says whether a disappointing week was the traffic or the page.
 */

type DataLayerWindow = Window & { dataLayer?: unknown[] };

export function pushEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  const w = window as DataLayerWindow;
  /* Created rather than assumed: this can run before gtm.js has arrived, and on
     a blocked or failed container it never arrives at all. Pushing onto an array
     nothing ever reads is harmless; throwing inside a form submit is not. */
  w.dataLayer = w.dataLayer ?? [];

  try {
    w.dataLayer.push({ event, ...params });
  } catch {
    /* Analytics must never be the reason an enquiry fails to send. */
  }
}
