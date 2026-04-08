import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveGrid from '../InteractiveGrid';

const GiveawaysPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF] relative">
      <InteractiveGrid />
      <Navbar />

      <main className="flex-grow w-full max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col justify-center items-center text-center relative z-10 pt-20 pb-20">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter leading-[1.1] mb-8 text-[#FFFFFF]">
          Massive.<br />Incoming.
        </h1>

        <p className="text-[#A9A9A9] max-w-md mx-auto text-base md:text-lg leading-relaxed">
          We are preparing our next community drop.<br className="hidden md:block" /> Stay tuned, keep your notifications locked in.
        </p>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default GiveawaysPage;
