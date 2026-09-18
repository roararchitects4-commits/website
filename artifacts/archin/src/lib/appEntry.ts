/* Tells a page whether it is the one the visitor arrived on, or one they
 * navigated to afterwards.
 *
 * The campaign landing page needs the difference. Arriving from an ad, it must
 * paint immediately — the entrance cover holds for roughly three seconds, which
 * is longer than a paid click will wait, and a form nobody sees is a click
 * bought for nothing. Arriving from the site's own "Get in Touch", it is just
 * another page of the site, and should open the way every other one does.
 *
 * A module-level flag rather than state or context: it is read during the first
 * render of a page, before any effect has run, and it has to survive being read
 * by a component that is nowhere near the one that sets it.
 */
let appHasMounted = false;

/** True once the app's first route has mounted — i.e. any page asking this
 *  question is one the visitor navigated to, not the one they landed on. */
export function isInAppNavigation(): boolean {
  return appHasMounted;
}

/** Called once by App, after its initial render has committed. */
export function markAppMounted(): void {
  appHasMounted = true;
}
