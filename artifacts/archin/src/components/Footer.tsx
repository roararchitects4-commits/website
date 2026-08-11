import React from 'react';
import { useLocation } from 'wouter';
import logo from '@/assets/logo/logo.png';

const FOOTER_LINKS = [
  { name: 'Home',     href: '#top'     },
  { name: 'Our Work', href: '#work'    },
  { name: 'About Us', href: '#studio'  },
  { name: 'Contact',  href: '#contact' },
  { name: 'Blog',     href: '/blog'    },
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
      <div className="pt-[22px] pb-[16px] px-[max(22px,6vw)] border-t border-line flex flex-wrap gap-6 justify-between items-center text-[11px] text-muted leading-relaxed">
        <a href="#top" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src={logo} alt="" className="w-9 h-auto flex-none" aria-hidden="true" />
          <span
            className="tracking-[-0.01em] whitespace-nowrap"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#A5342C', fontSize: '18px' }}
          >
            ROAR ARCHITECTS
          </span>
        </a>

        <nav className="flex flex-wrap gap-6 uppercase tracking-wider">
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
