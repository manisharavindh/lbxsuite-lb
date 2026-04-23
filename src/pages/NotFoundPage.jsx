import React from 'react';
import AnimatedButton from '../components/AnimatedButton';
import InteractiveGrid from '../InteractiveGrid';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans overflow-hidden relative flex flex-col selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      {/* Interactive Grid Background */}
      <InteractiveGrid easterEgg={true} />

      {/* Main Container perfectly centered */}
      <main className="relative z-10 flex flex-col justify-center min-h-screen px-6 w-full max-w-[1400px] mx-auto pointer-events-none">

        {/* Typography & Action */}
        <div className="z-10 relative pointer-events-auto flex flex-col items-center text-center md:items-start md:text-left">
          {/* Primary Typography Broken 404 */}
          <h1 className="font-sans text-[100px] sm:text-[120px] md:text-[130px] lg:text-[150px] font-black text-[#FFFFFF] leading-[0.8] tracking-widest uppercase mb-4 md:mb-6 flex items-center justify-center md:justify-start">
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

          <h2 className="text-[26px] sm:text-[32px] md:text-[40px] font-medium text-white mb-4 tracking-tight leading-none">
            Looks like you're lost.
          </h2>

          <p className="text-[1rem] sm:text-[1.1rem] text-[#A9A9A9] max-w-[500px] mb-4 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <AnimatedButton href="/" size="md" className="shadow-2xl hover:scale-105 transition-transform" data-track="404 — Return Home CTA">
            Return to Homepage
          </AnimatedButton>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
