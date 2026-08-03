import React from 'react';

const TERMS = [
  'FORM',
  'LIGHT',
  'MATERIAL',
  'CONTEXT',
  'CRAFT',
  'DETAIL',
  'TEXTURE',
  'STRUCTURE',
  'PROPORTION',
  'SUSTAINABILITY',
  'TIMBER',
  'CONCRETE',
  'GLASS',
  'SILHOUETTE',
  'HORIZON',
];

function TickerTrack() {
  return (
    <div className="flex items-center flex-none animate-[tickerScroll_38s_linear_infinite]">
      {TERMS.map((term, idx) => (
        <span key={idx} className="flex items-center flex-none">
          <span className="text-[13px] md:text-[15px] tracking-[0.25em] uppercase text-white/70 px-6 whitespace-nowrap">
            {term}
          </span>
          <span className="w-[6px] h-[6px] rounded-full bg-accent/80 flex-none" />
        </span>
      ))}
    </div>
  );
}

export function Ticker() {
  return (
    <div className="relative border-y border-white/15 py-4 overflow-visible">
      <div className="overflow-hidden">
        <div className="flex w-max">
          <TickerTrack />
          <TickerTrack />
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
