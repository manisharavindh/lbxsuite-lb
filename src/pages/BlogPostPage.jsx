import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Clock, ArrowUpRight, Share2, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import blogPosts from '../data/blogPosts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveGrid from '../InteractiveGrid';
import AnimatedButton from '../components/AnimatedButton';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === slug);
  const contentRef = useRef(null);
  const relatedRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-50px" });
  const isRelatedInView = useInView(relatedRef, { once: true, margin: "-80px" });
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#141414] text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Post not found</h1>
          <p className="text-[#A9A9A9] mb-8">The article you're looking for doesn't exist.</p>
          <AnimatedButton href="/blog" size="md">
            <ArrowLeft size={16} />
            Back to Blog
          </AnimatedButton>
        </div>
      </div>
    );
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 2);
  
  // If not enough from same category, add from other categories
  if (relatedPosts.length < 2) {
    const otherPosts = blogPosts
      .filter(p => p.id !== post.id && !relatedPosts.includes(p))
      .slice(0, 2 - relatedPosts.length);
    relatedPosts.push(...otherPosts);
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 * Math.min(index, 10), ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg font-sans text-[#c0c0c0] leading-[1.85] mb-6"
          >
            {block.text}
          </motion.p>
        );
      
      case 'heading':
        return (
          <motion.h2
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 * Math.min(index, 10), ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl md:text-3xl font-serif text-[#FFFFFF] leading-[1.2] mt-12 mb-5"
          >
            {block.text}
          </motion.h2>
        );
      
      case 'quote':
        return (
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isContentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 * Math.min(index, 10), ease: [0.22, 1, 0.36, 1] }}
            className="relative my-10 pl-6 md:pl-8 py-2 border-l-2 border-[#FF5555]"
          >
            <p className="text-lg md:text-xl font-serif italic text-[#FFFFFF]/90 leading-[1.6]">
              "{block.text}"
            </p>
          </motion.blockquote>
        );
      
      case 'list':
        return (
          <motion.ul
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 * Math.min(index, 10), ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 mb-8 ml-0"
          >
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-base md:text-lg font-sans text-[#c0c0c0] leading-[1.75]">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#FF5555] shrink-0" />
                {item}
              </li>
            ))}
          </motion.ul>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-[#FFFFFF]">
      <InteractiveGrid />
      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-center">
        {/* ============ HERO ============ */}
        <section className="relative w-full pt-28 md:pt-36 pb-0 px-6 md:px-12">
          <div className="max-w-[900px] mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                to="/blog"
                className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-[0.15em] uppercase text-[#A9A9A9] hover:text-[#FF5555] transition-colors mb-10 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </motion.div>

            {/* Post Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4 mb-6 flex-wrap"
            >
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#FF5555] bg-[#FF5555]/10 px-3 py-1.5 rounded-full">
                {post.category}
              </span>
              <span className="text-[11px] font-sans text-[#A9A9A9]">{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-[#A9A9A9]/50" />
              <span className="text-[11px] font-sans text-[#A9A9A9] flex items-center gap-1.5">
                <Clock size={12} />
                {post.readTime}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif text-[#FFFFFF] leading-[1.15] tracking-[-0.01em] mb-8"
            >
              {post.title}
            </motion.h1>

            {/* Author + Share */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex items-center justify-between pb-10 border-b border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#FF5555]/20 flex items-center justify-center text-[#FF5555] text-sm font-bold font-sans">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-sans font-medium text-[#FFFFFF]">{post.author}</p>
                  <p className="text-[11px] font-sans text-[#A9A9A9]">{post.authorRole}</p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#A9A9A9] hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  title="Copy link"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#A9A9A9] hover:text-white hover:border-white/20 transition-all"
                >
                  <Twitter size={14} />
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#A9A9A9] hover:text-white hover:border-white/20 transition-all"
                >
                  <Linkedin size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============ COVER IMAGE ============ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full px-6 md:px-12 py-10"
        >
          <div className="max-w-[1100px] mx-auto">
            <div className="relative h-[280px] sm:h-[380px] md:h-[480px] rounded-2xl overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/40 via-transparent to-transparent" />
            </div>
          </div>
        </motion.section>

        {/* ============ ARTICLE CONTENT ============ */}
        <section ref={contentRef} className="w-full px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-[720px] mx-auto">
            {/* Lead paragraph styled differently */}
            {post.content[0] && post.content[0].type === 'paragraph' && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg md:text-xl font-sans text-[#e0e0e0] leading-[1.85] mb-8 first-letter:text-5xl first-letter:font-serif first-letter:text-[#FF5555] first-letter:float-left first-letter:mr-3 first-letter:mt-1"
              >
                {post.content[0].text}
              </motion.p>
            )}
            
            {/* Remaining content */}
            {post.content.slice(1).map((block, index) => renderContent(block, index + 1))}

            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#A9A9A9] mr-2">Tags:</span>
                {post.tags.map(tag => (
                  <Link 
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-[11px] font-sans font-medium text-[#A9A9A9] bg-white/5 px-3 py-1.5 rounded-full hover:bg-[#FF5555]/10 hover:text-[#FF5555] transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ AUTHOR BIO ============ */}
        <section className="w-full px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-[720px] mx-auto">
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-8 md:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-[#FF5555]/20 flex items-center justify-center text-[#FF5555] text-xl font-bold font-sans shrink-0">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-lg font-serif text-[#FFFFFF] mb-1">{post.author}</p>
                <p className="text-xs font-sans text-[#FF5555] font-bold uppercase tracking-wider mb-3">{post.authorRole}</p>
                <p className="text-sm font-sans text-[#A9A9A9] leading-relaxed">
                  Building the future of digital experiences at LbxSuite. Passionate about autonomous AI systems, high-performance web engineering, and thoughtful design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ RELATED POSTS ============ */}
        {relatedPosts.length > 0 && (
          <section ref={relatedRef} className="w-full bg-[#141414] py-16 md:py-24 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#FF5555] mb-3 block">
                    Continue Reading
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif text-[#FFFFFF]">Related Articles</h2>
                </div>
                <Link 
                  to="/blog"
                  className="hidden md:flex items-center gap-2 text-sm font-sans font-bold text-[#A9A9A9] hover:text-[#FF5555] transition-colors"
                >
                  View All
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {relatedPosts.map((relPost, index) => (
                  <motion.div
                    key={relPost.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={isRelatedInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={`/blog/${relPost.id}`}
                      className="group flex flex-col sm:flex-row bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-[#FF5555]/20 transition-all duration-500 h-full"
                    >
                      <div className="relative w-full sm:w-[220px] h-[180px] sm:h-auto overflow-hidden shrink-0">
                        <img 
                          src={relPost.coverImage} 
                          alt={relPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a]/50 hidden sm:block" />
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <span className="text-[9px] font-sans font-bold tracking-[0.2em] uppercase text-[#FF5555] mb-3">
                          {relPost.category}
                        </span>
                        <h3 className="text-lg font-serif text-[#FFFFFF] leading-[1.3] mb-2 group-hover:text-[#FF5555] transition-colors duration-300 line-clamp-2">
                          {relPost.title}
                        </h3>
                        <p className="text-[12px] font-sans text-[#A9A9A9] leading-relaxed line-clamp-2">
                          {relPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
