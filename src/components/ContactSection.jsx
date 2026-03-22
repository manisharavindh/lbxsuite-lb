import React, { useEffect } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";

const ContactSection = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "ps" });
      cal("ui", {
        "hideEventTypeDetails": false,
        "layout": "month_view",
        "theme": "dark",
        "styles": {
          "branding": {
            "brandColor": "#FF5555"
          }
        }
      });
    })();
  }, []);

  return (
    <section id="contact" className="relative z-10 py-24 md:py-32 w-full mx-auto px-6 md:px-12 mt-12 bg-[#141414] border-t border-white/5">
      <div className="flex flex-col items-center max-w-[900px] w-full mx-auto">

        {/* Header Section */}
        <div className="text-center mb-6 flex flex-col items-center">
          <h2 className="text-3xl md:text-[2.5rem] lg:text-[2.75rem] leading-[1.15] font-serif text-[#FFFFFF] mb-4">
            Let's connect and discuss your vision.
          </h2>
          <p className="text-[#A9A9A9] font-sans md:text-lg max-w-2xl text-center">
            We funnel ambitious ideas into high-performance software. Book a time that works for you or reach out through our other channels.
          </p>
        </div>

        {/* Cal Embed - Given rigid height to completely block dropdown glitch */}
        <div className="w-full">
          <Cal
            namespace="ps"
            calLink="lbxsuite/ps"
            style={{ width: "100%", height: "auto", border: "none", overflow: "hidden" }}
            config={{ "layout": "month_view", "useSlotsViewOnSmallScreen": "true", "theme": "dark" }}
          />
        </div>

        {/* Contact Info aligned with the Cal widget */}
        {/* <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-[#A9A9A9] font-sans pt-12 border-t border-white/5">
          <div className="flex flex-col items-center bg-white/5 rounded-xl p-8 hover:bg-white/10 transition-colors duration-300">
            <h3 className="text-[#FFFFFF] text-sm uppercase tracking-widest font-bold mb-4">Email</h3>
            <a href="mailto:hello@lbxsuite.com" className="hover:text-[#FF5555] transition-colors duration-300 text-lg font-medium">hello@lbxsuite.com</a>
          </div>
          <div className="flex flex-col items-center bg-white/5 rounded-xl p-8 hover:bg-white/10 transition-colors duration-300">
            <h3 className="text-[#FFFFFF] text-sm uppercase tracking-widest font-bold mb-4">Phone</h3>
            <a href="tel:+15551234567" className="hover:text-[#FF5555] transition-colors duration-300 text-lg font-medium">+1 (555) 123-4567</a>
          </div>
          <div className="flex flex-col items-center bg-white/5 rounded-xl p-8 hover:bg-white/10 transition-colors duration-300">
            <h3 className="text-[#FFFFFF] text-sm uppercase tracking-widest font-bold mb-4">Address</h3>
            <p className="text-lg font-medium">123 Innovation Drive<br />Tech City, TX 78701</p>
          </div>
        </div> */}

      </div>
    </section>
  );
};

export default ContactSection;
