import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const CTASection = () => {
  const links = [
    "Our Development Protocol",
    "AI Alignment & Ethics",
    "View Case Studies"
  ];

  return (
    <section id="contact" className="relative z-10 py-24 md:py-32 border-y border-white/5 max-w-[1400px] mx-auto px-6 md:px-12 mt-12 bg-[#141414]">
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 lg:gap-32">
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-[2.5rem] lg:text-[2.75rem] leading-[1.15] font-serif text-[#FFFFFF] mb-8">
            Ready to build something remarkable? Let's connect and discuss your vision.
          </h2>
          <p className="text-[#A9A9A9] font-sans md:text-lg mb-12 max-w-md">
            We funnel ambitious ideas into high-performance software. Book an introductory call with our technical leads today.
          </p>
          <a href="mailto:hello@lbxsuite.com" className="bg-[#FF5555] text-white px-8 py-4 rounded text-lg font-sans font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-[#141414] transition-colors duration-300 w-fit shadow-lg shadow-[#FF5555]/20">
            Book an Intro Call
            <ArrowUpRight size={20} />
          </a>
        </div>

        <div className="flex flex-col mt-2 lg:mt-0">
          <h3 className="text-lg font-bold uppercase mb-8 text-[#A9A9A9] font-sans tracking-widest">Learn More</h3>
          {links.map((link, index) => (
            <a
              key={index}
              href="#"
              className={`py-6 lg:py-8 flex justify-between items-center group ${index === 0 ? 'border-y' : 'border-b'} border-white/10 hover:border-[#FF5555]/50 transition-colors duration-300`}
            >
              <span className="text-base lg:text-lg font-sans font-medium text-[#A9A9A9] group-hover:text-[#FFFFFF] transition-colors duration-300">
                {link}
              </span>
              <ArrowRight size={20} className="text-[#FF5555] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
