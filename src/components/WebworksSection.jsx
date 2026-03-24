import React from 'react';
import ScrollGridWorks from './ScrollGridWorks';

const items = [
  "wws/006.webp",
  "wws/002.webp",
  "wws/009.webp",
  "wws/004.webp",
  "wws/001.webp",
  "wws/008.webp",
  "wws/005.webp",
  "wws/003.webp",
  "wws/007.webp",
  "wws/010.webp",
  "wws/002.webp",
  "wws/006.webp",
  "wws/004.webp",
  "wws/001.webp",
  "wws/009.webp",
  "wws/007.webp",
  "wws/003.webp",
  "wws/008.webp",
  "wws/005.webp",
];

function shuffleNoAdjacent(arr) {
  let shuffled = [...arr];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Fix adjacent duplicates
  for (let i = 1; i < shuffled.length; i++) {
    if (shuffled[i] === shuffled[i - 1]) {
      // find a different item ahead to swap
      for (let j = i + 1; j < shuffled.length; j++) {
        if (shuffled[j] !== shuffled[i]) {
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          break;
        }
      }
    }
  }

  return shuffled;
}

const WebworksSection = () => {
  // Prevent excessive component continuous rendering calculations by computing once
  const shuffledItems = React.useMemo(() => shuffleNoAdjacent(items), []);

  return (
    <section id="webworks" className="relative w-full bg-transparent pt-4 mb-6">
      {/* <div className="text-center mb-0 relative z-20 w-full max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-white tracking-tight">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5655] to-[#FF8888]">Webworks</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
          A collection of our modern layouts, interactive designs, and animated experiences seamlessly brought to life.
        </p>
      </div> */}

      <ScrollGridWorks items={shuffledItems} />
    </section>
  );
};

export default WebworksSection;
