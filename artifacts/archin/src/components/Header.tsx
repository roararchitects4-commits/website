import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Studio', href: '#studio' },
    { name: 'Services', href: '#services' },
    { name: 'Journal', href: '#journal' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-400 text-white ${
          isScrolled || menuOpen
            ? 'bg-ink/90 backdrop-blur-md py-[14px] px-[max(20px,4vw)]'
            : 'bg-transparent py-[22px] px-[max(20px,4vw)]'
        }`}
      >
        <div className="flex items-center gap-[max(14px,2vw)]">
          <button
            className="flex flex-col gap-[6px] p-[6px] bg-transparent border-0 cursor-none z-50 group"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-[26px] h-[1.5px] bg-white transition-all duration-350 ${menuOpen ? 'translate-y-[7.5px] rotate-45' : ''}`}></span>
            <span className={`w-[26px] h-[1.5px] bg-white transition-all duration-350 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-[26px] h-[1.5px] bg-white transition-all duration-350 ${menuOpen ? '-translate-y-[7.5px] -rotate-45' : ''}`}></span>
          </button>
          
          <a href="#top" className="flex items-center gap-[11px] text-[17px] font-extralight tracking-[0.4em] z-50 relative">
            <img src={logo} alt="" className="w-[23px] h-auto flex-none" aria-hidden="true" />
            <span><strong className="font-medium">ROAR</strong> ARCHITECTS</span>
          </a>
        </div>

        <a 
          href="#contact" 
          className="hidden md:block text-[11px] tracking-[0.28em] font-normal border-b border-accent pb-1 transition-opacity hover:opacity-70 z-50 relative uppercase"
        >
          Contact Us
        </a>
      </header>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-40 bg-secondary-bg flex flex-col items-center justify-center text-center"
          >
            <nav>
              <div className="font-sans text-[10px] tracking-[0.32em] text-muted mb-[26px] flex flex-col items-center">
                <span className="block w-[26px] h-[1px] bg-accent mb-[14px]"></span>
                ARCHITECTURE · INTERIORS · LANDSCAPING
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-serif font-light text-[clamp(30px,5vw,52px)] text-muted transition-all duration-300 hover:text-ink hover:tracking-[0.04em]"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
