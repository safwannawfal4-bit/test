import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePageContent } from '../context/PageContentContext';
import Logo from './Logo';
import DiscountBadge from './DiscountBadge';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const { content } = usePageContent();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: content.nav_home || 'Home' },
    { to: '/shop', label: content.nav_shop || 'Shop' },
    { to: '/programs', label: content.nav_programs || 'Programs' },
    { to: '/about', label: content.nav_about || 'About' },
    { to: '/contact', label: content.nav_contact || 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo size="sm" variant="dark" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 hover:text-alma-lime ${
                  location.pathname === link.to
                    ? 'text-alma-green font-semibold'
                    : 'text-alma-charcoal'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Discount badge + Auth + Cart + Mobile */}
          <div className="flex items-center gap-3">
            {/* Discount badge for logged-in users */}
            {isAuthenticated && !isAdmin && (
              <div className="hidden md:block">
                <DiscountBadge />
              </div>
            )}

            {/* Auth section */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {isStaff && (
                    <Link to="/admin" className="text-xs font-bold bg-alma-green text-white px-3 py-1.5 rounded-full hover:bg-alma-green-light transition-colors">
                      {isAdmin ? 'Admin Panel' : 'Staff Panel'}
                    </Link>
                  )}
                  <span className="text-sm text-alma-charcoal/70">{user.name}</span>
                  <button
                    onClick={logout}
                    className="text-sm text-red-400 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-alma-green hover:text-alma-green-light transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-alma-green hover:text-alma-green-light transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-alma-lime text-alma-green text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-alma-green"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-alma-cream-dark">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-alma-lime/20 text-alma-green font-semibold'
                    : 'text-alma-charcoal hover:bg-alma-cream-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-alma-cream-dark pt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-1 text-sm text-alma-charcoal/70">Hi, {user.name}</div>
                  {isAuthenticated && !isAdmin && <div className="px-3"><DiscountBadge /></div>}
                  {isStaff && (
                    <Link to="/admin" className="block py-2 px-3 rounded-lg text-sm font-bold text-alma-green bg-alma-lime/20">
                      {isAdmin ? 'Admin Panel' : 'Staff Panel'}
                    </Link>
                  )}
                  <button onClick={logout} className="block w-full text-left py-2 px-3 rounded-lg text-sm text-red-500">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 px-3 rounded-lg text-sm font-medium text-alma-green">
                    Login
                  </Link>
                  <Link to="/register" className="block py-2 px-3 rounded-lg text-sm font-medium bg-alma-green text-white text-center">
                    Register - Get 20% Off
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
