import React from 'react';
import AnimatedButton from './AnimatedButton';
import BorderGlow from './BorderGlow';

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
    <section id="services" className="relative z-10 w-full bg-[#141414] py-16 shadow-[-10px_-10px_30px_#141414]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-lg font-bold uppercase mb-12 text-[#A9A9A9] font-sans tracking-widest">Our Expertise</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <BorderGlow
            key={index}
            className="h-full transition-colors"
            backgroundColor="#272727"
            glowColor="358 100 67"
            colors={['#FF5555', '#FF8888', '#FF2222']}
            borderRadius={4}
          >
            <div className="p-8 md:p-10 flex flex-col h-full w-full">
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

                <AnimatedButton href="#contact" size="sm" className="relative z-10 w-fit">
                  {service.buttonText}
                </AnimatedButton>
              </div>
            </div>
          </BorderGlow>
        ))}
      </div>
      </div>
    </section>
  );
};
export default ServicesGrid;
