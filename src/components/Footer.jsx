import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#141414] text-[#A9A9A9] py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-8 mb-24 md:mb-32">
          <div>
            <div className="text-4xl md:text-5xl font-sans font-black tracking-tighter text-[#FFFFFF] mb-6 uppercase">
              LBXSUITE
            </div>
            <p className="text-sm font-sans text-[#A9A9A9] max-w-xs mt-4 leading-relaxed">
              AI-powered creative agency building the future of digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-xs md:text-sm font-sans">
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Products</h4>
              <a href="#" className="hover:text-white transition-colors">Digital Agents</a>
              <a href="#" className="hover:text-white transition-colors">Web Systems</a>
              <a href="#" className="hover:text-white transition-colors">Media Suite</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Solutions</h4>
              <a href="#" className="hover:text-white transition-colors">Enterprise</a>
              <a href="#" className="hover:text-white transition-colors">Startups</a>
              <a href="#" className="hover:text-white transition-colors">E-commerce</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Company</h4>
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Careers</a>
              <a href="#contact" className="hover:text-white transition-colors text-[#FF5555] font-bold">Contact</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-end pt-8 border-t border-[#272727] text-xs font-sans space-y-6 md:space-y-0">
          <div className="flex items-center space-x-6">
            <span>© 2026 LbxSuite. All rights reserved.</span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-6 text-[#A9A9A9]">
              <a href="#" className="hover:text-[#FFFFFF] transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-[#FFFFFF] transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-[#FFFFFF] transition-colors"><Github size={18} /></a>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#FFFFFF] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
