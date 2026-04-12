import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Clock, Twitter, Linkedin, Copy, Check, Instagram, Facebook, Github, Youtube, Dribbble, Globe, Link as LinkIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import blogPostsFallback from '../data/blogPosts';
import Footer from '../components/Footer';
import AnimatedButton from '../components/AnimatedButton';

const toId = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const BlogPostPage = () => {
  const { slug } = useParams();
  const [blogPosts, setBlogPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [activeId, setActiveId] = React.useState('');

  useEffect(() => {
    fetch('/api/admin/posts/public/list')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
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
          // To get content we might need to fetch the individual post or it might be in the list?
          // The /api/admin/posts/public/list doesn't return content to save bandwidth!
        }));
        setBlogPosts(mappedData);
      })
      .catch(err => {
        console.error("Failed to fetch post list from DB, using fallback:", err);
        setBlogPosts(blogPostsFallback);
      });
  }, []);

  const [post, setPost] = React.useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/posts/public/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        const mappedPost = {
          id: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          coverImage: data.image_url,
          category: data.category || 'General',
          author: data.author,
          authorRole: data.author_role,
          date: new Date(data.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          readTime: data.read_time,
          featured: data.featured,
          tags: data.tags?.filter(t => !t.startsWith('__link:') && !t.startsWith('__social:')) || [],
          authorLinks: (() => {
              const authorsLinksTag = data.tags?.find(t => t.startsWith('__authorlinks:'));
              if (authorsLinksTag) {
                  try { return JSON.parse(authorsLinksTag.replace('__authorlinks:', '')); } catch(e) { return []; }
              }
              // migrate from old
              const oldSocialTag = data.tags?.find(t => t.startsWith('__social:'));
              let loadedLinks = [];
              if (oldSocialTag) {
                  try {
                      const parsed = JSON.parse(oldSocialTag.replace('__social:', ''));
                      ['twitter', 'linkedin', 'instagram', 'facebook'].forEach(key => {
                          if (parsed[`${key}_enabled`] && parsed[key] && parsed[key] !== 'true') {
                              loadedLinks.push(parsed[key]);
                          }
                      });
                  } catch(e) {}
              }
              return loadedLinks;
          })(),
          content: data.content || []
        };
        setPost(mappedPost);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch post from DB, using fallback:", err);
        const fallbackPost = blogPostsFallback.find(p => p.id === slug) || null;
        setPost(fallbackPost);
        setLoading(false);
      });
  }, [slug]);

  const headings = React.useMemo(() => {
    if (!post) return [];
    return post.content
      .filter((b) => b.type === 'heading')
      .map((b) => ({ text: b.text, id: toId(b.text) }));
  }, [post]);

  // Scroll-spy
  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <span className="text-[#A9A9A9] animate-pulse">Loading post...</span>
      </div>
    );
  }

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

  // Related posts
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);
  if (relatedPosts.length < 2) {
    const others = blogPosts
      .filter((p) => p.id !== post.id && !relatedPosts.includes(p))
      .slice(0, 2 - relatedPosts.length);
    relatedPosts.push(...others);
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index}
            className="text-[1.0625rem] md:text-[1.125rem] font-sans text-[#C8C8C8] leading-[1.85] mb-7 tracking-[0.005em]"
          >
            {block.text}
          </p>
        );

      case 'heading': {
        const id = toId(block.text);
        return (
          <h2 key={index} id={id}
            className="text-[1.5rem] md:text-[1.75rem] font-serif text-white leading-[1.3] mt-12 mb-5 tracking-[-0.01em] scroll-mt-28"
          >
            {block.text}
          </h2>
        );
      }

      case 'quote':
        return (
          <blockquote key={index} className="my-10 pl-6 border-l-[3px] border-[#FF5555]">
            <p className="text-[1.125rem] md:text-[1.25rem] font-serif italic text-white/85 leading-[1.65]">
              "{block.text}"
            </p>
          </blockquote>
        );

      case 'list':
        return (
          <ul key={index} className="space-y-4 my-8">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-4 text-[1.0625rem] md:text-[1.125rem] font-sans text-[#C8C8C8] leading-[1.85]">
                <span className="mt-[0.68rem] w-[5px] h-[5px] rounded-full bg-[#FF5555] shrink-0 ring-[3px] ring-[#FF5555]/15" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );

      case 'image':
        return (
          <figure key={index} className="my-12 w-full">
            <div className="relative w-full rounded-lg overflow-hidden bg-[#1A1A1A] border border-white/[0.05]">
              <img src={block.url} alt={block.caption || 'Blog image'} className="w-full h-auto block" />
            </div>
            {block.caption && (
              <figcaption className="text-center text-[12px] font-sans text-[#777] mt-3 tracking-wide">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );

      default:
        return null;
    }
  };

  return (
    // NOTE: no overflow-x-hidden here — it would break position:sticky on the sidebar.
    // Horizontal overflow is prevented by max-w constraints on inner containers instead.
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#FF5555] selection:text-white">
      <Navbar />

      <main className="relative z-10 w-full">

        {/* ──────────────────────────────────────────────────────────────
            SINGLE two-column layout wrapping EVERYTHING.
            Left col (article): max-w-[660px], grows with flex-1
            Right col (sidebar): w-[220px], sticky
            Outer container: max-w-[1100px] — comfortably fits both cols
            + gap-16 on large screens.
        ─────────────────────────────────────────────────────────────── */}
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-0 flex flex-col lg:flex-row items-start gap-0 lg:gap-16">

          {/* ═══ LEFT: full article column ═══ */}
          <div className="w-full min-w-0 lg:max-w-[660px]">

            {/* Back */}
            <div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold tracking-[0.14em] uppercase text-[#888] hover:text-[#FF5555] transition-colors mb-9 group"
                data-track="Blog Post — Back to Blog"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Blog
              </Link>
            </div>

            {/* Category / date / read-time */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-[10px] font-sans font-bold tracking-[0.18em] uppercase text-[#FF5555] bg-[#FF5555]/8 px-3 py-1.5 rounded-sm border border-[#FF5555]/15">
                {post.category}
              </span>
              <span className="text-[11px] font-sans text-[#A9A9A9] bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-sm">
                {post.date}
              </span>
              <span className="text-[11px] font-sans text-[#A9A9A9] flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-sm">
                <Clock size={10} strokeWidth={2} />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[1.9rem] sm:text-[2.4rem] md:text-[2.9rem] font-serif text-white leading-[1.14] tracking-[-0.018em] mb-8">
              {post.title}
            </h1>

            {/* Author + share bar */}
            <div className="flex items-center justify-between pb-8 border-b border-white/[0.07] mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FF5555]/15 flex items-center justify-center text-[#FF5555] text-[10px] font-bold font-sans shrink-0">
                  {post.author.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[13px] font-sans font-semibold text-white leading-tight">{post.author}</p>
                  <p className="text-[11px] font-sans text-[#888] mt-0.5">{post.authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  title="Copy link"
                  className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-[#888] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
                  data-track="Blog Post — Copy Link"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
                {post.authorLinks?.map((link, idx) => {
                  const lowerUrl = link.toLowerCase();
                  let IconComp = LinkIcon;
                  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) IconComp = Twitter;
                  else if (lowerUrl.includes('linkedin.com')) IconComp = Linkedin;
                  else if (lowerUrl.includes('instagram.com')) IconComp = Instagram;
                  else if (lowerUrl.includes('facebook.com')) IconComp = Facebook;
                  else if (lowerUrl.includes('github.com')) IconComp = Github;
                  else if (lowerUrl.includes('youtube.com')) IconComp = Youtube;
                  else if (lowerUrl.includes('dribbble.com')) IconComp = Dribbble;
                  else IconComp = Globe;

                  let title = "Author's Link";
                  if (IconComp === Twitter) title = "Author's Twitter";
                  else if (IconComp === Linkedin) title = "Author's LinkedIn";
                  else if (IconComp === Instagram) title = "Author's Instagram";
                  else if (IconComp === Facebook) title = "Author's Facebook";
                  else if (IconComp === Github) title = "Author's GitHub";

                  return (
                    <a
                      key={idx}
                      href={link}
                      target="_blank" rel="noopener noreferrer"
                      title={title}
                      className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-[#888] hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
                    >
                      <IconComp size={12} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Cover image — same width as the article column */}
            <div className="mb-12">
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.06]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* ── Article body ── */}

            {/* Lead paragraph */}
            {post.content[0]?.type === 'paragraph' && (
              <p className="text-[1.125rem] md:text-[1.25rem] font-sans text-[#E0E0E0] leading-[1.8] mb-10 tracking-[0.003em]">
                {post.content[0].text}
              </p>
            )}

            {/* Rest of content blocks */}
            {post.content.slice(1).map((block, i) => renderBlock(block, i + 1))}

            {/* Divider + Tags */}
            <div className="mt-16 pt-8 border-t border-white/[0.06]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#555] mr-1">Tags</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-[11px] font-sans font-medium text-[#999] bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-sm hover:bg-[#FF5555]/8 hover:border-[#FF5555]/20 hover:text-[#FF5555] transition-all duration-300"
                    data-track={`Blog Post — Tag: ${tag}`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 mb-20 md:mb-28 bg-[#1a1a1a] rounded-xl border border-white/[0.06] p-7 md:p-9 flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-[#FF5555]/12 flex items-center justify-center text-[#FF5555] text-[13px] font-bold font-sans shrink-0">
                {post.author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-[14px] font-serif text-white mb-0.5 tracking-[-0.01em]">{post.author}</p>
                <p className="text-[10px] font-sans text-[#FF5555] font-bold uppercase tracking-[0.15em] mb-3">{post.authorRole}</p>
                <p className="text-[13px] font-sans text-[#999] leading-[1.7]">
                  Building the future of digital experiences at LbxSuite. Passionate about autonomous AI systems, high-performance web engineering, and thoughtful design.
                </p>
              </div>
            </div>
          </div>{/* end left column */}

          {/* ═══ RIGHT: sticky sidebar ═══
              `self-start` + `sticky top-28` is the canonical pattern.
              Works because the parent has NO overflow set —
              overflow-x-hidden is NOT on any ancestor of this element.
          ═══════════════════════════════ */}
          {headings.length > 0 && (
            <aside className="hidden lg:block w-[220px] shrink-0 sticky top-28 self-start mt-[calc(2.25rem+2px)] mb-12">
              {/* mt offset aligns the "On this page" label roughly with the
                  first line of body text after the cover image */}
              <p className="text-[10px] font-sans font-bold tracking-[0.22em] uppercase text-[#555] mb-5">
                On this page
              </p>
              <nav className="relative flex flex-col">
                {/* Static track */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/[0.07]" />

                {headings.map(({ id, text }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`
                      py-2 pl-4 text-[12.5px] font-sans font-medium leading-snug border-l transition-colors duration-300
                      ${activeId === id
                        ? 'border-[#FF5555] text-white'
                        : 'border-transparent text-[#666] hover:text-[#BFBFBF] hover:border-white/20'
                      }
                    `}
                  >
                    {text}
                  </a>
                ))}
              </nav>
            </aside>
          )}

        </div>{/* end two-column wrapper */}

        {/* ══════════════ RELATED ARTICLES ═════════════════════════════ */}
        {relatedPosts.length > 0 && (
          <section className="w-full bg-[#141414] py-16 md:py-16 border-b border-white/[0.06]">
            <div className="max-w-[1100px] mx-auto px-6 md:px-12">

              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#FF5555] mb-2 block">
                    Continue Reading
                  </span>
                  <h2 className="text-[1.75rem] md:text-[2rem] font-serif text-white tracking-[-0.01em]">
                    Related Articles
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="hidden md:flex items-center gap-2 text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#888] hover:text-[#FF5555] transition-colors duration-300"
                >
                  View All
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Cards — pixel-identical to BlogPage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {relatedPosts.map((rp) => (
                  <div key={rp.id} className="h-full">
                    <Link
                      to={`/blog/${rp.id}`}
                      className="group block h-full rounded-[4px] border border-white/[0.15] bg-[#141414] hover:border-[#FF5555]/40 transition-all duration-500"
                      data-track={`Blog Post — Related: ${rp.title.substring(0, 40)}`}
                    >
                      <div className="p-8 md:p-10 flex flex-col h-full">
                        <h3 className="text-[1.375rem] md:text-[1.625rem] font-serif text-white leading-tight mb-4 line-clamp-2">
                          {rp.title}
                        </h3>

                        <p className="text-sm font-sans leading-relaxed text-[#A9A9A9] mb-16 flex-grow line-clamp-3">
                          {rp.excerpt}
                        </p>

                        <div className="mt-auto">
                          <div className="h-[1px] w-full bg-white/10 mb-4" />

                          <div className="flex justify-between text-xs font-sans text-[#A9A9A9] mb-5 uppercase tracking-wider">
                            <div className="flex flex-col space-y-1.5">
                              <span className="font-semibold text-[10px] text-white">Date</span>
                              <span>{rp.date}</span>
                            </div>
                            <div className="flex flex-col space-y-1.5 text-right">
                              <span className="font-semibold text-[10px] text-white">Category</span>
                              <span>{rp.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#FF5555]/15 flex items-center justify-center text-[#FF5555] text-[9px] font-bold font-sans">
                                {rp.author.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-sans font-medium text-white">{rp.author}</span>
                                <span className="text-[10px] font-sans text-[#A9A9A9] flex items-center gap-1">
                                  <Clock size={9} />
                                  {rp.readTime}
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

              <div className="md:hidden mt-10 text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-[11px] font-sans font-bold tracking-[0.1em] uppercase text-[#888] hover:text-[#FF5555] transition-colors duration-300"
                  data-track="Blog Post — View All Articles"
                >
                  View All Articles
                  <ArrowUpRight size={13} />
                </Link>
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
