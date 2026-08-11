import React from 'react';
import logo from '@/assets/logo/logo.png';

export function Footer() {
  return (
    <footer className="bg-white text-ink relative z-10">
      <div className="relative pt-[28px] pb-[300px] px-[max(22px,6vw)] border-t border-line text-[11px] text-muted leading-relaxed">
        <div className="flex flex-col items-start gap-4">
          <a href="#top" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <img src={logo} alt="" className="w-9 h-auto flex-none" aria-hidden="true" />
            <span
              className="tracking-[-0.01em] whitespace-nowrap"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#A5342C', fontSize: '18px' }}
            >
              ROAR ARCHITECTS
            </span>
          </a>

          <nav className="flex flex-col gap-2 uppercase tracking-wider">
            <a href="#work" className="hover:text-accent transition-colors">Work</a>
            <a href="#studio" className="hover:text-accent transition-colors">Studio</a>
          </nav>
        </div>

        <div className="absolute right-[max(22px,6vw)] bottom-8 text-[10.5px] tracking-[0.14em]">
          &copy; {new Date().getFullYear()} Roar Architects. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
