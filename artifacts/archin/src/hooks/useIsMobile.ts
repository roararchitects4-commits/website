import { useEffect, useState } from 'react';

/**
 * True below Tailwind's `md` breakpoint — the phone layout.
 *
 * Deliberately pinned to 767px so it lines up exactly with the `md:` variants
 * the components use: where a value has to be decided in JS (an animation
 * input, say, that no stylesheet can reach) it still switches at the same
 * width as the classes around it. Keep the two in step if the breakpoint moves.
 *
 * Distinct from `useScaledDownView`, which keys on viewport *height* to spot a
 * desktop-width page scaled down to a phone. That is a different question, and
 * since the viewport meta moved to `width=device-width` it is no longer the one
 * to ask about whether a real phone is looking at the page.
 */
export function useIsMobile() {
  /* Read on the first render rather than defaulting to false and correcting in
     an effect: callers feed this to animations that are set up on mount, so a
     phone starting out on the desktop value would show the desktop treatment
     for a frame and, worse, may have already baked it into an animation that
     the later correction does not revisit. Guarded for a DOM-less render. */
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isMobile;
}
