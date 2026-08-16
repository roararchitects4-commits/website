import { useEffect, useState } from 'react';

/* Seconds held before scroll-triggered entrances begin in the scaled-down
   view. PageTransition covers the page for ~1950ms; anything that starts
   before that runs its course unseen. */
export const SCALED_VIEW_ENTRANCE_DELAY = 2.2;

/**
 * True when the page is being laid out at a desktop width and scaled down to
 * fit a phone — the mode index.html sets up with `width=1440`.
 *
 * Detected by viewport height rather than width: the width is pinned at 1440
 * everywhere in this mode, so it says nothing about the device. The height is
 * the giveaway — the browser divides the device height by the same scale
 * factor, so a phone reports a viewport somewhere between roughly 1900 and
 * 3100 CSS px tall. No real browser window is that tall at 1440 wide. This is
 * the same signal index.css keys its tall-viewport rules on; keep the two in
 * step if either changes.
 *
 * Why anything downstream cares: at that height most of the page is on screen
 * at once, so "animate when scrolled into view" fires for nearly everything
 * during load. Components use this to switch to timed entrances instead.
 */
export function useScaledDownView() {
  const [scaled, setScaled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-height: 1500px)');
    const update = () => setScaled(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return scaled;
}
