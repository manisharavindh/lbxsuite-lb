import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const profileImg = "https://i.pinimg.com/236x/a0/4d/84/a04d849cf591c2f980548b982f461401.jpg"

const testimonialsRow1 = [
  {
    name: "Praneeth",
    avatar: profileImg,
    text: "The LbxSuite team took our vision and turned it into a beautifully crafted, highly functional website.",
    role: "Founder & CEO, Nexchain AI",
    rating: 4.5
  },
  {
    name: "Varshith Merugu",
    avatar: profileImg,
    text: "From design to launch, LbxSuite made the entire process seamless. Our website now truly reflects our brand's identity.",
    role: "Founder, WassupMediaCo",
    rating: 3.5
  },
  {
    name: "Suhair Rahman",
    avatar: profileImg,
    text: "LbxSuite transformed our website into a sleek, high-performance platform. Our clients love the new experience.",
    role: "Founder @ SpainAcademy",
    rating: 5
  },
  {
    name: "Alicia Pohl",
    avatar: profileImg,
    text: "The team helped us kickstart our agency in Germany with ease. Unmatched attention to detail.",
    role: "Founder, AECreatives",
    rating: 4.5
  }
];

const testimonialsRow2 = [
  {
    name: "Ruby Liza",
    avatar: profileImg,
    text: "Our e-commerce platform now runs smoother and faster than ever. LbxSuite's expertise made a real difference.",
    role: "Founder, RLSM",
    rating: 3.5
  },
  {
    name: "Khushi",
    avatar: profileImg,
    text: "LbxSuite revamped our e-commerce store, and sales have never been better. The site is now faster and more user-friendly.",
    role: "Founder, Khushiva",
    rating: 5
  },
  {
    name: "Satvik",
    avatar: profileImg,
    text: "Their work quality when it comes to building complex applications is top-tier. They know exactly what works in the industry.",
    role: "Founder, TechForge",
    rating: 4.5
  },
  {
    name: "David M.",
    avatar: profileImg,
    text: "Collaborating with LbxSuite was the best decision we made. Fast delivery, pristine code, and fantastic support.",
    role: "CTO, Innovate Labs",
    rating: 5
  }
];

const TestimonialCard = ({ name, avatar, text, role, rating = 5 }) => (
  <div className="w-[240px] sm:w-[280px] md:w-[360px] shrink-0 rounded bg-[#1A1A1A] border border-[#2A2A2A] p-3.5 sm:p-4 md:p-6 flex flex-col justify-between hover:border-[#FF5555]/40 hover:bg-[#1C1C1C] transition-all duration-300">
    <div className="flex items-center justify-between mb-2 md:mb-4">
      <div className="flex items-center gap-2 md:gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full object-cover border border-[#333]"
          loading="lazy"
        />
        <span className="text-white font-sans font-medium text-[10.5px] sm:text-xs md:text-sm">{name}</span>
      </div>
      <div className="flex items-center gap-[2px] md:gap-[3px]">
        {[...Array(5)].map((_, i) => {
          const val = i + 1;
          const fillPercentage = Math.max(0, Math.min(100, (rating - (val - 1)) * 100));

          return (
            <div key={i} className="relative w-[10px] h-[10px] md:w-[12px] md:h-[12px]">
              {/* Background Outline Star */}
              <Star
                className="absolute top-0 left-0 text-[#444] fill-transparent w-[10px] h-[10px] md:w-[12px] md:h-[12px]"
                strokeWidth={1.5}
              />

              {/* Foreground Filled Star (Cropped) */}
              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden h-full"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    className="text-[#FF5555] fill-[#FF5555] max-w-none w-[10px] h-[10px] md:w-[12px] md:h-[12px]"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>

    <p className="text-[#A9A9A9] font-sans text-[10px] sm:text-[12px] md:text-[13px] leading-[1.5] sm:leading-[1.65] md:leading-relaxed mb-3 md:mb-5 flex-grow">
      {text}
    </p>

    <div className="text-right mt-auto pt-1">
      <span className="text-[#666] font-sans text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.15em] font-semibold">
        {role}
      </span>
    </div>
  </div>
);

const TestimonialSection = () => {
  return (
    <section className="relative w-full bg-[#141414] overflow-hidden z-10 pt-28 md:pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 mb-8 md:mb-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FFFFFF] leading-tight font-medium">
          Testimonials
        </h2>
      </div>

      <div className="relative w-full flex flex-col gap-3 md:gap-5">

        {/* Row 1 - Left to Right (Reverse) */}
        <div className="group flex w-max pr-3 md:pr-5">
          <div className="flex gap-3 md:gap-5 min-w-max pr-3 md:pr-5 animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {[...testimonialsRow1, ...testimonialsRow1].map((testimonial, idx) => (
              <TestimonialCard key={`row1-${idx}`} {...testimonial} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="group flex w-max pr-3 md:pr-5" style={{ '--marquee-duration': '55s' }}>
          <div className="flex gap-3 md:gap-5 min-w-max pr-3 md:pr-5 animate-marquee group-hover:[animation-play-state:paused]">
            {[...testimonialsRow2, ...testimonialsRow2].map((testimonial, idx) => (
              <TestimonialCard key={`row2-${idx}`} {...testimonial} />
            ))}
          </div>
        </div>

        {/* <div className="absolute inset-y-0 left-0 w-12 sm:w-20 md:w-64 bg-gradient-to-r from-[#141414] via-[#141414]/90 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-12 sm:w-20 md:w-64 bg-gradient-to-l from-[#141414] via-[#141414]/90 to-transparent pointer-events-none z-10"></div> */}

      </div>
    </section>
  );
};

export default TestimonialSection;
