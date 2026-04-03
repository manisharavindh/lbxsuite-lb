import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedButton from '../components/AnimatedButton';
import { Gift, ArrowRight, Award } from 'lucide-react';

const GiveawaysPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Upcoming Giveaway Section */}
        <div className="w-full text-center py-16 md:py-24 border border-[#272727] rounded-3xl bg-[#141414] relative overflow-hidden mb-24 transition-colors hover:border-[#333333]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(255,85,85,0.08),_transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF5555]/10 flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-[#FF5555]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Something Massive is Coming</h1>
            <p className="text-[#A9A9A9] max-w-xl mx-auto text-lg mb-8 leading-relaxed">
              We are currently preparing our next massive community drop. Stay tuned, keep your notifications locked in, and prepare to participate. It's going to be worth the wait!
            </p>
            
            <form className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email to get early access..." 
                className="w-full bg-[#0a0a0a] border border-[#272727] rounded-full px-6 py-4 text-sm text-white focus:outline-none focus:border-[#FF5555] transition-colors"
              />
              <AnimatedButton text="Notify Me" as="button" className="w-full sm:w-auto flex-shrink-0" />
            </form>
          </div>
        </div>

        {/* Past Giveaways Section */}
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center">
            <span className="bg-[#FF5555] w-2 h-8 mr-4 rounded-full"></span>
            Past Drops
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {/* The Last Giveaway Card */}
            <div className="group relative border border-[#272727] bg-[#0a0a0a] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#555555] cursor-pointer">
              <div className="aspect-video bg-[#141414] relative overflow-hidden flex flex-col items-center justify-center border-b border-[#272727]">
                 <Award className="w-16 h-16 text-[#A9A9A9] mb-4 group-hover:scale-110 transition-transform duration-500" />
                 <span className="px-4 py-1.5 rounded-full bg-[#0a0a0a] border border-[#272727] text-xs font-bold text-[#A9A9A9] uppercase tracking-widest absolute top-4 left-4">
                   Concluded
                 </span>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold group-hover:text-[#FF5555] transition-colors text-white">The Ultimate Setup Drop #1</h3>
                </div>
                <p className="text-[#888888] text-sm leading-relaxed mb-6">
                  Our inaugural giveaway featuring a complete premium workspace setup, including custom tech gear and lifetime LbxSuite access. 
                </p>
                <div className="inline-flex items-center text-sm font-bold tracking-wider uppercase text-white group-hover:text-[#FF5555] transition-colors">
                  View Results <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
};

export default GiveawaysPage;
