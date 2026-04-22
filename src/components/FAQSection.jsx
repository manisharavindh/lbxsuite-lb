import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: "Do you handle everything from branding to website and e-commerce development?",
    answer: "Yes. We’re a full-stack shop, so you’re not juggling three different agencies pointing fingers when something breaks. One team, one point of contact, one clear timeline. Branding, design, development, launch, all handled."
  },
  {
    question: "What's your process for delivering a project?",
    answer: "We don’t just jump into building. First, we understand your business and what actually matters. Then we design, build, test, and launch everything properly. You’ll always know what’s happening, what’s next, and where things stand. No black box."
  },
  {
    question: "How long does a typical project take?",
    answer: "Depends on what you’re building. A simple site? A few weeks. Something more complex like a full platform? A couple of months. Either way, we’ll give you a clear, realistic timeline upfront and stick to it."
  },
  {
    question: "Do you provide marketing services as well?",
    answer: "Yeah, but not in the “we run your ads” sense. We build everything with marketing in mind, fast, SEO-ready, and fully integrated with your tools. So when you do market, it actually works."
  },
  {
    question: "Do you build MVPs or just full-scale products?",
    answer: "Both. If you need a fast MVP to test an idea, we’ll help you move quickly without overbuilding. If you’re scaling and need something solid and future-proof, we do that too."
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Of course. Launch isn’t the finish line, it’s the starting point. We stick around for maintenance, improvements, and keeping everything running smoothly as you grow."
  },
];

const QAItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-[#272727]">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-6 md:py-8 text-left focus:outline-none group cursor-pointer"
        data-track={`FAQ — ${question.substring(0, 60)}`}
      >
        <span className={`text-sm md:text-[1.125rem] font-sans transition-colors duration-300 pr-8 font-semibold opacity-90 group-hover:opacity-100 ${isOpen ? 'text-[#FFFFFF]' : 'text-[#FFFFFF]'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-[#FFFFFF] flex-shrink-0"
        >
          <Plus size={20} strokeWidth={1.5} className="md:w-[24px] md:h-[24px]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 md:pb-8 text-[#A9A9A9] text-sm md:text-base font-sans leading-relaxed pr-8 md:pr-16 max-w-4xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative z-10 w-full bg-[#141414] pt-28 md:pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FFFFFF] leading-tight font-medium mb-2">
          Questions? We got answers.
        </h2>

        <div className="flex flex-col md:mx-0">
          {faqs.map((faq, index) => (
            <QAItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
