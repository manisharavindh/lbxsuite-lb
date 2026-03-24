import React, { useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';

const ProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      number: '01',
      title: 'Discovery Call',
      description: 'A quick 30-minute intro call to understand your vision, goals, and challenges.',
    },
    {
      number: '02',
      title: 'Strategy & Proposal',
      description: 'We craft a detailed roadmap with milestones, timelines, and transparent pricing.',
    },
    {
      number: '03',
      title: 'Design & Build',
      description: 'Our team executes on the strategy with iterative checkpoints and rapid delivery.',
    },
    {
      number: '04',
      title: 'Launch & Scale',
      description: 'We deploy, monitor, and optimize — ensuring your product thrives post-launch.',
    }
  ];

  return (
    <section id="about" className="relative z-10 py-24 md:py-32 max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left */}
        <div>
          <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-white/40 mb-4 block">
            How We Work
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-[-0.01em] leading-[1.1] mb-6">
            From idea to launch in{' '}
            <span className="italic text-[#F0EEE6]/80">weeks, not months</span>
          </h2>
          <p className="text-base font-sans text-white/40 leading-relaxed mb-10 max-w-[440px]">
            Our proven 4-step process ensures every project is delivered on time, on budget, and with zero surprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="bg-[#F0EEE6] text-[#0a0a0a] px-7 py-3.5 rounded-full text-sm font-sans font-bold hover:bg-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Start Your Project
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/[0.06]">
            {['Free consultation', 'No-obligation quote', 'NDA protected'].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400/70" />
                <span className="text-[11px] font-sans text-white/35 font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Steps */}
        <div ref={ref} className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group py-7 border-b border-white/[0.06] first:border-t flex gap-6 items-start hover:bg-white/[0.02] px-4 -mx-4 rounded-lg transition-colors duration-300"
            >
              <span className="text-[11px] font-mono text-white/20 mt-1.5 shrink-0 tracking-wider">
                {step.number}
              </span>
              <div>
                <h3 className="text-lg font-serif text-white mb-1.5 group-hover:text-[#F0EEE6] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm font-sans text-white/35 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
