import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';

const Row = ({ items, direction, scrollYProgress }) => {
  // Map the section's scroll progress (0 to 1) to an even gentler horizontal shift.
  // Using an exceptionally small translation (-4%) makes it incredibly slow and direct.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === -1 ? ["0%", "-4%"] : ["-4%", "0%"]
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
          className="relative w-[260px] h-[160px] sm:w-[340px] sm:h-[200px] md:w-[420px] md:h-[240px] rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-md bg-[#0a0a0a] transform-gpu"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', contain: 'content' }}
        >
          <img
            src={src}
            alt="Featured Webwork"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover pointer-events-none"
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
      className="relative w-full flex flex-col items-center justify-center py-6 md:py-10 z-100"
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

    </div>
  );
};

export default ScrollGridWorks;
