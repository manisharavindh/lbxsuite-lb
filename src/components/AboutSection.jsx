import React from 'react';

const AboutSection = () => {
  return (
    <section className="w-full bg-[#141414] relative z-10 flex flex-col justify-center pt-8">
      <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 relative flex">

        {/* Main Heading Block */}
        <div className="relative w-full">
          <h2 className="text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-sans font-normal leading-[1.2] tracking-tight text-[#d1d1d1]">
            <span className="text-white">We</span> design and build digital experiences that break through the noise, increase your perceived value, and turn your brand into one that people recognize, trust, and choose.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
