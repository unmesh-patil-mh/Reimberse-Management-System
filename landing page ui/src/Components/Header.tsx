'use client';

import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-[60] flex flex-col justify-center items-center md:hidden transition-transform duration-500 ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-black/60 hover:text-black transition-colors"
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <nav className="flex flex-col gap-8 text-center">
          {['Features', 'How It Works', 'Preview', 'Get Started'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-display font-black text-black/60 hover:text-black transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b-2 border-black' :'bg-white border-b-2 border-black'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <AppLogo
              size={26}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer"
            />
            <span className="font-display font-black text-black text-lg tracking-tight">
              ReimburseFlow
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Preview', href: '#preview' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-mono text-xs font-bold tracking-widest uppercase text-black/40 hover:text-black transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#cta"
              className="hidden md:inline-flex items-center gap-2 bg-black text-white border-2 border-black px-5 py-2 font-mono text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:translate-x-[-1px] hover:translate-y-[-1px]"
              style={{ boxShadow: '3px 3px 0 #FFE600' }}
            >
              Get Started
            </a>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-black/60 hover:text-black transition-colors ml-2"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;