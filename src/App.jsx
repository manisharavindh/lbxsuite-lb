import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Twitter, Linkedin, Github, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#141414] py-3 shadow-md' : 'bg-transparent py-8'}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center text-sm font-sans font-medium relative">

          {/* Left: Logo */}
          <div className={`font-sans tracking-tight uppercase text-xl md:text-2xl font-black ${isScrolled ? 'text-[#FFFFFF]' : 'text-[#FFFFFF]'}`}>
            LBXSUITE
          </div>

          {/* Right: Links & Button */}
          <div className={`hidden md:flex items-center space-x-6 lg:space-x-8 font-bold ${isScrolled ? 'text-[#FFFFFF]' : 'text-[#FFFFFF]'}`}>
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">Services</a>
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">Work</a>
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">Company</a>
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">News</a>
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">Contact</a>
            <a href="#" className="bg-[#F0EEE6] text-[#141414] px-4 py-2 rounded-lg font-bold hover:bg-[#D1D0C9] transition-all duration-300 ml-2">
              Start a Project
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={isScrolled ? 'text-[#FFFFFF]' : 'text-white'}>
              {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-0 bg-[#141414] z-40 px-6 pt-24 pb-8 md:hidden flex flex-col h-screen">
          <div className="absolute top-6 right-6">
            <button onClick={() => setMobileMenuOpen(false)} className="text-[#FFFFFF]">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex flex-col space-y-8 text-4xl font-serif text-[#FFFFFF] mt-12">
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">About</a>
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">Services</a>
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">Cases</a>
            <a href="#" className="hover:text-[#F0EEE6] transition-colors">Contact</a>
            <div className="pt-8">
              <a href="#" className="inline-flex bg-[#F0EEE6] text-[#141414] px-8 py-4 rounded-full text-xl font-sans font-bold hover:bg-[#D1D0C9] transition-all duration-300 w-max">
                Start a Project
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const Hero = () => {
  return (
    <section className="relative w-full h-[100svh] bg-[#141414] overflow-hidden flex flex-col pt-24 px-6 md:px-12 text-[#FFFFFF]">
      {/* Subtle background gradients/glows */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[#272727]/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#272727]/30 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex-grow flex flex-col justify-center relative z-10 w-full max-w-[1600px] mx-auto pb-12">

        {/* === Desktop Layout (md and above) === */}
        <div className="hidden md:flex w-full items-center relative h-full">
          {/* Left Studio Text */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 pb-12">
            <p className="text-[11px] lg:text-xs uppercase tracking-[0.15em] leading-[1.6] text-white/80 font-sans font-medium">
              Creative<br />studio
            </p>
          </div>

          {/* Right Top Arrow */}
          <div className="absolute right-0 top-[18%] lg:top-[20%] z-20">
            <div className="w-16 h-16 flex justify-center items-center">
              <ArrowUpRight size={56} className="text-white drop-shadow-lg lg:w-[64px] lg:h-[64px]" strokeWidth={2.5} />
            </div>
          </div>

          {/* Center Main Staggered Typography */}
          <div className="w-full flex justify-center relative">
            <div className="flex flex-col relative w-fit mr-[10%] lg:mr-[15%] mt-[-5%]">

              <div className="w-full flex justify-start pl-[5%] lg:pl-[10%]">
                <span className="font-sans font-medium uppercase text-[6.5vw] lg:text-[7.5vw] xl:text-[7.5rem] tracking-[-0.02em] leading-[0.95] text-[#FFFFFF]">We Are</span>
              </div>

              <div className="w-full flex justify-center ml-[5%] lg:ml-[15%] xl:ml-[18%] mt-[-1%]">
                <span className="font-sans font-medium uppercase text-[8vw] lg:text-[9vw] xl:text-[9.5rem] tracking-[-0.02em] leading-[0.95] whitespace-nowrap text-[#FFFFFF]">Full&ndash;Service</span>
              </div>

              <div className="w-full flex items-center justify-end mr-[-20%] lg:mr-[-40%] mt-[-1%] relative">
                <span className="font-sans font-medium text-[9.5vw] lg:text-[10.5vw] xl:text-[11.5rem] font-light uppercase tracking-wider leading-[0.8] relative z-10 shrink-0 text-[#FFFFFF] pt-2">Agency</span>
                <div className="w-[180px] lg:w-[260px] shrink-0 ml-4 lg:ml-8 mt-4 lg:mt-8">
                  <p className="text-[11px] lg:text-[14px] font-sans text-[#F0EEE6]/80 leading-relaxed font-medium">
                    The first full-stack Web3 creative agency integrating AI technology to deliver best-in-class client experience.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* === Mobile Layout (below md) === */}
        <div className="md:hidden flex flex-col items-center justify-center w-full relative z-10 flex-grow -mt-[8vh]">
          <div className="flex flex-col items-center text-center w-full px-2">
            <span className="font-sans font-medium uppercase text-[16vw] sm:text-[15vw] leading-[1] tracking-tight">We Are</span>
            <span className="font-sans font-medium uppercase text-[12.8vw] sm:text-[12vw] leading-[1.05] tracking-tight whitespace-nowrap">Full&ndash;Service</span>
            <span className="font-serif italic text-[18vw] sm:text-[16.5vw] font-light uppercase tracking-wider relative z-10 leading-[0.95] mt-1">Agency</span>
          </div>

          <div className="w-full max-w-[300px] text-center mt-10">
            <p className="text-[13px] sm:text-[14px] font-sans text-[#F0EEE6]/80 leading-[1.6] font-medium opacity-90">
              The first full-stack Web3 creative agency integrating AI technology to deliver best-in-class client experience.
            </p>
          </div>
        </div>
      </div>

      {/* Circle Spinner & Bottom Arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center w-[85px] h-[85px] md:w-[95px] md:h-[95px] lg:w-[105px] lg:h-[105px] z-10 cursor-pointer group">

        {/* Static borders */}
        <svg viewBox="0 0 100 100" className="absolute w-full h-full pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-300">
          <circle cx="50" cy="50" r="60" stroke="#FFFFFF" strokeWidth="1" fill="none" />
          <circle cx="50" cy="50" r="29.5" stroke="#FFFFFF" strokeWidth="1" fill="none" />
        </svg>

        {/* Rotating text */}
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <path id="circlePath" d="M 50, 50 m -40.5, 0 a 40.5,40.5 0 1,1 81,0 a 40.5,40.5 0 1,1 -81,0" fill="transparent" />
          <text fontSize="8.5" fill="#F0EEE6" className="font-sans font-medium uppercase">
            <textPath href="#circlePath" startOffset="0%" textLength="102" lengthAdjust="spacing">
              SCROLL TO EXPLORE
            </textPath>
            <textPath href="#circlePath" startOffset="50%" textLength="102" lengthAdjust="spacing">
              SCROLL TO EXPLORE
            </textPath>
          </text>
        </svg>

        {/* Center arrow */}
        <div className="absolute flex justify-center items-center w-full h-full pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          <svg width="26%" height="26%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#F0EEE6]"><line x1="12" y1="4" x2="12" y2="20"></line><polyline points="18 14 12 20 6 14"></polyline></svg>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 85%", "start 25%"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const width = useTransform(smoothProgress, (pos) => `calc(100% + (100vw - 100%) * ${pos})`);
  const borderRadius = useTransform(smoothProgress, [0, 1], ["16px", "0px"]);

  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-12 max-w-[1400px] mx-auto px-6 md:px-12 bg-[#141414]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-12 lg:gap-20 mb-16 md:mb-24">
        <div>
          <h1 className="text-[3.5rem] leading-[1.05] md:text-[5rem] lg:text-[6.5rem] font-serif text-[#FFFFFF] tracking-[-0.02em]">
            Digital <span style={{ textDecorationThickness: 'max(4px, 0.08em)', textUnderlineOffset: '0.15em', textDecorationSkipInk: 'none' }} className="underline decoration-[#F0EEE6]">engineering</span> and AI systems that push the frontier.
          </h1>
        </div>
        <div className="flex items-start lg:items-end lg:pb-6">
          <p className="text-xl md:text-[1.35rem] font-sans text-[#A9A9A9] leading-relaxed font-light">
            As a premier tech service agency, LbxSuite is dedicated to crafting high-performance software, captivating media, and autonomous AI systems that secure your competitive advantage.
          </p>
        </div>
      </div>

      <div ref={targetRef} className="w-full flex justify-center">
        <motion.div
          style={{ width, borderRadius }}
          className="relative shrink-0 bg-[#272727] overflow-hidden group py-24"
        >
          <div className="inset-x-0 text-center px-4">
            <p className="text-[#A9A9A9] text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-4">Feature</p>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif text-[#FFFFFF] uppercase tracking-wide">
              Scaling at the<br /><span className="italic font-light text-[#F0EEE6]">speed of thought</span>
            </h2>
          </div>
        </motion.div>
      </div >
    </section >
  );
};

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
    <section className="py-6 max-w-[1400px] mx-auto px-6 md:px-12 bg-[#141414]">
      <h2 className="text-lg font-bold uppercase mb-12 text-[#A9A9A9]">Our Expertise</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-gradient-to-br from-[#272727] to-[#1a1a1a] rounded-xl p-8 md:p-10 flex flex-col h-full border border-white/5 group hover:border-[#F0EEE6]/30 transition-all duration-300">
            <h3 className="text-2xl md:text-[1.75rem] font-serif text-[#FFFFFF] leading-tight mb-4 group-hover:text-[#F0EEE6] transition-colors">
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

              <button className="bg-[#F0EEE6] text-[#141414] px-5 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-[#D1D0C9] transition-all duration-300 cursor-pointer">
                <span>{service.buttonText}</span>
                <ArrowRight size={14} className="opacity-70 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const MissionAndLinks = () => {
  const links = [
    "Our Development Protocol",
    "AI Alignment & Ethics",
    "View Case Studies"
  ];

  return (
    <section className="py-24 md:py-32 border-t border-white/5 max-w-[1400px] mx-auto px-6 md:px-12 bg-[#141414]">
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 lg:gap-32">
        <div>
          <h2 className="text-3xl md:text-[2.5rem] lg:text-[2.75rem] leading-[1.15] font-serif text-[#FFFFFF]">
            At LbxSuite, we build technology to serve your brand's long-term growth and digital well-being.
          </h2>
        </div>

        <div className="flex flex-col mt-2 lg:mt-0">
          {links.map((link, index) => (
            <a
              key={index}
              href="#"
              className={`py-6 lg:py-8 flex justify-between items-center group ${index === 0 ? 'border-y' : 'border-b'} border-white/10 hover:border-[#F0EEE6]/50 transition-all duration-300`}
            >
              <span className="text-base lg:text-lg font-sans font-medium text-[#A9A9A9] group-hover:text-[#FFFFFF] group-hover:translate-x-3 transition-all duration-300">
                {link}
              </span>
              <ArrowRight size={20} className="text-[#F0EEE6] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0E0E0E] text-[#A9A9A9] py-20 md:py-32 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-8 mb-24 md:mb-32 pl-4">
          <div>
            <div className="text-4xl md:text-5xl font-sans font-bold tracking-tighter text-[#FFFFFF] mb-6">
              Lbx
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-xs md:text-sm font-sans">
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-medium mb-2">Products</h4>
              <a href="#" className="hover:text-white transition-colors">Digital Agents</a>
              <a href="#" className="hover:text-white transition-colors">Web Systems</a>
              <a href="#" className="hover:text-white transition-colors">Media Suite</a>
              <a href="#" className="hover:text-white transition-colors">Custom SaaS</a>
              <a href="#" className="hover:text-white transition-colors">API Services</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-medium mb-2">Solutions</h4>
              <a href="#" className="hover:text-white transition-colors">Enterprise</a>
              <a href="#" className="hover:text-white transition-colors">Startups</a>
              <a href="#" className="hover:text-white transition-colors">E-commerce</a>
              <a href="#" className="hover:text-white transition-colors">Finance</a>
              <a href="#" className="hover:text-white transition-colors">Healthcare</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-medium mb-2">Resources</h4>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Case Studies</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Community</a>
              <a href="#" className="hover:text-white transition-colors">Help Center</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-medium mb-2">Company</h4>
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Careers</a>
              <a href="#" className="hover:text-white transition-colors">News</a>
              <a href="#" className="hover:text-white transition-colors">Trust & Safety</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-end pt-8 border-t border-white/10 text-xs font-sans space-y-6 md:space-y-0 pl-4">
          <div className="flex items-center space-x-6">
            <span>© 2026 LbxSuite. All rights reserved.</span>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-6 text-[#A3A3A3]">
              <a href="#" className="hover:text-[#FFFFFF] transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-[#FFFFFF] transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-[#FFFFFF] transition-colors"><Github size={18} /></a>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#FFFFFF] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#141414] text-[#FFFFFF] font-sans selection:bg-[#F0EEE6] selection:text-[#141414]">
      <Navbar />
      <main>
        <Hero />
        <div className="bg-[#141414]">
          <AboutSection />
          <ServicesGrid />
          <MissionAndLinks />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
