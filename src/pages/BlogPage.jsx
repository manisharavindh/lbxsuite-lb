import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Clock, ArrowRight, X } from 'lucide-react';
import blogPosts, { categories } from '../data/blogPosts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BorderGlow from '../components/BorderGlow';
import AnimatedButton from '../components/AnimatedButton';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const isGridInView = useInView(gridRef, { once: true, margin: "-80px" });

  const featuredPost = blogPosts.find(p => p.featured);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-center">
        {/* ============ HERO — Featured Post ============ */}
        <section ref={heroRef} className="relative w-full pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-24 items-center">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 md:mb-0"
            >
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] uppercase text-[#FF5555] mb-4 block">
                Insights & Ideas
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-serif text-[#FFFFFF] tracking-[-0.02em] leading-[1.05]">
                LbxSuite <br className="hidden md:block" />
                <span className="italic font-light text-[#A9A9A9]">Blog</span>
              </h1>
            </motion.div>

            {/* Featured Post Card - Right Side */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="w-full lg:max-w-[500px] ml-auto"
              >
                <BorderGlow
                  className="h-full transition-colors w-full"
                  backgroundColor="#141414"
                  glowColor="358 100 67"
                  colors={['#FF5555', '#FF8888', '#FF2222']}
                  borderRadius={12}
                >
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="group block h-full flex flex-col p-8 bg-[#141414] rounded-xl overflow-hidden relative"
                  >
                    <div className="relative z-10 flex flex-col h-full bg-transparent">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <span className="bg-[#141414] text-[#FFFFFF] text-[9px] font-sans font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border border-white/10 group-hover:border-[#FF5555]/50 group-hover:text-[#FF5555] transition-colors">
                          Featured
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-sans text-[#A9A9A9]">{featuredPost.date}</span>
                          <span className="w-1 h-1 rounded-full bg-[#A9A9A9]/50" />
                          <span className="text-[10px] font-sans text-[#A9A9A9] flex items-center gap-1.5">
                            <Clock size={10} />
                            {featuredPost.readTime}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl md:text-2xl font-serif text-[#FFFFFF] leading-[1.3] mb-4 group-hover:text-white transition-colors duration-300 line-clamp-2">
                        {featuredPost.title}
                      </h3>

                      <p className="text-[13px] md:text-sm font-sans text-[#8a8a8a] leading-relaxed mb-8 line-clamp-3 flex-grow">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FF5555]/15 flex items-center justify-center text-[#FF5555] text-[9px] font-bold font-sans">
                            {featuredPost.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-[11px] font-sans font-medium text-[#FFFFFF]">{featuredPost.author}</span>
                        </div>

                        <div className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-[#FF5555] group-hover:border-[#FF5555] transition-all duration-300">
                          <ArrowUpRight size={16} className="text-[#A9A9A9] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </BorderGlow>
              </motion.div>
            )}
          </div>
        </section>

        {/* ============ FILTER BAR ============ */}
        <section className="w-full bg-[#141414] border-y border-white/5 sticky top-[72px] z-30 backdrop-blur-xl bg-[#141414]/90">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar py-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-sans font-bold tracking-wide uppercase transition-all duration-300 cursor-pointer ${activeCategory === cat
                    ? 'bg-[#FF5555] text-white'
                    : 'text-[#A9A9A9] hover:text-white hover:bg-white/5'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-sans text-white placeholder-[#A9A9A9] outline-none focus:border-[#FF5555]/50 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (searchOpen) setSearchQuery('');
                }}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#A9A9A9] hover:text-white hover:border-white/20 transition-all cursor-pointer"
              >
                {searchOpen ? <X size={14} /> : <Search size={14} />}
              </button>
            </div>
          </div>
        </section>

        {/* ============ POSTS GRID ============ */}
        <section ref={gridRef} className="w-full bg-[#141414] py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isGridInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full"
                  >
                    <Link
                      to={`/blog/${post.id}`}
                      className="group block h-full flex flex-col p-8 bg-[#141414] rounded-xl overflow-hidden border border-white/5 hover:border-[#FF5555]/30 hover:shadow-[0_0_30px_rgba(255,85,85,0.05)] transition-all duration-500 relative"
                    >
                      <div className="relative z-10 flex flex-col h-full bg-transparent">
                        <div className="flex items-center justify-between gap-4 mb-6">
                          <span className="bg-[#141414] text-[#FFFFFF] text-[9px] font-sans font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border border-white/10 group-hover:border-[#FF5555]/50 group-hover:text-[#FF5555] transition-colors">
                            {post.category}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-sans text-[#A9A9A9]">{post.date}</span>
                            <span className="w-1 h-1 rounded-full bg-[#A9A9A9]/50" />
                            <span className="text-[10px] font-sans text-[#A9A9A9] flex items-center gap-1.5">
                              <Clock size={10} />
                              {post.readTime}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-serif text-[#FFFFFF] leading-[1.3] mb-4 group-hover:text-white transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-[13px] md:text-sm font-sans text-[#8a8a8a] leading-relaxed mb-8 line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#FF5555]/15 flex items-center justify-center text-[#FF5555] text-[9px] font-bold font-sans">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-[11px] font-sans font-medium text-[#FFFFFF]">{post.author}</span>
                          </div>

                          <div className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-[#FF5555] group-hover:border-[#FF5555] transition-all duration-300">
                            <ArrowUpRight size={16} className="text-[#A9A9A9] group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-2xl font-serif text-[#FFFFFF] mb-3">No articles found</p>
                <p className="text-sm font-sans text-[#A9A9A9]">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="mt-6 text-[#FF5555] text-sm font-sans font-bold underline underline-offset-4 hover:text-white transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* ============ NEWSLETTER CTA ============ */}
        <section className="w-full bg-[#141414] pb-24 md:pb-32 px-6 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1e1e] to-[#1a1a1a] border border-white/5 p-10 md:p-16 text-center">
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#FF5555]/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#FF5555] mb-4 block">
                  Stay Updated
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-[#FFFFFF] mb-4 leading-[1.2]">
                  Get insights delivered <br className="hidden sm:block" />
                  <span className="italic font-light text-[#A9A9A9]">straight to your inbox</span>
                </h2>
                <p className="text-sm md:text-base font-sans text-[#A9A9A9] mb-8 max-w-md mx-auto leading-relaxed">
                  No spam, no fluff. Just our best thinking on AI, engineering, and digital product strategy — delivered biweekly.
                </p>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-lg px-5 py-3.5 text-sm font-sans text-white placeholder-[#A9A9A9] outline-none focus:border-[#FF5555]/50 transition-colors"
                  />
                  <AnimatedButton href={null} size="md" className="w-full sm:w-auto whitespace-nowrap">
                    Subscribe
                  </AnimatedButton>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Hide scrollbar for category filter */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default BlogPage;
