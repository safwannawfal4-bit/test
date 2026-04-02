import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Products', 'Use Cases', 'Developers', 'Pricing', 'Blog'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-navy-900/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#22ADF6" strokeWidth="2" />
            <path d="M8 20 L14 12 L20 16 L26 8" stroke="#22ADF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="12" r="2" fill="#34D399" />
            <circle cx="20" cy="16" r="2" fill="#34D399" />
          </svg>
          <span className="text-white font-semibold text-lg tracking-tight">
            influx<span className="text-cyan-400">data</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#get-started" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</a>
          <a href="#get-started"
            className="px-5 py-2 rounded-full text-sm font-medium bg-cyan-400 text-navy-900 hover:shadow-[0_0_20px_rgba(34,173,246,0.4)] transition-all duration-300">
            Start Free
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <path d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-900/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMobileOpen(false)}
              className="block text-gray-300 hover:text-white transition-colors">
              {l}
            </a>
          ))}
          <a href="#get-started"
            className="block w-full text-center px-5 py-2.5 rounded-full text-sm font-medium bg-cyan-400 text-navy-900 mt-4">
            Start Free
          </a>
        </div>
      )}
    </nav>
  );
}
