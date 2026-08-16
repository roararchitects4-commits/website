import { useEffect } from 'react';

/* A mouse wheel reports deliberate intent on its first notch, so any downward
   scroll closes the overlay. A finger does not: a tap on a phone almost always
   drags a few pixels while it lifts, and at a small threshold that reads as a
   dismiss — the photo you just opened vanishes as you let go. This is the
   distance a swipe has to cover before it counts as one. */
const TOUCH_DISMISS_PX = 44;

/**
 * Closes a full-screen overlay when the visitor scrolls or swipes up, and holds
 * the page behind it still for as long as it is open.
 *
 * Shared by the two lightboxes (the home page's work grid and the gallery
 * page), which need to behave identically — the same gesture should dismiss a
 * photo wherever it was opened from.
 */
export function useDismissOnScroll(isOpen: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) onDismiss();
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY - e.touches[0].clientY > TOUCH_DISMISS_PX) onDismiss();
    };

    /* Nothing behind the overlay should move while it is up: on a phone the
       page would otherwise scroll under the image, so closing it drops you
       somewhere other than the tile you opened from. */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, onDismiss]);
}
