import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-40 w-full text-[#FFFFFF] px-6 md:px-12 pt-12 pb-8 font-sans overflow-hidden">
      {/* 
        Foreground shadow overlay to smoothly blend the footer top 
      */}
      <style>{`
        .footer-vignette-top {
          box-shadow: inset 0 40px 60px -10px #141414;
        }
        @media (min-width: 768px) {
          .footer-vignette-top {
            box-shadow: inset 0 80px 100px -20px #141414;
          }
        }
      `}</style>
      <div className="absolute inset-x-0 top-0 h-32 md:h-48 z-10 pointer-events-none footer-vignette-top" />

      {/* Top Info Section -> Replaced with Original Link Grid */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto pt-16 md:pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-8">
          <div>
            <div className="text-4xl md:text-5xl font-sans font-black tracking-tighter text-[#FFFFFF] mb-6 uppercase">
              LBXSUITE
            </div>
            <p className="text-sm font-sans text-[#A9A9A9] max-w-xs mt-4 leading-relaxed">
              AI-powered creative agency building the future of digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 text-xs md:text-sm font-sans">
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Explore</h4>
              <Link to="/blog" className="text-[#A9A9A9] hover:text-white transition-colors">Blog</Link>
              <a href="#" className="text-[#A9A9A9] hover:text-white transition-colors">Portfolio</a>
              <a href="#" className="text-[#A9A9A9] hover:text-white transition-colors">Free Giveaways</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Services</h4>
              <a href="#" className="text-[#A9A9A9] hover:text-white transition-colors">Enterprise</a>
              <a href="#" className="text-[#A9A9A9] hover:text-white transition-colors">Startups</a>
              <a href="#" className="text-[#A9A9A9] hover:text-white transition-colors">E-commerce</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-[10px]">Social</h4>
              <a href="#" className="text-[#A9A9A9] hover:text-white transition-colors">Linkedin</a>
              <a href="#" className="text-[#A9A9A9] hover:text-white transition-colors">Instagram</a>
              <a href="#contact" className="text-[#A9A9A9] hover:text-white transition-colors font-bold">Google Meet</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Element: Scrolling "SAY HI" Marquee */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto flex flex-col items-center border-y border-[#272727] pt-6 pb-4">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          .marquee-mask {
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
          }
        `}</style>
        <a href="#contact" className="block w-full overflow-hidden group decoration-transparent marquee-mask">
          <div className="flex w-max animate-marquee items-center">
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex shrink-0 items-center">
                {[...Array(5)].map((_, itemIndex) => (
                  <div key={itemIndex} className="flex shrink-0 items-center">
                    <h1 style={{ fontFamily: 'monospace' }} className="text-2xl md:text-3xl lg:text-4xl leading-none tracking-tight text-[#555555] group-hover:text-[#FFFFFF] transition-colors duration-500 select-none">
                      SAY HI
                    </h1>
                    <span style={{ fontFamily: 'monospace' }} className="text-2xl md:text-3xl lg:text-4xl leading-none text-[#555555] group-hover:text-[#FFFFFF] transition-colors duration-500 select-none px-6 md:px-12">
                      —
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </a>
      </div>

      {/* Bottom bar */}
      <div className="relative z-20 flex flex-col md:flex-row justify-between items-center md:items-end pt-12 md:pt-12 pb-12 font-sans text-xs text-[#A9A9A9] space-y-6 md:space-y-0 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center space-x-6">
          <span>© 2026 LbxSuite. All rights reserved.</span>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FFFFFF] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
