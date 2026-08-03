import React, { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';

const navLinks = [
  { name: 'Home', href: '#top' },
  { name: 'Work', href: '#work' },
  { name: 'Studio', href: '#studio' },
  { name: 'Journal', href: '#journal' },
  { name: 'Contact', href: '#contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-stretch border-b-2 border-ink bg-[#f4f3f0] text-ink">
      <nav className="flex-1 flex items-center gap-6 md:gap-8 px-6">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="font-bold uppercase text-[13px] md:text-[14px] tracking-wide hover:text-accent transition-colors"
          >
            {link.name}
          </a>
        ))}
      </nav>
      <a
        href="#top"
        className={`flex items-center gap-3 px-6 py-3 flex-none hover:text-accent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <img src={logo} alt="" className="w-6 h-auto flex-none" aria-hidden="true" />
        <span className="font-sans font-extrabold text-lg tracking-tight">
          ROAR <span className="font-light">ARCHITECTS</span>
        </span>
      </a>
    </header>
  );
}
