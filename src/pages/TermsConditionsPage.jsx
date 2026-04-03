import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsConditionsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-[#A9A9A9] leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using the services provided by LbxSuite, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the website or use any services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>LbxSuite provides an AI-powered creative agency platform offering digital experience solutions. We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Upload, post, transmit or otherwise make available any Content that is unlawful, harmful, threatening, abusive, harassing, or otherwise objectionable.</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
              <li>Violate any applicable local, state, national or international law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property Rights</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of LbxSuite and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of LbxSuite.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p>In no event shall LbxSuite, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </section>
          
          <p className="text-sm mt-12 pt-8 border-t border-[#272727]">Last updated: April 2, 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditionsPage;
