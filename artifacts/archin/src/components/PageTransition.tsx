import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  /** How long the wordmark holds before the cover wipes away. The default
   *  covers one full 1.7s light sweep across it (see .loading-wordmark in
   *  index.css); anything shorter cuts the sweep off part-way, which reads
   *  fine but is a deliberate trade for a quicker entrance. */
  holdMs?: number;
  /** How long the wipe itself takes. */
  wipeMs?: number;
}

export function PageTransition({ holdMs = 1800, wipeMs = 1150 }: PageTransitionProps = {}) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, holdMs);
    return () => clearTimeout(timer);
  }, [holdMs]);

  return (
    <div
      className={`fixed inset-0 z-[9000] flex items-center justify-center transition-all ease-[cubic-bezier(0.65,0,0.24,1)] ${
        isLeaving ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      /* The wipe duration is inline rather than a Tailwind class because it is
         now caller-supplied, and Tailwind only ships the arbitrary values it
         can see in the source at build time. */
      style={{
        transitionDuration: `${wipeMs}ms`,
        backgroundColor: '#6B1F17',
        clipPath: isLeaving
          ? 'ellipse(78vw 68vh at 50% -85vh)'
          : 'ellipse(78vw 68vh at 50% 50%)'
      }}
      aria-hidden="true"
    >
      <span
        className={`loading-wordmark leading-none tracking-[-0.01em] whitespace-nowrap transition-opacity duration-500 ${
          isLeaving ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
      >
        ROAR ARCHITECTS
      </span>
    </div>
  );
}
