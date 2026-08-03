import React from 'react';
import logo from '@/assets/logo.png';

const MARQUEE_WORDS = ['Dedicated', 'Creative', 'Innovative', 'Sustainable', 'Passionate', 'Timeless'];

function FooterMarqueeTrack() {
  return (
    <div className="flex items-center flex-none animate-[footerMarqueeScroll_36s_linear_infinite]">
      {MARQUEE_WORDS.map((word, idx) => (
        <span
          key={idx}
          className="text-[9vw] md:text-[5vw] font-extrabold uppercase leading-none px-6 flex-none text-ink"
          style={
            idx % 2 === 0
              ? { WebkitTextStroke: '1.5px var(--color-ink)', color: 'transparent' }
              : undefined
          }
        >
          {word}
        </span>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-white text-ink relative z-10">
      <div className="border-t border-line py-6 overflow-hidden">
        <div className="flex w-max">
          <FooterMarqueeTrack />
          <FooterMarqueeTrack />
        </div>
      </div>

      <div className="pt-[34px] pb-[24px] px-[max(22px,6vw)] border-t border-line flex flex-wrap gap-6 justify-between items-end text-[11px] text-muted leading-relaxed">
        <a href="#top" className="flex items-center gap-3 font-sans font-extrabold text-lg tracking-tight text-ink hover:text-accent transition-colors">
          <img src={logo} alt="" className="w-6 h-auto flex-none" aria-hidden="true" />
          <span>ROAR <span className="font-light">ARCHITECTS</span></span>
        </a>

        <nav className="flex gap-6 uppercase tracking-wider">
          <a href="#work" className="hover:text-accent transition-colors">Work</a>
          <a href="#studio" className="hover:text-accent transition-colors">Studio</a>
          <a href="#services" className="hover:text-accent transition-colors">Services</a>
        </nav>

        <div className="text-[10.5px] tracking-[0.14em]">
          &copy; {new Date().getFullYear()} Roar Architects. All rights reserved.
        </div>
      </div>

      <style>{`
        @keyframes footerMarqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </footer>
  );
}
