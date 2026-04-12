import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const profileImg = "https://i.pinimg.com/236x/a0/4d/84/a04d849cf591c2f980548b982f461401.jpg"

const testimonialsRow1 = [
  {
    name: "Karthik Shanmugam",
    avatar: profileImg,
    text: "Was skeptical after two bad agency experiences. But they actually listened, understood our audience, and our enquiries jumped 40% in month one.",
    role: "Startup Founder, Chennai",
    rating: 5
  },
  {
    name: "Deepika Ramanathan",
    avatar: profileImg,
    text: "I'm not a tech person at all, but they were so patient. The final site looks so premium, my friends thought I spent lakhs on it.",
    role: "Boutique Owner, Coimbatore",
    rating: 4.5
  },
  {
    name: "Arun Prakash M.",
    avatar: profileImg,
    text: "500+ products and the site still loads fast on 4G. That matters for our tier-2 city customers. Genuinely recommend if you care about performance.",
    role: "E-Commerce Entrepreneur, Madurai",
    rating: 5
  },
  {
    name: "Priya Venkatesh",
    avatar: profileImg,
    text: "Didn't think a website would help my coaching institute much. Now parents call saying they found us on Google. Worth every rupee.",
    role: "Education Consultant, Trichy",
    rating: 4.5
  }
];

const testimonialsRow2 = [
  {
    name: "Senthil Kumar R.",
    avatar: profileImg,
    text: "Our old site looked like it was from 2010. After the redesign and SEO setup, we actually show up on Google now. Night and day difference.",
    role: "Business Owner, Salem",
    rating: 4.5
  },
  {
    name: "Kavitha Sundaram",
    avatar: profileImg,
    text: "Had a product launch deadline and they delivered two days EARLY. The landing page converted really well during launch week.",
    role: "D2C Brand Founder, Chennai",
    rating: 5
  },
  {
    name: "Murugan Selvam",
    avatar: profileImg,
    text: "Built our booking system from scratch. My staff learned it in one day — zero customer complaints since. That says it all.",
    role: "Resort Owner, Kodaikanal",
    rating: 5
  },
  {
    name: "Lakshmi Narayanan",
    avatar: profileImg,
    text: "They didn't just build and disappear. Three months later, had a small issue — fixed same day. Already referred two friends.",
    role: "Textile Exporter, Erode",
    rating: 4.5
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
