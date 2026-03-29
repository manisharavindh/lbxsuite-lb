import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Services', href: isHome ? '#services' : '/#services', isAnchor: isHome },
    { label: 'Work', href: isHome ? '#features' : '/#features', isAnchor: isHome },
    { label: 'Blog', href: '/blog', isAnchor: false },
    { label: 'Company', href: isHome ? '#contact' : '/#contact', isAnchor: isHome },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled ? 'bg-[#141414]/85 backdrop-blur-md py-4 border-white/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center text-sm font-sans font-medium relative">

          {/* Left: Logo */}
          <Link to="/" className="font-sans tracking-tight uppercase text-xl md:text-2xl font-black text-[#FFFFFF] hover:opacity-80 transition-opacity">
            LBXSUITE
          </Link>

          {/* Right: Links & Button */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 font-bold text-[#FFFFFF]">
            {navLinks.map(link => (
              link.isAnchor ? (
                <a key={link.label} href={link.href} className="hover:text-[#A9A9A9] transition-colors">
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`hover:text-[#A9A9A9] transition-colors ${location.pathname.startsWith(link.href) && link.href !== '/' ? 'text-[#FF5555]' : ''
                    }`}
                >
                  {link.label}
                </Link>
              )
            ))}
            <AnimatedButton href={isHome ? '#contact' : '/#contact'} size="sm" variant="nav" className="ml-2">
              Start a Project
            </AnimatedButton>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center z-[60]">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#FFFFFF]">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#141414] z-40 px-6 pt-[120px] pb-8 md:hidden flex flex-col h-[100dvh]">
          <div className="flex flex-col space-y-6 text-5xl font-serif text-[#FFFFFF] relative z-10">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-[#A9A9A9] transition-colors flex items-center group w-max"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`hover:text-[#A9A9A9] transition-colors flex items-center group w-max ${location.pathname.startsWith(link.href) && link.href !== '/' ? 'text-[#FF5555]' : ''
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              )
            ))}
            <div className="pt-8">
              <AnimatedButton href={isHome ? '#contact' : '/#contact'} size="lg" onClick={() => setMobileMenuOpen(false)} className="w-max">
                Start a Project
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
