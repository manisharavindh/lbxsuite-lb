import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative w-full h-[100svh] overflow-hidden flex flex-col pt-24 px-6 md:px-12 text-[#FFFFFF]">
      <div className="flex-grow flex flex-col justify-center relative z-10 w-full max-w-[1600px] mx-auto pb-12">

        {/* === Desktop Layout (md and above) === */}
        <div className="hidden md:flex w-full items-center relative h-full">
          {/* Left Studio Text */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 pb-12">
            <p className="text-[11px] lg:text-xs uppercase tracking-[0.15em] leading-[1.6] text-[#A9A9A9] font-sans font-medium">
              Creative<br />studio
            </p>
          </div>

          {/* Right Top Arrow */}
          <div className="absolute right-0 top-[18%] lg:top-[20%] z-20">
            <div className="w-16 h-16 flex justify-center items-center group cursor-pointer hover:scale-110 transition-transform">
              <ArrowUpRight size={56} className="text-[#A9A9A9] group-hover:text-[#FF5555] transition-colors lg:w-[64px] lg:h-[64px]" strokeWidth={2.5} />
            </div>
          </div>

          {/* Center Main Staggered Typography */}
          <div className="w-full flex justify-center relative">
            <div className="flex flex-col relative w-fit mr-[10%] lg:mr-[15%] mt-[-5%]">

              <div className="w-full flex justify-start pl-[5%] lg:pl-[10%]">
                <span className="font-sans font-medium uppercase text-[6.5vw] lg:text-[7.5vw] xl:text-[7.5rem] tracking-[-0.02em] leading-[0.95] text-[#FFFFFF]">We Are</span>
              </div>

              <div className="w-full flex justify-center ml-[5%] lg:ml-[15%] xl:ml-[18%] mt-[-1%]">
                <span className="font-sans font-medium uppercase text-[8vw] lg:text-[9vw] xl:text-[9.5rem] tracking-[-0.02em] leading-[0.95] whitespace-nowrap text-[#FFFFFF]">Full&ndash;Service</span>
              </div>

              <div className="w-full flex items-center justify-end mr-[-20%] lg:mr-[-40%] mt-[-1%] relative">
                <span className="font-sans font-medium text-[9.5vw] lg:text-[10.5vw] xl:text-[11.5rem] font-light uppercase tracking-wider leading-[0.8] relative z-10 shrink-0 text-[#FFFFFF] pt-2">Agency</span>
                <div className="w-[180px] lg:w-[260px] shrink-0 ml-4 lg:ml-8 mt-4 lg:mt-8 flex flex-col items-start">
                  <p className="text-[11px] lg:text-[14px] font-sans text-[#A9A9A9] leading-relaxed font-medium mb-6">
                    The first full-stack Web3 creative agency integrating AI technology to deliver best-in-class client experience.
                  </p>
                  
                  {/* Funnel Element */}
                  <a href="#contact" className="bg-[#FF5555] text-white px-5 py-2.5 rounded text-sm font-sans font-bold hover:bg-white hover:text-[#141414] transition-colors duration-300 inline-flex items-center gap-2 shadow-lg shadow-[#FF5555]/20">
                    Book an Intro Call
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* === Mobile Layout (below md) === */}
        <div className="md:hidden flex flex-col items-center justify-center w-full relative z-10 flex-grow -mt-[8vh]">
          <div className="flex flex-col items-center text-center w-full px-2">
            <span className="font-sans font-medium uppercase text-[16vw] sm:text-[15vw] leading-[1] tracking-tight">We Are</span>
            <span className="font-sans font-medium uppercase text-[12.8vw] sm:text-[12vw] leading-[1.05] tracking-tight whitespace-nowrap">Full&ndash;Service</span>
            <span className="font-serif italic text-[18vw] sm:text-[16.5vw] font-light uppercase tracking-wider relative z-10 leading-[0.95] mt-1">Agency</span>
          </div>

          <div className="w-full max-w-[300px] text-center mt-10 flex flex-col items-center">
            <p className="text-[13px] sm:text-[14px] font-sans text-[#A9A9A9] leading-[1.6] font-medium mb-6">
              The first full-stack Web3 creative agency integrating AI technology to deliver best-in-class client experience.
            </p>
            <a href="#contact" className="bg-[#FF5555] text-white px-6 py-3 rounded text-sm font-sans font-bold hover:bg-white hover:text-[#141414] transition-colors duration-300 inline-flex items-center gap-2">
              Book an Intro Call
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Simple Scroll Down Text */}
      <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-10 cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-300">
        <span className="font-sans text-[8px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] text-[#A9A9A9] uppercase font-medium whitespace-nowrap">
          Scroll TO EXPLORE
        </span>
      </div>
    </section>
  );
};

export default Hero;
