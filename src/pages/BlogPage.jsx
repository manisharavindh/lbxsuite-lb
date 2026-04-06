import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, Clock, ArrowRight, X } from 'lucide-react';
import { categories } from '../data/blogPosts';
import blogPostsFallback from '../data/blogPosts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BorderGlow from '../components/BorderGlow';
import AnimatedButton from '../components/AnimatedButton';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/posts/public/list')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        // Map data to expected format if needed
        const mappedData = data.map(post => ({
          id: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          coverImage: post.image_url,
          category: post.category || 'General',
          author: post.author,
          authorRole: post.author_role,
          date: new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          readTime: post.read_time,
          featured: post.featured,
          tags: post.tags || [],
        }));
        setBlogPosts(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch posts from DB, using fallback:", err);
        setBlogPosts(blogPostsFallback);
        setLoading(false);
      });
  }, []);

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
        {loading ? (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <span className="text-[#A9A9A9] animate-pulse">Loading posts...</span>
          </div>
        ) : (
          <>
            {/* ============ HERO — Featured Post ============ */}
        <section className="relative w-full pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-24 items-center">
            {/* Page Title */}
            <div className="mb-8 md:mb-0">
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] uppercase text-[#FF5555] mb-4 block">
                Insights & Ideas
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-serif text-[#FFFFFF] tracking-[-0.02em] leading-[1.05]">
                LbxSuite <br className="hidden md:block" />
                <span className="italic font-light text-[#A9A9A9]">Blog</span>
              </h1>
            </div>

            {/* Featured Post Card - Right Side */}
            {featuredPost && (
              <div className="w-full lg:max-w-[500px] ml-auto">
                <BorderGlow
                  className="h-full transition-colors w-full"
                  backgroundColor="#141414"
                  glowColor="358 100 67"
                  colors={['#FF5555', '#FF8888', '#FF2222']}
                  borderRadius={4}
                >
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="group block h-full"
                    data-track="Blog — Featured Post Card"
                  >
                    <div className="p-8 md:p-10 flex flex-col h-full w-full">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-[#FF5555]/10 text-[#FF5555] text-[9px] font-sans font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm border border-[#FF5555]/20">
                          Featured
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-[1.75rem] font-serif text-[#FFFFFF] leading-tight mb-4 group-hover:text-white transition-colors duration-300 line-clamp-2">
                        {featuredPost.title}
                      </h3>

                      <p className="text-sm md:text-base font-sans leading-relaxed text-[#A9A9A9] mb-16 flex-grow line-clamp-3">
                        {featuredPost.excerpt}
                      </p>

                      <div className="mt-auto">
                        <div className="h-[1px] w-full bg-[#FFFFFF]/10 mb-4"></div>

                        <div className="flex justify-between text-xs font-sans text-[#A9A9A9] mb-6 uppercase tracking-wider">
                          <div className="flex flex-col space-y-2">
                            <span className="font-semibold text-[10px] text-[#FFFFFF]">Date</span>
                            <span>{featuredPost.date}</span>
                          </div>
                          <div className="flex flex-col space-y-2 text-right">
                            <span className="font-semibold text-[10px] text-[#FFFFFF]">Read Time</span>
                            <span>{featuredPost.readTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#FF5555]/15 flex items-center justify-center text-[#FF5555] text-[9px] font-bold font-sans">
                              {featuredPost.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-[11px] font-sans font-medium text-[#FFFFFF]">{featuredPost.author}</span>
                          </div>

                          <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#FF5555] group-hover:border-[#FF5555] transition-all duration-300">
                            <ArrowUpRight size={16} className="text-[#A9A9A9] group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </BorderGlow>
              </div>
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
                  data-track={`Blog — Filter: ${cat}`}
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
                      data-track="Blog — Search Input"
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
                data-track="Blog — Search Toggle"
              >
                {searchOpen ? <X size={14} /> : <Search size={14} />}
              </button>
            </div>
          </div>
        </section>

        {/* ============ POSTS GRID ============ */}
        <section className="w-full bg-[#141414] py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="h-full">
                    <Link
                      to={`/blog/${post.id}`}
                      className="group block h-full rounded-[4px] border border-white/[0.15] bg-[#141414] hover:border-[#FF5555]/40 transition-all duration-500"
                      data-track={`Blog — Post: ${post.title.substring(0, 50)}`}
                    >
                      <div className="p-8 md:p-10 flex flex-col h-full w-full">
                        <h3 className="text-2xl md:text-[1.75rem] font-serif text-[#FFFFFF] leading-tight mb-4 group-hover:text-white transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-sm md:text-base font-sans leading-relaxed text-[#A9A9A9] mb-16 flex-grow line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto">
                          <div className="h-[1px] w-full bg-[#FFFFFF]/10 mb-4"></div>

                          <div className="flex justify-between text-xs font-sans text-[#A9A9A9] mb-6 uppercase tracking-wider">
                            <div className="flex flex-col space-y-2">
                              <span className="font-semibold text-[10px] text-[#FFFFFF]">Date</span>
                              <span>{post.date}</span>
                            </div>
                            <div className="flex flex-col space-y-2 text-right">
                              <span className="font-semibold text-[10px] text-[#FFFFFF]">Category</span>
                              <span>{post.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#FF5555]/15 flex items-center justify-center text-[#FF5555] text-[9px] font-bold font-sans">
                                {post.author.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-sans font-medium text-[#FFFFFF]">{post.author}</span>
                                <span className="text-[10px] font-sans text-[#A9A9A9] flex items-center gap-1">
                                  <Clock size={9} />
                                  {post.readTime}
                                </span>
                              </div>
                            </div>

                            <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#FF5555] group-hover:border-[#FF5555] transition-all duration-300">
                              <ArrowUpRight size={16} className="text-[#A9A9A9] group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl font-serif text-[#FFFFFF] mb-3">No articles found</p>
                <p className="text-sm font-sans text-[#A9A9A9]">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="mt-6 text-[#FF5555] text-sm font-sans font-bold underline underline-offset-4 hover:text-white transition-colors cursor-pointer"
                  data-track="Blog — Clear All Filters"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ============ NEWSLETTER CTA ============ */}
        <section className="w-full bg-[#141414] px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto border-y border-white/10 py-20 md:py-28 px-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif text-[#FFFFFF] leading-[1.15] mb-4">
                Stay in the loop
              </h2>
              <p className="text-sm font-sans text-[#A9A9A9] mb-8">
                Biweekly insights on AI, engineering, and product strategy. No spam.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row items-center gap-3"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full sm:w-80 bg-white/5 border border-white/10 rounded px-5 py-3 text-sm font-sans text-white placeholder-[#A9A9A9] outline-none focus:border-[#FF5555]/50 transition-colors"
                  data-track="Blog — Newsletter Email Input"
                />
                <AnimatedButton href={null} size="md" className="w-full sm:w-auto whitespace-nowrap" data-track="Blog — Newsletter Subscribe CTA">
                  Subscribe
                </AnimatedButton>
              </form>
            </div>
          </div>
        </section>
        </>
        )}
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
