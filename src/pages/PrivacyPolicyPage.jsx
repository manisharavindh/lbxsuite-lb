import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-8">Privacy Policy</h1>

        <div className="space-y-8 text-[#A9A9A9] leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p>
              When you interact with LbxSuite, we may collect the information you choose to share with us,
              such as your name, email, phone number, or any details submitted through forms, inquiries,
              or project discussions.
            </p>
            <p className="mt-3">
              We may also collect basic technical data like browser type, device information, and usage
              patterns to help us understand how our platform is being used and how we can improve it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p>Your information is used to operate and improve our services, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Delivering and managing our digital and consulting services</li>
              <li>Communicating with you regarding projects, updates, or inquiries</li>
              <li>Improving our systems, workflows, and user experience</li>
              <li>Sharing relevant updates, insights, or offers (only when appropriate)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Sharing of Information</h2>
            <p>
              We do not sell or trade your personal information.
            </p>
            <p className="mt-3">
              We may share limited information with trusted partners or service providers who help us
              operate our business, such as hosting, analytics, or communication tools, only when
              necessary and under appropriate confidentiality.
            </p>
            <p className="mt-3">
              We may also disclose information if required by law or if it is necessary to protect our
              rights, operations, or users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p>
              We take reasonable steps to protect your information from unauthorized access, misuse,
              or loss. While no system is completely secure, we actively maintain safeguards to keep
              your data protected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Control</h2>
            <p>
              You can request access, updates, or deletion of your personal information at any time.
              If you no longer wish to receive communications from us, you can opt out whenever you choose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy or how your data is handled,
              you can reach us at lbxsuiteagency@gmail.com.
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

export default PrivacyPolicyPage;