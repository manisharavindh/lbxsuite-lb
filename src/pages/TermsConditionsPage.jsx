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
            <p>
              By accessing or using the services provided by LbxSuite, you agree to be bound
              by these Terms of Service. If you do not agree to all the terms and conditions,
              then you may not access the website or use any services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. What We Do</h2>
            <p>
              LbxSuite is a digital and consulting agency focused on building high-impact
              brand identities, digital experiences, and technology solutions. Our work
              is designed to go beyond visuals, we create systems that drive conversions,
              streamline operations, and elevate how your brand is perceived in the market.
            </p>
            <p className="mt-3">
              We may update, modify, or discontinue any part of our services at any time,
              based on evolving business or technical requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Responsible Use</h2>
            <p>You agree to use our website and services responsibly. This includes not:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Using the platform for unlawful, harmful, or abusive activities</li>
              <li>Attempting to interfere with or disrupt our systems or infrastructure</li>
              <li>Violating any applicable local, national, or international laws</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or restrict access if misuse is identified.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Ownership & Intellectual Property</h2>
            <p>
              All content, designs, systems, and materials created by LbxSuite remain our
              intellectual property unless otherwise agreed upon in writing.
            </p>
            <p className="mt-3">
              You may not copy, reproduce, distribute, or reuse any part of our work,
              branding, or systems without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p>
              While we aim to deliver high-quality and impactful solutions, LbxSuite is
              not liable for any indirect or consequential damages, including loss of
              revenue, data, or business opportunities arising from the use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Updates to These Terms</h2>
            <p>
              We may revise these Terms of Service from time to time. Continued use of
              our website or services after changes are made constitutes your acceptance
              of the updated terms.
            </p>
          </section>

          <p className="text-sm mt-12 pt-8 border-t border-[#272727]">
            Last updated: April 2026
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditionsPage;