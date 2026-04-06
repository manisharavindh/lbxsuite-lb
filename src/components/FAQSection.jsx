import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: "Do you handle everything from branding to website and e-commerce development?",
    answer: "Yes, we are a full-service digital agency. We take care of everything from the initial brand identity definition to custom web and e-commerce solutions. Our approach ensures a cohesive and powerful digital presence from end to end."
  },
  {
    question: "What's your process for delivering a project?",
    answer: "Our proven methodology starts with a deep-dive discovery phase to understand your business goals. We then move through UX/UI design, agile development, and rigorous quality assurance before finally launching the product. Transparency and communication are prioritized at every step."
  },
  {
    question: "How long does a typical project take?",
    answer: "The timeline depends on the scope and complexity of your requirements. A straightforward landing page or marketing site might take 3 to 6 weeks, while a comprehensive web application or large e-commerce platform can span several months. We always provide a detailed timeline after our initial consultation."
  },
  {
    question: "Do you provide marketing services as well?",
    answer: "Our core expertise lies in designing and building exceptionally engineered digital products. While we don't manage ongoing digital marketing campaigns (like PPC or social media management), we build websites highly optimized for SEO and fully integrated with your marketing technology stack."
  },
  {
    question: "Do you build MVPs or just full-scale products?",
    answer: "We partner with businesses at all stages. Whether you are an early-stage startup looking for a rapid, nimble MVP to validate your product-market fit, or an established enterprise requiring a complex, scalable platform, we have the technical chops to deliver."
  },
  // {
  //   question: "Do you provide post-launch support?",
  //   answer: "Absolutely. A product launch is just the beginning. We offer dedicated maintenance, uptime monitoring, performance optimization, and continuous improvement retainers to ensure your system remains secure and evolves with your users' needs."
  // },
  // {
  //   question: "What if I need ongoing updates and changes?",
  //   answer: "We offer flexible retainer options designed to fit your unique requirements. This can include regular content updates, the introduction of new features, continuous design improvements, and proactive architectural scaling to support business growth."
  // },
  // {
  //   question: "Do you work with startups or only established businesses?",
  //   answer: "We work with both heavily funded startups and established corporate tier businesses. Each client receives a tailored approach that fits their operational velocity, risk profile, and strategic objectives."
  // },
  // {
  //   question: "What platforms do you build on?",
  //   answer: "We engineer solutions based on modern, robust technology stacks. Typically, our core stack includes React, Next.js, Node.js, and headless CMS platforms. However, we are technology-agnostic and select the best tools based exclusively on what the project demands for supreme performance."
  // }
];

const QAItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#272727]">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
  return (
    <section id="faq" className="relative z-10 w-full bg-[#141414] pt-28 md:pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FFFFFF] leading-tight font-medium mb-2">
          Questions? We got answers.
        </h2>

        <div className="flex flex-col md:mx-0">
          {faqs.map((faq, index) => (
            <QAItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
