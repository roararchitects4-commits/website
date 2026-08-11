import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import logo from '@/assets/logo/logo.png';

const NAV_LINKS = [
  { name: 'HOME',     href: '#top'     },
  { name: 'OUR WORK', href: '#work'    },
  { name: 'ABOUT US', href: '#studio'  },
  { name: 'CONTACT',  href: '#contact' },
];

const navHref = (isHome: boolean, href: string) => {
  if (href.startsWith('/')) return href;
  return isHome ? href : `/${href}`;
};

export function SiteHeader() {
  const [location] = useLocation();
  const isHome = location === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const showBrand = scrolled || !isHome;

  return (
    <header className="site-header sticky top-0 z-50 flex items-center justify-between px-5 md:px-8 py-[14px] border-b border-[rgba(42,36,32,0.15)]">
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(link => (
          <a
            key={link.name}
            href={navHref(isHome, link.href)}
            className="font-sans font-bold text-[13px] tracking-[0.13em] text-[#2a2420] hover:text-[#9b3a2c] transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </nav>

      {/* Mobile hamburger toggle */}
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(o => !o)}
        className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 -ml-1 flex-none"
      >
        <span className={`block h-[1.5px] w-6 bg-[#2a2420] transition-transform duration-200 ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
        <span className={`block h-[1.5px] w-6 bg-[#2a2420] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-[1.5px] w-6 bg-[#2a2420] transition-transform duration-200 ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
      </button>

      <div className="relative h-6 flex items-center min-w-[140px] md:min-w-[220px] justify-end">
        <a
          href={isHome ? '#top' : '/#top'}
          className={`flex items-center gap-2 md:gap-3 absolute right-0 transition-opacity duration-300 ${
            showBrand ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img src={logo} alt="" className="w-5 md:w-6 h-auto flex-none" aria-hidden="true" />
          <span
            className="tracking-[-0.01em] whitespace-nowrap text-[clamp(12px,3.6vw,18px)]"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: '#A5342C' }}
          >
            ROAR ARCHITECTS
          </span>
        </a>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[rgba(42,36,32,0.15)] flex flex-col shadow-lg">
          {NAV_LINKS.map(link => (
            <a
              key={link.name}
              href={navHref(isHome, link.href)}
              onClick={() => setMenuOpen(false)}
              className="px-5 py-4 font-sans font-bold text-[13px] tracking-[0.13em] text-[#2a2420] border-b border-[rgba(42,36,32,0.08)] last:border-b-0 hover:text-[#9b3a2c] transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
