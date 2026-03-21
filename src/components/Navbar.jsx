import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled ? 'bg-[#141414] py-4 border-white/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center text-sm font-sans font-medium relative">
          
          {/* Left: Logo */}
          <div className="font-sans tracking-tight uppercase text-xl md:text-2xl font-black text-[#FFFFFF]">
            LBXSUITE
          </div>

          {/* Right: Links & Button */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 font-bold text-[#FFFFFF]">
            <a href="#services" className="hover:text-[#A9A9A9] transition-colors">Services</a>
            <a href="#features" className="hover:text-[#A9A9A9] transition-colors">Work</a>
            <a href="#contact" className="hover:text-[#A9A9A9] transition-colors">Company</a>
            <a href="#contact" className="bg-[#FF5555] text-white px-5 py-2.5 rounded font-bold hover:bg-white hover:text-[#141414] transition-all duration-300 ml-2">
              Start a Project
            </a>
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
            {['Services', 'Work', 'Company'].map((link, i) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-[#A9A9A9] transition-colors flex items-center group w-max" onClick={() => setMobileMenuOpen(false)}>
                <span>{link}</span>
              </a>
            ))}
            <div className="pt-8">
              <a href="#contact" className="inline-flex bg-[#FF5555] text-white px-8 py-4 rounded text-lg font-sans font-bold hover:bg-white hover:text-[#141414] transition-all duration-300 w-max items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
                <span>Start a Project</span>
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
