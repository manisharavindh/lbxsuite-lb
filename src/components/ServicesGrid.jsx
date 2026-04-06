import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Sparkles, PenTool, Film, ArrowRight } from 'lucide-react';
import BorderGlow from './BorderGlow';

const ServicesGrid = () => {
  const services = [
    {
      id: "web",
      title: "Web Development",
      body: "Custom architectures built for scale. From high-converting landing pages to personal portfolios.",
      category: "Development",
      icon: Globe
    },
    {
      id: "ai",
      title: "Agentic AI Solutions",
      body: "We implement intelligent, autonomous systems to automate complex workflows and decision-making.",
      category: "Artificial Intelligence",
      icon: Sparkles
    },
    {
      id: "branding",
      title: "Branding",
      body: "Crafting memorable identities through logo design, visual language, and brand strategy.",
      category: "Design",
      icon: PenTool
    },
    {
      id: "video",
      title: "Video Editing",
      body: "Cinematic narratives, dynamic motion graphics, and high-retention cuts that convert.",
      category: "Video Production",
      icon: Film
    }
  ];

  return (
    <section id="services" className="relative z-10 w-full bg-[#141414] shadow-[-10px_-10px_30px_#141414] pt-20 md:pt-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FFFFFF] leading-tight font-medium mb-6 md:mb-8">Our Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {services.map((service, index) => (
            <Link
              key={index}
              to={`/services/${service.id}`}
              className="block h-full no-underline"
              style={{ textDecoration: 'none' }}
              data-track={`Services — ${service.title} Card`}
            >
              <BorderGlow
                className="h-full transition-colors"
                backgroundColor="#141414"
                glowColor="358 100 67"
                colors={['#FF5555', '#FF8888', '#FF2222']}
                borderRadius={4}
              >
                <div className="relative p-6 xl:p-8 flex flex-col h-full w-full group overflow-hidden cursor-pointer">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#FF5555]/10 flex items-center justify-center mb-6 text-[#FF5555]">
                    <service.icon size={20} strokeWidth={2} />
                  </div>

                  <h3 className="relative z-10 text-xl xl:text-2xl font-serif text-[#FFFFFF] leading-tight mb-4">
                    {service.title}
                  </h3>
                  <p className="relative z-10 text-sm font-sans leading-relaxed text-[#A9A9A9] mb-12 flex-grow">
                    {service.body}
                  </p>

                  <div className="relative z-10 mt-auto pt-6 border-t border-[#FFFFFF]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-sans font-semibold text-[#FF5555] tracking-wide">
                        Explore more
                      </span>
                      <span className="w-8 h-8 rounded-full border border-[#FF5555]/40 flex items-center justify-center text-[#FF5555] transition-colors duration-300 group-hover:bg-[#FF5555] group-hover:text-white group-hover:border-[#FF5555]">
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServicesGrid;

