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
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setSubscribeError('');
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to subscribe');
      }
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error');
      setSubscribeError(err.message || 'Something went wrong.');
      setTimeout(() => setStatus('idle'), 3000);
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
              <div className="inline-flex items-center justify-center px-4 py-2 border border-[#FF5555]/30 bg-[#141414] text-[#FF5555] text-[11px] lg:text-xs uppercase tracking-[0.15em] font-sans font-medium rounded">
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
          <div className="max-w-[1400px] mx-auto border-y border-white/10 py-20 md:py-28 px-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif text-[#FFFFFF] font-medium mb-3">
                Stay Connected
              </h2>
              <p className="text-sm md:text-base font-sans leading-relaxed text-[#A9A9A9] max-w-[600px] mb-8">
                We have something even bigger cooking behind the scenes. Keep an eye on <a href="https://www.linkedin.com/company/lbxsuite" target="_blank" rel="noopener noreferrer" className="text-[#FF5555] hover:text-white underline transition-colors">LinkedIn</a>, or drop your email below so you never miss out on any updates.
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
                  disabled={status === 'loading'}
                  className="w-full sm:w-80 bg-white/5 border border-white/10 rounded px-5 py-3 text-sm font-sans text-white placeholder-[#A9A9A9] outline-none focus:border-[#FF5555]/50 transition-colors disabled:opacity-50"
                  data-track="Giveaways — Newsletter Email Input"
                  required
                />
                <AnimatedButton
                  type="submit"
                  disabled={status === 'loading'}
                  size="md"
                  className="w-full sm:w-auto whitespace-nowrap"
                  data-track="Giveaways — Newsletter Subscribe CTA"
                >
                  {status === 'loading'
                    ? 'Joining...'
                    : status === 'success'
                      ? 'Subscribed!'
                      : status === 'error'
                        ? subscribeError
                        : 'Subscribe'}
                </AnimatedButton>
              </form>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default GiveawaysPage;
