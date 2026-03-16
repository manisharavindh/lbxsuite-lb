import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Twitter, Linkedin, Github } from 'lucide-react';
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
        className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#F0EEE6]`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center h-20">
          <div className="font-sans font-black tracking-tighter uppercase text-xl md:text-2xl text-[#141413]">
            LbxSuite
          </div>

          <div className="hidden md:flex items-center space-x-10 text-sm font-bold">
            <a href="#" className="hover:underline transition-colors">Services</a>
            <a href="#" className="hover:underline transition-colors">Work</a>
            <a href="#" className="hover:underline transition-colors">Company</a>
            <a href="#" className="hover:underline transition-colors">News</a>
            <a href="#" className="hover:underline transition-colors">Contact</a>

            <a href="#" className="bg-[#141413] text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-all duration-300">
              Start a Project
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#141413]">
              {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-[#F0EEE6] z-40 px-6 py-8 md:hidden">
          <div className="flex flex-col space-y-6 text-2xl font-serif">
            <a href="#" className="hover:text-black/60 transition-colors">Services</a>
            <a href="#" className="hover:text-black/60 transition-colors">Work</a>
            <a href="#" className="hover:text-black/60 transition-colors">Company</a>
            <a href="#" className="hover:text-black/60 transition-colors">News</a>
            <a href="#" className="hover:text-black/60 transition-colors">Contact</a>

            <div className="pt-8">
              <a href="#" className="inline-block bg-[#141413] text-white px-8 py-4 rounded-full text-lg font-sans font-medium">
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
    <section className="pt-32 pb-16 md:pt-48 md:pb-12 max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-12 lg:gap-20 mb-16 md:mb-24">
        <div>
          <h1 className="text-[3.5rem] leading-[1.05] md:text-[5rem] lg:text-[6.5rem] font-serif text-[#141413] tracking-[-0.02em]">
            Digital <span style={{ textDecorationThickness: 'max(4px, 0.08em)', textUnderlineOffset: '0.15em', textDecorationSkipInk: 'none' }} className="underline decoration-[#141413]">engineering</span> and AI systems that push the frontier.
          </h1>
        </div>
        <div className="flex items-start lg:items-end lg:pb-6">
          <p className="text-xl md:text-[1.35rem] font-sans text-[#141413]/80 leading-relaxed font-light">
            As a premier tech service agency, LbxSuite is dedicated to crafting high-performance software, captivating media, and autonomous AI systems that secure your competitive advantage.
          </p>
        </div>
      </div>

      <div ref={targetRef} className="w-full flex justify-center">
        <motion.div
          style={{ width, borderRadius }}
          className="relative shrink-0 h-[50vh] min-h-[400px] md:h-[70vh] bg-[#141413] overflow-hidden group"
        >
          {/* Placeholder for stunning 3D visual. A subtle dark gradient for now */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#0A0A0A] opacity-90 transition-transform duration-1000 group-hover:scale-105">
            {/* Abstract geometric shapes to simulate a 3D visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#3A3A3A]/20 blur-3xl rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-96 md:h-96 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[32rem] md:h-[32rem] border border-white/5 rounded-full animate-[spin_90s_linear_infinite_reverse]"></div>
          </div>

          <div className="absolute top-8 md:top-12 inset-x-0 text-center px-4">
            <p className="text-white/60 text-xs md:text-sm font-sans tracking-[0.2em] uppercase mb-4">Feature</p>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif text-white/90 uppercase tracking-wide opacity-90 mix-blend-overlay">
              Scaling at the<br /><span className="italic font-light">speed of thought</span>
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
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
    <section className="py-24 border-t border-[#D1D0C9] max-w-[1400px] mx-auto px-6 md:px-12">
      <h2 className="text-sm font-sans font-bold tracking-[0.1em] uppercase mb-12 text-[#141413]">Our Expertise</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-[#EBE9E0] rounded-xl border border-[#D1D0C9] p-8 md:p-10 flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
            <h3 className="text-2xl md:text-[1.75rem] font-serif text-[#141413] leading-tight mb-4 group-hover:text-black/80 transition-colors">
              {service.title}
            </h3>
            <p className="text-sm md:text-base font-sans leading-relaxed text-[#141413]/80 mb-16 flex-grow">
              {service.body}
            </p>

            <div className="mt-auto">
              {/* Internal horizontal dividing lines just like Anthropic */}
              <div className="h-[1px] w-full bg-[#D1D0C9] mb-4"></div>

              <div className="flex justify-between text-xs font-sans text-[#141413]/60 mb-8 uppercase tracking-wider">
                <div className="flex flex-col space-y-2">
                  <span className="font-semibold text-[10px]">Date</span>
                  <span>{service.date}</span>
                </div>
                <div className="flex flex-col space-y-2 text-right">
                  <span className="font-semibold text-[10px]">Category</span>
                  <span>{service.category}</span>
                </div>
              </div>

              <button className="bg-[#141413] text-white px-5 py-2 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-black/80 hover:pl-6 transition-all duration-300">
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
    <section className="py-24 md:py-32 border-t border-[#D1D0C9] max-w-[1400px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 lg:gap-32">
        <div>
          <h2 className="text-3xl md:text-[2.5rem] lg:text-[2.75rem] leading-[1.15] font-serif text-[#141413]">
            At LbxSuite, we build technology to serve your brand's long-term growth and digital well-being.
          </h2>
        </div>

        <div className="flex flex-col mt-2 lg:mt-0">
          {links.map((link, index) => (
            <a
              key={index}
              href="#"
              className={`py-6 lg:py-8 flex justify-between items-center group ${index === 0 ? 'border-y' : 'border-b'} border-[#D1D0C9] transition-all duration-300`}
            >
              <span className="text-base lg:text-lg font-sans font-medium text-[#141413] group-hover:translate-x-3 transition-transform duration-300">
                {link}
              </span>
              <ArrowRight size={20} className="text-[#141413] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#141413] text-[#A3A3A3] py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-8 mb-24 md:mb-32 pl-4">
          <div>
            <div className="text-4xl md:text-5xl font-sans font-bold tracking-tighter text-white mb-6">
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
              <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Github size={18} /></a>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F0EEE6] text-[#141413] font-sans selection:bg-[#141413] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <ServicesGrid />
        <MissionAndLinks />
      </main>
      <Footer />
    </div>
  );
}

export default App;
