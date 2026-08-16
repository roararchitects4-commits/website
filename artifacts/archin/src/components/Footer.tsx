import React from 'react';
import { useLocation } from 'wouter';
import logo from '@/assets/logo/logo.png';

const FOOTER_LINKS = [
  { name: 'Home',         href: '#top' },
  { name: 'Work',         href: '#work' },
  { name: 'About Us',     href: '#studio' },
  { name: 'Get in Touch', href: '#contact' },
  { name: 'Blog',         href: '/blog' },
];

export function Footer() {
  const [location] = useLocation();
  const isHome = location === '/';

  const navHref = (href: string) => {
    if (href.startsWith('/')) return href;
    return isHome ? href : `/${href}`;
  };

  return (
    <footer className="bg-white text-ink relative z-10">
      {/* justify-between only reads as a distributed row while all three blocks
          share a line. Once they wrap onto their own lines on a phone it has
          nothing to distribute and they sit ragged left, so the stacked case is
          centred instead. Extra bottom padding clears the floating
          WhatsApp/Instagram buttons, which are fixed over this corner. */}
      <div className="pt-[22px] pb-[16px] max-sm:pb-24 px-[max(22px,6vw)] border-t border-line flex flex-wrap gap-6 max-sm:gap-4 justify-center sm:justify-between items-center max-sm:text-center text-[11px] text-muted leading-relaxed">
        <a href="#top" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src={logo} alt="" className="w-9 h-auto flex-none" aria-hidden="true" />
          <span
            className="tracking-[-0.01em] whitespace-nowrap"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#A5342C', fontSize: '18px' }}
          >
            ROAR ARCHITECTS
          </span>
        </a>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 uppercase tracking-wider">
          {FOOTER_LINKS.map(link => (
            <a key={link.name} href={navHref(link.href)} className="hover:text-accent transition-colors">
              {link.name}
            </a>
          ))}
        </nav>

        <div className="text-[10.5px] tracking-[0.14em]">
          &copy; {new Date().getFullYear()} Roar Architects. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
