import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';

const TrustedBy = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const logos = [
    'TechCorp', 'Innovate AI', 'NextWave', 'DataFlow', 'CreativeX', 'Quantum'
  ];

  return (
    <section className="relative z-10 py-16 md:py-20 border-y border-white/[0.05]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-white/25 mb-10">
            Trusted by forward-thinking teams
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-12 md:gap-x-16 gap-y-6">
            {logos.map((logo, i) => (
              <motion.div
                key={logo}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-lg md:text-xl font-sans font-bold tracking-tight text-white/[0.12] hover:text-white/25 transition-colors duration-500 cursor-default select-none"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;
