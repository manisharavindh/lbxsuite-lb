import React from 'react';
import { Globe, Sparkles, PenTool, Film } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import BorderGlow from './BorderGlow';

const ServicesGrid = () => {
  const services = [
    {
      id: "web",
      title: "Web & App Development",
      body: "Custom architectures built for scale. From high-converting landing pages to personal portfolios.",
      buttonText: "More Details",
      category: "Development",
      icon: Globe
    },
    {
      id: "ai",
      title: "Agentic AI Solutions",
      body: "We implement intelligent, autonomous systems to automate complex workflows and decision-making.",
      buttonText: "More Details",
      category: "Artificial Intelligence",
      icon: Sparkles
    },
    {
      id: "branding",
      title: "Branding",
      body: "Crafting memorable identities through logo design, visual language, and brand strategy.",
      buttonText: "More Details",
      category: "Design",
      icon: PenTool
    },
    {
      id: "video",
      title: "Video Editing",
      body: "Cinematic narratives, dynamic motion graphics, and high-retention cuts that convert.",
      buttonText: "More Details",
      category: "Video Production",
      icon: Film
    }
  ];

  return (
    <section id="services" className="relative z-10 w-full bg-[#141414] py-16 pt-24 shadow-[-10px_-10px_30px_#141414]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-lg font-bold uppercase mb-12 text-[#A9A9A9] font-sans tracking-widest">Our Expertise</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <BorderGlow
              key={index}
              className="h-full transition-colors"
              backgroundColor="#141414"
              glowColor="358 100 67"
              colors={['#FF5555', '#FF8888', '#FF2222']}
              borderRadius={4}
            >
              <div className="relative p-6 xl:p-8 flex flex-col h-full w-full group overflow-hidden">
                <div className="relative z-10 w-12 h-12 rounded-full bg-[#FF5555]/10 flex items-center justify-center mb-6 text-[#FF5555]">
                  <service.icon size={20} strokeWidth={2} />
                </div>

                <h3 className="relative z-10 text-xl xl:text-2xl font-serif text-[#FFFFFF] leading-tight mb-4">
                  {service.title}
                </h3>
                <p className="relative z-10 text-sm font-sans leading-relaxed text-[#A9A9A9] mb-12 flex-grow">
                  {service.body}
                </p>

                <div className="relative z-10 mt-auto">
                  <div className="h-[1px] w-full bg-[#FFFFFF]/10 mb-5"></div>

                  <div className="flex justify-between items-center text-xs font-sans text-[#A9A9A9] mb-8 uppercase tracking-wider">
                    <span className="font-semibold text-[10px] text-[#FFFFFF]">Category:</span>
                    <span>{service.category}</span>
                  </div>

                  <AnimatedButton to={`/services/${service.id}`} size="sm" className="relative z-10 w-fit">
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
