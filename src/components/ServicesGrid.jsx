import React from 'react';

const ServicesGrid = () => {
  const services = [
    {
      title: "Website & Landing Page",
      subtitle: "Built to convert, not just look good",
      body: "If your pages aren’t converting, they’re costing you money. We design and build high-performance websites that grab attention fast, guide users clearly, and turn clicks into actual revenue. No fluff, just results."
    },
    {
      title: "Agentic AI Solutions",
      subtitle: "Do more without hiring more",
      body: "Manual work slows you down and eats into margins. We build AI systems that handle real tasks automatically, consistently, and at scale. Less overhead, faster execution, and more room to grow."
    },
    {
      title: "Branding",
      subtitle: "Look premium, charge premium",
      body: "If your brand feels generic, you’ll always compete on price. We create sharp, high-impact identities that position you as the obvious choice so you can stand out, build trust fast, and charge what you’re worth."
    }
  ];

  return (
    <section id="services" className="relative z-10 w-full bg-[#141414] shadow-[-10px_-10px_30px_#141414] pt-16 md:pt-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-[2rem] md:text-[3rem] font-sans text-white font-medium mb-10 md:mb-12 tracking-tight">
          Our Expertise
        </h2>

        <div className="flex flex-col">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0 cursor-default"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/[0.08]" />

              <div className="md:col-span-5 lg:col-span-5">
                <h3 className="text-xl md:text-[1.35rem] font-sans font-normal text-white tracking-wide transition-colors duration-500">
                  {service.title}
                </h3>
              </div>
              <div className="md:col-span-7 lg:col-span-6 lg:col-start-6 flex flex-col gap-2">
                <h4 className="text-[1.05rem] md:text-[1.1rem] font-semibold font-sans text-white">
                  {service.subtitle}
                </h4>
                <p className="text-[0.95rem] md:text-[1rem] font-sans text-[#CDCDCD] leading-[1.85]">
                  {service.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;

