import React, { useEffect, useState } from 'react';

export function PageTransition() {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Hold long enough for one full 1.7s light sweep across the wordmark
    // (see .loading-wordmark in index.css), then animate out.
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9000] flex items-center justify-center transition-all duration-[1150ms] ease-[cubic-bezier(0.65,0,0.24,1)] ${
        isLeaving ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
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
