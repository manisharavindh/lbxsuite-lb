import React, { useRef } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';

const FeaturesSection = () => {
  const containerRef = useRef(null);

  // Raw progress for container expansion (instant responsiveness)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  // Buttery smooth physics exclusively for the up animation rising
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Container dynamically widens to exactly 100vw, losing its border radius
  const containerWidth = useTransform(scrollYProgress, [0.1, 0.8], ["90vw", "100vw"]);
  const containerRadius = useTransform(scrollYProgress, [0.1, 0.8], ["24px", "0px"]);

  // Image raises smoothly but is always visible (removed opacity fade so it's there when scrolling up/down)
  // Shortened Y travel so it stays nicely seated in the box at all times
  const imageY = useTransform(smoothProgress, [0.2, 1], [150, 0]);
  const imageScale = useTransform(smoothProgress, [0.2, 1], [0.95, 1.05]);

  return (
    <section id="features" className="relative z-10 pt-24 pb-12 w-full flex flex-col items-center overflow-x-hidden">
      
      {/* Title Text Area - Wrapped cleanly in max width */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-12 lg:gap-20 mb-16 md:mb-24">
        <div>
          <h2 className="text-[3.5rem] leading-[1.05] md:text-[5rem] lg:text-[6.5rem] font-serif text-[#FFFFFF] tracking-[-0.02em]">
            Digital <span style={{ textDecorationThickness: 'max(4px, 0.08em)', textUnderlineOffset: '0.15em', textDecorationSkipInk: 'none' }} className="underline decoration-[#FF5555]">engineering</span> and AI systems that push the frontier.
          </h2>
        </div>
        <div className="flex items-start lg:items-end lg:pb-6">
          <p className="text-xl md:text-[1.35rem] font-sans text-[#A9A9A9] leading-relaxed font-light">
            As a premier tech service agency, LbxSuite is dedicated to crafting high-performance software, captivating media, and autonomous AI systems that secure your competitive advantage.
          </p>
        </div>
      </div>

      {/* Explicit strict 100vh container to guarantee bounding */}
      <div ref={containerRef} className="w-full flex justify-center h-[100vh]">
        <motion.div
          className="relative bg-[#272727] overflow-hidden flex flex-col items-center pt-10 md:pt-14 lg:pt-20 border-y border-white/5 shadow-2xl h-full w-full"
          style={{ width: containerWidth, borderRadius: containerRadius }}
        >
          {/* Subtle grid pattern inside card for depth */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

          {/* Fixed text container. Using 'vw' bounds guarantees absolute immunity against text line-break reflowing when the parent div artificially widens from 90vw to 100vw on mobile! */}
          <div className="text-center z-10 relative flex flex-col items-center shrink-0 w-[85vw] max-w-[320px] sm:max-w-[450px] md:max-w-[650px] lg:max-w-[800px] mb-2 md:mb-6">
            <p className="text-[#FF5555] text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase mb-2 md:mb-4 font-bold">Autonomy</p>
            <h3 className="text-3xl md:text-4xl lg:text-[4rem] font-serif text-[#FFFFFF] uppercase tracking-wide leading-[1.1] md:leading-tight">
              Scaling at the<br /><span className="italic font-light text-[#A9A9A9]">speed of thought</span>
            </h3>
            <p className="text-[#A9A9A9] font-sans mt-4 md:mt-6 text-[13px] md:text-base max-w-xl leading-relaxed">
              Our autonomous agents orchestrate entire workflows—accelerating delivery by 10x while maintaining flawless precision across every project vector.
            </p>
          </div>

          {/* Flex-1 strictly allocates the ENTIRE remaining 100vh height specifically to the image wrapper, preventing overlap! */}
          <div className="w-full flex-[1_1_100%] min-h-0 relative flex justify-center items-start pointer-events-none z-0 mt-4 md:mt-8">
             {/* Massive 90% width ensures majestic layout presence. Absolute top-0 anchors the head to the flex sub-frame directly. */}
            <motion.img
              src="/ai-robot-front-transparent.png"
              alt="AI Robot Front Facing"
              className="absolute top-0 w-[140%] sm:w-[120%] md:w-[100%] lg:w-[90%] max-w-[1300px] h-auto object-cover object-top z-0 origin-top drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ y: imageY, scale: imageScale }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
