import React from 'react';
import { ArrowRight } from 'lucide-react';

const ServicesGrid = () => {
  const services = [
    {
      title: "Agentic AI Solutions",
      body: "Autonomous systems that work for you. We implement intelligent agents to automate complex workflows and decision-making.",
      buttonText: "Explore AI",
      date: "March 15, 2026",
      category: "Artificial Intelligence"
    },
    {
      title: "Web & App Development",
      body: "Custom architectures built for scale. From high-converting landing pages to complex, full-stack SaaS platforms.",
      buttonText: "View Stack",
      date: "March 12, 2026",
      category: "Software Engineering"
    },
    {
      title: "Video Editing & Motion",
      body: "Visual storytelling that captivates. Cinematic cuts, motion graphics, and brand narratives engineered for high engagement.",
      buttonText: "See Reel",
      date: "March 08, 2026",
      category: "Creative Media"
    }
  ];

  return (
    <section id="services" className="relative z-10 py-16 max-w-[1400px] mx-auto px-6 md:px-12">
      <h2 className="text-lg font-bold uppercase mb-12 text-[#A9A9A9] font-sans tracking-widest">Our Expertise</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-[#272727] rounded p-8 md:p-10 flex flex-col h-full hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#FF5555]/30">
            <h3 className="text-2xl md:text-[1.75rem] font-serif text-[#FFFFFF] leading-tight mb-4">
              {service.title}
            </h3>
            <p className="text-sm md:text-base font-sans leading-relaxed text-[#A9A9A9] mb-16 flex-grow">
              {service.body}
            </p>

            <div className="mt-auto">
              <div className="h-[1px] w-full bg-[#FFFFFF]/10 mb-4"></div>

              <div className="flex justify-between text-xs font-sans text-[#A9A9A9] mb-8 uppercase tracking-wider">
                <div className="flex flex-col space-y-2">
                  <span className="font-semibold text-[10px] text-[#FFFFFF]">Date</span>
                  <span>{service.date}</span>
                </div>
                <div className="flex flex-col space-y-2 text-right">
                  <span className="font-semibold text-[10px] text-[#FFFFFF]">Category</span>
                  <span>{service.category}</span>
                </div>
              </div>

              <a href="#contact" className="bg-[#FF5555] text-white px-5 py-2.5 rounded text-sm font-sans font-bold flex items-center justify-between hover:bg-white hover:text-[#141414] transition-colors duration-300 w-fit gap-3 cursor-pointer">
                <span>{service.buttonText}</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default ServicesGrid;
