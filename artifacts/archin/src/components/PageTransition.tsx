import React, { useEffect, useState } from 'react';

export function PageTransition() {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Wait a brief moment to show "LOADING", then animate out
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9000] flex items-center justify-center bg-ink transition-all duration-[1150ms] ease-[cubic-bezier(0.65,0,0.24,1)] ${
        isLeaving ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        clipPath: isLeaving
          ? 'ellipse(78vw 68vh at 50% -85vh)'
          : 'ellipse(78vw 68vh at 50% 50%)'
      }}
      aria-hidden="true"
    >
      <span
        className={`text-white text-[11px] font-sans tracking-[0.5em] pl-[0.5em] uppercase transition-opacity duration-500 ${
          isLeaving ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Loading
      </span>
    </div>
  );
}
