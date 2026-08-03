import React from 'react';
import logo from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="pt-[34px] pb-[24px] px-[max(22px,6vw)] bg-background border-t border-line flex flex-wrap gap-6 justify-between items-end text-[11px] text-muted leading-relaxed relative z-10">
      
      <div className="flex flex-col gap-2">
        <a href="#top" className="flex items-center gap-[11px] text-[13px] font-extralight tracking-[0.4em] text-ink decoration-none group cursor-none hover:text-accent transition-colors">
          <img src={logo} alt="" className="w-5 h-auto flex-none" aria-hidden="true" />
          <span><strong className="font-medium">ROAR</strong> ARCHITECTS</span>
        </a>
      </div>

      <nav className="flex gap-6 uppercase tracking-wider">
        <a href="#work" className="hover:text-accent transition-colors cursor-none">Work</a>
        <a href="#studio" className="hover:text-accent transition-colors cursor-none">Studio</a>
        <a href="#services" className="hover:text-accent transition-colors cursor-none">Services</a>
      </nav>

      <div className="text-[10.5px] tracking-[0.14em]">
        &copy; {new Date().getFullYear()} Roar Architects. All rights reserved.
      </div>
      
    </footer>
  );
}
