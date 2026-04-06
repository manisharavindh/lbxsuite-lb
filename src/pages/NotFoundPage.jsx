import React from 'react';
import Navbar from '../components/Navbar';
import AnimatedButton from '../components/AnimatedButton';
import pixelImg from '../assets/404/pixel.png';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative flex flex-col selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      {/* Background Soft Glow to fit the LbxSuite aesthetic perfectly */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,_rgba(255,85,85,0.05),_transparent_60%)] pointer-events-none z-0" />
      
      {/* Premium Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />
      
      {/* Top Navbar Gradient Fade to smooth out grid under navbar */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-0" />

      {/* Navbar Overlay */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center gap-8 lg:gap-12 flex-grow px-6 py-12 md:px-12 max-w-[1400px] mx-auto w-full">


        {/* Typography & Action */}
        <div
          className="flex flex-col items-center justify-center text-center z-10 relative"
        >
          {/* Primary Typography Broken 404 */}
          <h1 className="font-sans text-[100px] sm:text-[120px] md:text-[130px] lg:text-[150px] font-black text-[#FFFFFF] leading-[0.8] tracking-widest uppercase mb-6 md:mb-8 flex items-center justify-center">
            <span className="inline-block drop-shadow-[5px_5px_0_rgba(255,85,85,0.4)] transform -rotate-[8deg] -translate-y-1">
              4
            </span>
            <span className="inline-block text-[#FF5555] opacity-80 z-10 relative translate-y-1">
              0
            </span>
            <span className="inline-block drop-shadow-[-5px_-5px_0_rgba(255,85,85,0.4)] transform rotate-[12deg]">
              4
            </span>
          </h1>

          <p className="font-serif italic text-[26px] sm:text-[32px] md:text-[40px] lg:text-[45px] font-light text-[#A9A9A9] mb-10 leading-none text-center">
            Page not found.
          </p>

          <AnimatedButton href="/" size="md" className="shadow-2xl" data-track="404 — Return Home CTA">
            Return Home
          </AnimatedButton>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
