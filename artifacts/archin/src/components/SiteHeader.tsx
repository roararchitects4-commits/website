import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import logo from '@/assets/logo/logo.png';
import { sectionIdFor, scrollToSection, CONTACT_PATH } from '../lib/sections';

/* Every entry is a real path, including the four that are sections of the home
   page rather than pages of their own — see lib/sections. */
const NAV_LINKS = [
  { name: 'HOME',         href: '/' },
  { name: 'ABOUT US',     href: '/about' },
  { name: 'WORK',         href: '/work' },
  { name: 'TEAM',         href: '/team' },
  /* A page of its own, not a section of the home page. */
  { name: 'GET IN TOUCH', href: CONTACT_PATH },
];

export function SiteHeader() {
  const [location] = useLocation();
  /* True on every one of the home page's paths, not just "/" — the brand mark
     and the scroll listener belong to the page, and /work is the same page. */
  const isHome = sectionIdFor(location) !== undefined;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  /* Links navigate client-side, so without this the dropdown is still hanging
     open over the page you just landed on. */
  useEffect(() => setMenuOpen(false), [location]);

  /* wouter drops a navigation to the path you are already on, which would
     leave HOME inert while you sit at "/" and WORK inert once you had followed
     it. Take those clicks over and scroll to the section by hand — cancelling
     the event is also what tells wouter to keep out of it. */
  const handleNavClick = (href: string) => (event: React.MouseEvent) => {
    setMenuOpen(false);
    const id = sectionIdFor(href);
    if (!id || href !== location) return;
    event.preventDefault();
    scrollToSection(id);
  };

  /* The dropdown covers the top of the page it sits over; letting that page
     scroll underneath it leaves the menu floating over unrelated content. */
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const showBrand = scrolled || !isHome;

  return (
    <header className="site-header sticky top-0 z-50 flex items-center justify-between px-5 md:px-8 py-[14px] border-b border-[rgba(42,36,32,0.15)]">
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(link => (
          <Link
            key={link.name}
            href={link.href}
            onClick={handleNavClick(link.href)}
            className="font-sans font-bold text-[13px] tracking-[0.13em] text-[#2a2420] hover:text-[#9b3a2c] transition-colors duration-200"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger toggle */}
      <button
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(o => !o)}
        /* 44px box around the 24px glyph — the bars themselves are far under
           the minimum comfortable touch target, and the padding buys that back
           without redrawing the icon. */
        className="md:hidden flex flex-col justify-center items-start gap-[5px] w-11 h-11 -ml-3.5 -my-2.5 pl-2.5 flex-none"
      >
        <span className={`block h-[1.5px] w-6 bg-[#2a2420] transition-transform duration-200 ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
        <span className={`block h-[1.5px] w-6 bg-[#2a2420] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-[1.5px] w-6 bg-[#2a2420] transition-transform duration-200 ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
      </button>

      <div className="relative h-6 flex items-center min-w-[140px] md:min-w-[220px] justify-end">
        <Link
          href="/"
          onClick={handleNavClick('/')}
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
        </Link>
      </div>

      {/* Mobile nav dropdown. Capped and scrollable so the list still reaches
          its last item on a phone held sideways, where the viewport is barely
          taller than the menu itself. */}
      {menuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 max-h-[calc(100dvh-56px)] overflow-y-auto bg-white border-b border-[rgba(42,36,32,0.15)] flex flex-col shadow-lg">
          {NAV_LINKS.map(link => (
            <Link
              key={link.name}
              href={link.href}
              onClick={handleNavClick(link.href)}
              className="px-5 py-4 font-sans font-bold text-[13px] tracking-[0.13em] text-[#2a2420] border-b border-[rgba(42,36,32,0.08)] last:border-b-0 hover:text-[#9b3a2c] transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
