import React from 'react';
import InteractiveGrid from '../InteractiveGrid';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WebworksSection from '../components/WebworksSection';
import FeaturesSection from '../components/FeaturesSection';
import ServicesGrid from '../components/ServicesGrid';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      <InteractiveGrid />
      <Navbar />
      <main className="relative z-10 w-full flex flex-col items-center">
        <Hero />
        <div className="w-full flex-grow relative bg-[#141414]">
          <FeaturesSection />
          <WebworksSection />
          {/* <DomeGallery /> */}
          <ServicesGrid />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
