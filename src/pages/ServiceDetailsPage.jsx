import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BorderGlow from '../components/BorderGlow';
import AnimatedButton from '../components/AnimatedButton';
import ContactSection from '../components/ContactSection';

const servicesData = {
  "web": {
    title: "Web & App Development",
    subtitle: "Custom architectures built for scale and performance.",
    description: "From high-converting landing pages to complex, full-stack platforms, we deliver robust, performant web and mobile applications tailored to your business goals. We focus on modern tech stacks, seamless UX, and high-quality user experiences to create solutions that scale effortlessly with your growing user base.",
    featuresTitle: "Core Capabilities",
    features: [
      { name: "Landing Pages", desc: "High-conversion single page architectures designed to turn visitors into leads." },
      { name: "E-Commerce", desc: "Robust online stores with secure checkout, inventory management, and fast load times." },
      { name: "Corporate Websites", desc: "Professional, scalable digital presences crafted to reflect enterprise authority." },
      { name: "Personal Portfolios", desc: "Sleek, unique digital resumes and portfolios that stand out from the crowd." }
    ],
    microServices: [
      { name: "Domain & Hosting", desc: "Fast, secure servers and custom domain registration." },
      { name: "Maintenance & Support", desc: "24/7 uptime monitoring and regular code updates." },
      { name: "Copywriting", desc: "Ongoing blog posts, SEO content, and targeted ad copy." }
    ],
    info: "Every project goes through rigorous planning, elegant design, agile execution, and strict quality assurance phases."
  },
  "branding": {
    title: "Video Editing & Branding",
    subtitle: "Crafting memorable identities & visual stories.",
    description: "A brand is more than a logo—it's how you communicate. We create comprehensive visual identities, cinematic video edits, and compelling narratives that resonate with your audience and make your brand unforgettable.",
    featuresTitle: "Core Capabilities",
    features: [
      { name: "Custom Video Editing", desc: "Cinematic cuts, motion graphics, and color grading for high-retention content." },
      { name: "Logo Design", desc: "Memorable, scalable marks that instantly communicate your core values." },
      { name: "Copywriting", desc: "Persuasive brand messaging, taglines, and tone-of-voice development." },
      { name: "Brand Guidelines", desc: "Complete visual rulebooks ensuring consistency across all touchpoints." }
    ],
    microServices: [
      { name: "Social Media Kits", desc: "High-quality templates and assets tailored for all digital platforms." },
      { name: "Business Collateral", desc: "Premium business cards, letterheads, and professional email signatures." },
      { name: "Messaging Guide", desc: "A definitive guide establishing and standardizing your exact brand voice." }
    ],
    info: "Through a collaborative process, we explore your brand's core values, target audience, and market positioning."
  },
  "ai": {
    title: "Agentic AI Solutions",
    subtitle: "Autonomous systems that work for you.",
    description: "We implement intelligent, autonomous agents to automate complex workflows, decision-making, and customer interactions. By integrating cutting-edge LLMs and custom pipelines, we help you save time and dramatically increase operational efficiency.",
    featuresTitle: "Core Capabilities",
    features: [
      { name: "Custom AI Agents", desc: "Tailor-made bots that handle customer support, scheduling, and repetitive tasks." },
      { name: "Workflow Automation", desc: "Connecting your existing tools via intelligent pipelines to eliminate manual data entry." },
      { name: "Data Analysis", desc: "Automated insights generation from complex datasets using advanced machine learning." },
      { name: "Predictive Modeling", desc: "Forecasting trends and user behavior to keep your business one step ahead." }
    ],
    microServices: [
      { name: "Prompt Engineering", desc: "Optimizing your workflows with precision-crafted LLM agent prompts." },
      { name: "API Integrations", desc: "Securely connecting your custom AI systems into your existing SaaS tools." },
      { name: "Model Tuning", desc: "Periodic knowledge base updating and systematic logic maintenance." }
    ],
    info: "Our AI solutions are integrated seamlessly into your existing architecture to augment your team's capabilities."
  }
};

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (servicesData[id]) {
      setService(servicesData[id]);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!service) return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      <Navbar />

      {/* 
        MASTER CONTAINER 
        Guarantees 100% perfect horizontal alignment across all layout breakpoints.
      */}
      <div className="w-full px-6 md:px-12 max-w-[1248px] mx-auto">

        {/* === HERO SECTION === */}
        <div className="pt-32 md:pt-40 pb-12 md:pb-16 w-full flex flex-col justify-end">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold tracking-[0.14em] uppercase text-[#888] hover:text-[#FF5555] transition-colors mb-9 group cursor-pointer"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif text-[#FFFFFF] leading-[1.1] mb-5 md:mb-6 text-left max-w-3xl tracking-tight">
            {service.title}
          </h1>
          <p className="text-lg md:text-xl text-[#A9A9A9] font-sans font-light leading-relaxed text-left max-w-2xl">
            {service.subtitle}
          </p>
        </div>

        {/* === MAIN CONTENT (Overview & Capabilities) === */}
        <div className="py-12 md:py-16 border-t border-[#FFFFFF]/10 w-full grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Sticky Left Sidebar */}
          <div className="flex flex-col space-y-8 lg:sticky lg:top-32">
            <div>
              <h2 className="text-2xl md:text-[1.75rem] font-serif text-[#FFFFFF] mb-5">The Overview</h2>
              <div className="w-12 h-[0.1rem] bg-[#FF5555] mb-6"></div>
              <p className="text-[#A9A9A9] text-base lg:text-lg leading-relaxed">
                {service.description}
              </p>
              <p className="text-[#888888] text-sm mt-6 md:mt-8 leading-relaxed italic border-l-2 border-[#FFFFFF]/10 pl-4">
                {service.info}
              </p>
            </div>
            <div className="pt-4 md:pt-6">
              <AnimatedButton
                href="#contact"
                size="md"
                className="w-full justify-center lg:w-fit"
                onClick={(e) => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    e.preventDefault();
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Book An Intro Call
              </AnimatedButton>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className="flex flex-col">
            <div>
              <h2 className="text-2xl md:text-[1.75rem] font-serif text-[#FFFFFF] mb-5 text-left">
                {service.featuresTitle}
              </h2>
              <div className="w-12 h-[0.1rem] bg-[#FF5555] mb-6"></div>
            </div>
            <div className="flex flex-col space-y-8 md:space-y-10">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-start text-left group">
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-[#FF5555]/10 flex items-center justify-center mr-5 md:mr-6 mt-1 group-hover:bg-[#FF5555] transition-colors duration-300">
                    <span className="text-[#FF5555] group-hover:text-white text-lg md:text-xl transition-colors duration-300">✦</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg md:text-xl font-serif text-[#FFFFFF] mb-2">{feature.name}</h4>
                    <p className="text-[#A9A9A9] text-sm md:text-base leading-relaxed max-w-2xl">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === MICRO SERVICES / ADD-ONS === */}
        <div className="py-12 md:py-16 border-t border-[#FFFFFF]/10 w-full mb-12 md:mb-16">
          <div className="text-left md:text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-[1.75rem] font-serif text-[#FFFFFF] mb-3 md:mb-4">Complete Your Package</h2>
            <p className="text-[#A9A9A9] max-w-2xl md:mx-auto text-base md:text-lg leading-relaxed">
              Enhance your main service with these essential micro-service add-ons, designed to keep your digital presence seamless, secure, and permanently optimized.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {service.microServices.map((addon, idx) => (
              <div
                key={idx}
                className="p-6 md:p-8 flex flex-col h-full border border-[#FFFFFF]/5 rounded-xl text-left md:text-center items-start md:items-center justify-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF5555]/10 flex items-center justify-center mb-5 md:mb-6">
                  <span className="text-[#FF5555] text-2xl md:text-3xl transition-colors duration-300 leading-none pb-1">+</span>
                </div>
                <h4 className="text-base md:text-lg font-bold text-[#FFFFFF] uppercase tracking-wide mb-2 md:mb-3">{addon.name}</h4>
                <p className="text-[#888888] text-sm md:text-base leading-relaxed">{addon.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="relative z-10 w-full bg-[#141414]">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetailsPage;
