import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Row = ({ items, direction, scrollYProgress }) => {
  // Map the section's scroll progress (0 to 1) to an even gentler horizontal shift.
  // Using an exceptionally small translation (-8%) makes it incredibly slow and smooth.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === -1 ? ["0%", "-8%"] : ["-8%", "0%"]
  );

  // Duplicate items to ensure the row safely covers the screen during the shift
  const repeatedItems = [...items, ...items, ...items, ...items, ...items];

  return (
    <motion.div 
      className="flex gap-4 md:gap-6 w-max will-change-transform"
      style={{ x }}
    >
      {repeatedItems.map((src, idx) => (
        <div 
          key={idx} 
          className="relative w-[260px] h-[160px] sm:w-[340px] sm:h-[200px] md:w-[420px] md:h-[240px] rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-md bg-[#0a0a0a]"
        >
          <img 
            src={src} 
            alt="Featured Webwork" 
            loading="lazy"
            className="w-full h-full object-cover" 
          />
          {/* Static moody overlay to reduce brightness and push images slightly back */}
          <div className="absolute inset-0 bg-[#0a0a0a]/35 pointer-events-none" />
        </div>
      ))}
    </motion.div>
  );
};

const ScrollGridWorks = ({ items }) => {
  const containerRef = useRef(null);
  
  // Track scroll strictly based on this container's entry and exit in the viewport.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], 
  });

  // Divide items evenly across exactly 2 rows per the new layout requirement
  const itemsPerRow = Math.ceil(items.length / 2) || 1;
  const rows = Array.from({ length: 2 }, (_, i) => 
    items.slice(i * itemsPerRow, (i + 1) * itemsPerRow)
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden flex flex-col items-center justify-center bg-transparent py-10"
    >
      <div 
        className="flex flex-col gap-4 md:gap-5 w-[105vw]"
        style={{
          transform: 'rotate(-3deg) scale(1.05)',
        }}
      >
        {rows.map((rowItems, idx) => {
          const safeItems = rowItems.length > 0 ? rowItems : items;
          return (
            <Row 
              key={idx} 
              items={safeItems} 
              direction={idx % 2 === 0 ? -1 : 1} 
              scrollYProgress={scrollYProgress} 
            />
          );
        })}
      </div>

      {/* 
        Foreground Box Shadow Overlay 
        This replaces the heavy mask-image calculation with purely GPU-accelerated vignette shadows, 
        making it flawlessly merge into the application UI background without causing layout scroll lags.
        Uses a style block for clean responsive media queries!
      */}
      <style>{`
        .vignette-overlay {
          box-shadow: inset 0px 10px 30px 0px #141414, inset 0px -10px 30px 0px #141414, inset 10px 0px 30px 0px #141414, inset -10px 0px 30px 0px #141414;
        }
        @media (min-width: 768px) {
          .vignette-overlay {
            box-shadow: inset 0px 20px 50px 0px #141414, inset 0px -20px 50px 0px #141414, inset 20px 0px 50px 0px #141414, inset -20px 0px 50px 0px #141414;
          }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none z-20 vignette-overlay" />
    </div>
  );
};

export default ScrollGridWorks;
