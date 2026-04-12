import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BorderGlow from '../components/BorderGlow';
import { ArrowLeft } from 'lucide-react';
import AnimatedButton from '../components/AnimatedButton';

const WINNERS = [
  "Sri Hari",
  "Tamilselvan U C",
  "Balaji A",
  "Pradeesh mughil",
  "Dinakar ShanmugaSundaram",
  "Anjana R",
  "Lalith Kumar"
];

const GiveawaysPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to subscribe');
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF] relative overflow-x-hidden">
      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-center flex-grow">

        {/* Main Content Section */}
        <section className="relative w-full pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto w-full">

            {/* Back Button */}
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold tracking-[0.14em] uppercase text-[#888] hover:text-[#FF5555] transition-colors mb-9 group cursor-pointer border-none bg-transparent"
                data-track="Service Detail — Back Button"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Back
              </button>
            </div>

            {/* Header Content */}
            <div className="flex flex-col items-start w-full mb-12 md:mb-16">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#FFFFFF] font-medium mb-4">
                Giveaway #1
              </h1>
              <p className="text-sm md:text-base font-sans leading-relaxed text-[#A9A9A9] max-w-[700px] mb-6">
                The algorithm has spoken. Out of all the entries, the script calculated the probabilities and picked the top 7 profiles to receive a fully custom, free portfolio from LbxSuite.
              </p>
              <div className="inline-flex items-center justify-center px-4 py-2 border border-[#FF5555]/30 bg-[#141414] text-[#FF5555] text-[11px] lg:text-xs uppercase tracking-[0.15em] font-sans font-medium">
                This giveaway has ended
              </div>
            </div>

            {/* Winners Section */}
            <div className="w-full mb-6 relative">
              <h2 className="text-3xl md:text-4xl font-serif text-[#FFFFFF] font-medium">Winners</h2>
            </div>

            {/* Winners Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {WINNERS.map((winner, index) => (
                <BorderGlow
                  key={index}
                  className="h-full transition-colors w-full"
                  backgroundColor="#141414"
                  glowColor="358 100 67"
                  colors={['#FF5555', '#FF8888', '#FF2222']}
                  borderRadius={4}
                >
                  <div className="relative p-6 xl:p-8 flex flex-col h-full w-full group overflow-hidden">
                    <div className="relative z-10 w-12 h-12 rounded-full border border-[#FF5555]/30 bg-[#FF5555]/10 flex items-center justify-center mb-6 text-[#FF5555] font-sans font-medium text-lg">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="relative z-10 text-xl xl:text-2xl font-serif text-[#FFFFFF] leading-tight mb-2 pr-4">
                      {winner}
                    </h3>
                    <p className="relative z-10 text-sm font-sans leading-relaxed text-[#FF5555] opacity-80 mt-auto">
                      Free Custom Portfolio
                    </p>
                  </div>
                </BorderGlow>
              ))}
            </div>

            {/* Footer Messaging */}
            {/* <div className="md:items-center">
              <h2 className="text-3xl md:text-4xl font-serif text-[#FFFFFF] font-medium mb-4">
                Stay Tuned
              </h2>
              <p className="text-sm md:text-base font-sans leading-relaxed text-[#A9A9A9] max-w-[600px]">
                This was just the first wave. We have something even bigger cooking behind the scenes. Keep an eye on <a href="https://www.linkedin.com/company/lbxsuite" target="_blank" rel="noopener noreferrer" className="text-[#FF5555] hover:text-white underline transition-colors">LinkedIn</a> for future updates.
              </p>
            </div> */}

          </div>
        </section>

        {/* ============ NEWSLETTER CTA ============ */}
        <section className="w-full bg-[#141414] px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto border-y border-white/10 py-20 md:py-28 px-4 md:px-12 lg:px-0">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif text-[#FFFFFF] font-medium mb-3">
                Stay Tuned
              </h2>
              <p className="text-sm md:text-base font-sans leading-relaxed text-[#A9A9A9] max-w-[600px] mb-8">
                We have something even bigger cooking behind the scenes. Keep an eye on <a href="https://www.linkedin.com/company/lbxsuite" target="_blank" rel="noopener noreferrer" className="text-[#FF5555] hover:text-white underline transition-colors">LinkedIn</a>, or drop your email below so you never miss our next massive drop.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center gap-3 w-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full sm:w-80 bg-white/5 border border-white/10 rounded px-5 py-3 text-sm font-sans text-white placeholder-[#A9A9A9] outline-none focus:border-[#FF5555]/50 transition-colors disabled:opacity-50"
                  data-track="Giveaways — Newsletter Email Input"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`w-full sm:w-auto whitespace-nowrap bg-[#FF5555] text-white font-sans font-medium text-sm px-6 py-3 rounded hover:bg-white hover:text-[#141414] transition-all duration-300 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''} ${status === 'success' ? 'bg-[#27c93f] hover:bg-[#27c93f] hover:text-white cursor-default' : ''}`}
                  data-track="Giveaways — Newsletter Subscribe CTA"
                >
                  {status === 'loading' ? 'Joining...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
                </button>
              </form>

              {status === 'success' && (
                <p className="text-[#27c93f] text-xs font-sans mt-3">You've successfully joined the list!</p>
              )}
              {status === 'error' && (
                <p className="text-[#FF5555] text-xs font-sans mt-3">Failed to join. Please try again later.</p>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default GiveawaysPage;
