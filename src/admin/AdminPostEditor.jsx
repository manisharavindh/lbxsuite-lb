import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save, ArrowLeft, Upload, X, Link as LinkIcon,
  Eye, Plus, ChevronDown, ChevronUp
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { postsAPI } from './api';
import RichTextEditor from './RichTextEditor';
import { normalizeContent, isBlockFormat } from './contentConverter';

const CATEGORIES = [
  'Artificial Intelligence',
  'Software Engineering',
  'Web3 & Blockchain',
  'Design',
  'Creative Media',
  'General',
];

const slugify = (text) =>
  text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const AdminPostEditor = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new' || !id;

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    cover_image: '',
    category: 'General',
    author: 'Manish Aravindh',
    author_role: 'Co-Founder & CTO',
    read_time: '5 min read',
    featured: false,
    tags: [],
    content: '',  // Now stored as HTML string
    status: 'draft',
  });

  const [loading, setLoading] = useState(!isNew);
  const [savingType, setSavingType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [toasts, setToasts] = useState([]);
  const [autoSlug, setAutoSlug] = useState(true);
  const [convertedFromBlocks, setConvertedFromBlocks] = useState(false);
  const fileInputRef = useRef(null);

  const [authorLinks, setAuthorLinks] = useState([]);

  useEffect(() => {
    if (!isNew) loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const post = await postsAPI.get(id);

      const loadedLinksTag = post.tags?.find(t => t.startsWith('__authorlinks:'));
      let loadedLinks = [];

      if (loadedLinksTag) {
        try {
          loadedLinks = JSON.parse(loadedLinksTag.replace('__authorlinks:', ''));
        } catch (e) { }
      } else {
        // Fallback legacy support
        const oldSocialTag = post.tags?.find(t => t.startsWith('__social:'));
        if (oldSocialTag) {
          try {
            const parsed = JSON.parse(oldSocialTag.replace('__social:', ''));
            ['twitter', 'linkedin', 'instagram', 'facebook'].forEach(key => {
              if (parsed[`${key}_enabled`] && parsed[key] && parsed[key] !== 'true') {
                loadedLinks.push(parsed[key]);
              }
            });
          } catch (e) { }
        }
      }
      setAuthorLinks(loadedLinks.slice(0, 3));

      // Parse content — handle both old block format and new HTML format
      let rawContent = post.content;
      if (typeof rawContent === 'string') {
        try {
          rawContent = JSON.parse(rawContent);
        } catch { /* not JSON, keep as string */ }
      }

      // Detect and auto-convert old block format
      const wasBlocks = isBlockFormat(rawContent);
      const htmlContent = normalizeContent(rawContent);
      if (wasBlocks) {
        setConvertedFromBlocks(true);
      }

      setForm({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        cover_image: post.cover_image || '',
        category: post.category || 'General',
        author: post.author || '',
        author_role: post.author_role || '',
        read_time: post.read_time || '',
        featured: post.featured || false,
        tags: post.tags?.filter(t => !t.startsWith('__link:') && !t.startsWith('__social:') && !t.startsWith('__authorlinks:')) || [],
        content: htmlContent,
        status: post.status || 'draft',
      });
      setAutoSlug(false);
    } catch (err) {
      addToast('Failed to load post', 'error');
      navigate('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type = 'success') => {
    const tid = Date.now();
    setToasts(prev => [...prev, { id: tid, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== tid)), 3500);
  };

  const updateField = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && autoSlug) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await postsAPI.uploadImage(file);
      updateField('cover_image', result.url);
      addToast('Image uploaded & compressed');
    } catch (err) {
      addToast('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (newStatus) => {
    if (!form.title || !form.slug) {
      addToast('Title and slug are required', 'error');
      return;
    }

    setSavingType(newStatus || form.status);
    const tagsToSave = [...form.tags.filter(t => !t.startsWith('__link:') && !t.startsWith('__social:') && !t.startsWith('__authorlinks:')), `__authorlinks:${JSON.stringify(authorLinks.filter(l => l.trim() !== ''))}`];
    const payload = { ...form, tags: tagsToSave };
    if (newStatus) payload.status = newStatus;

    try {
      if (isNew) {
        const created = await postsAPI.create(payload);
        addToast('Post created successfully!');
        navigate(`/admin/posts/${created.id}`);
      } else {
        await postsAPI.update(id, payload);
        addToast('Post saved successfully!');
        if (newStatus) setForm(prev => ({ ...prev, status: newStatus }));
        if (convertedFromBlocks) {
          setConvertedFromBlocks(false);
          addToast('Content converted from blocks to rich text');
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to save post', 'error');
    } finally {
      setSavingType(null);
    }
  };

  // Tags
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      updateField('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    updateField('tags', form.tags.filter(t => t !== tag));
  };

  if (loading) {
    return (
      <AdminLayout user={user} onLogout={onLogout} title="Loading...">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-skeleton" style={{ height: '48px' }} />
          <div className="admin-skeleton" style={{ height: '200px' }} />
          <div className="admin-skeleton" style={{ height: '300px' }} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      user={user}
      onLogout={onLogout}
      title={isNew ? 'New Post' : 'Edit Post'}
      subtitle={isNew ? 'Create a new blog post' : form.title}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/admin/posts')} className="admin-btn admin-btn-secondary admin-btn-sm">
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={() => handleSave('draft')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            disabled={savingType !== null}
          >
            {savingType === 'draft' ? <div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: '2px' }} /> : <Save size={14} />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            className="admin-btn admin-btn-primary admin-btn-sm"
            disabled={savingType !== null}
          >
            {savingType === 'published' ? <div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: '2px' }} /> : <Save size={14} />}
            {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          {/* Title */}
          <div className="admin-card">
            <div className="admin-card-body">
              <div className="admin-field">
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Enter post title..."
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  style={{ fontSize: '18px', fontWeight: 600, padding: '14px' }}
                />
              </div>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">
                  Slug
                  {autoSlug && <span style={{ color: 'var(--admin-text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}> auto-generated</span>}
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="post-url-slug"
                  value={form.slug}
                  onChange={(e) => { setAutoSlug(false); updateField('slug', e.target.value); }}
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Excerpt</span>
            </div>
            <div className="admin-card-body">
              <textarea
                className="admin-textarea"
                placeholder="Brief description of the post..."
                value={form.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Content</span>
              {convertedFromBlocks && (
                <span style={{
                  fontSize: '11px',
                  color: 'var(--admin-warning)',
                  background: 'var(--admin-warning-bg)',
                  padding: '3px 10px',
                  borderRadius: '2px',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  fontWeight: 600,
                }}>
                  Auto-converted from blocks — save to persist
                </span>
              )}
            </div>
            <div className="admin-card-body" style={{ padding: 0 }}>
              <RichTextEditor
                content={form.content}
                onChange={(html) => updateField('content', html)}
                placeholder="Start writing your blog post content..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status & Publish */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Publish</span>
              <span className={`admin-badge ${form.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                {form.status}
              </span>
            </div>
            <div className="admin-card-body">
              <div className="admin-field">
                <label className="admin-label">Status</label>
                <select
                  className="admin-select"
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                  style={{ accentColor: 'var(--admin-accent)' }}
                />
                <label htmlFor="featured" style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', cursor: 'pointer' }}>
                  Featured post
                </label>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Cover Image</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                <span>{form.cover_image !== false ? 'Enabled' : 'Disabled'}</span>
                <input
                  type="checkbox"
                  checked={form.cover_image !== false}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      updateField('cover_image', false);
                    } else {
                      updateField('cover_image', '');
                    }
                  }}
                  style={{ accentColor: 'var(--admin-accent)' }}
                />
              </label>
            </div>
            {form.cover_image !== false && (
              <div className="admin-card-body">
                {form.cover_image ? (
                  <div className="admin-upload-preview">
                    <img src={form.cover_image} alt="Cover" />
                    <button
                      onClick={() => updateField('cover_image', '')}
                      className="admin-upload-preview-remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="admin-upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div className="admin-spinner admin-spinner-lg" />
                        <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Compressing...</span>
                      </div>
                    ) : (
                      <>
                        <p className="admin-upload-zone-text">Click to upload</p>
                        <p className="admin-upload-zone-hint">Auto-compressed to WebP</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className="admin-field" style={{ marginTop: '12px', marginBottom: 0 }}>
                  <label className="admin-label">Or paste URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="/uploads/image.webp"
                    value={form.cover_image || ''}
                    onChange={(e) => updateField('cover_image', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Details</span>
            </div>
            <div className="admin-card-body">
              <div className="admin-field">
                <label className="admin-label">Category</label>
                <select
                  className="admin-select"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="admin-field">
                <label className="admin-label">Author</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.author}
                  onChange={(e) => updateField('author', e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Author Role</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.author_role}
                  onChange={(e) => updateField('author_role', e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label className="admin-label">Read Time</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="5 min read"
                  value={form.read_time}
                  onChange={(e) => updateField('read_time', e.target.value)}
                />
              </div>

              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Tags</label>
                <div className="admin-tags" onClick={() => document.getElementById('tagInput')?.focus()}>
                  {form.tags.map((tag) => (
                    <span key={tag} className="admin-tag">
                      {tag}
                      <button className="admin-tag-remove" onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                  <input
                    id="tagInput"
                    type="text"
                    placeholder={form.tags.length === 0 ? "Add tags..." : ""}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    onBlur={addTag}
                  />
                </div>
              </div>

              <div className="admin-field" style={{ marginBottom: 0, marginTop: '20px' }}>
                <label className="admin-label">Author Links (Max 3)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>

                  {authorLinks.map((link, index) => {
                    const lowerUrl = link.toLowerCase();
                    let IconComp = LinkIcon;
                    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) IconComp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
                    else if (lowerUrl.includes('linkedin.com')) IconComp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
                    else if (lowerUrl.includes('instagram.com')) IconComp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
                    else if (lowerUrl.includes('facebook.com')) IconComp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
                    else if (lowerUrl.includes('github.com')) IconComp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;

                    return (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                          <button
                            onClick={() => {
                              const newLinks = [...authorLinks];
                              [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
                              setAuthorLinks(newLinks);
                            }}
                            className="admin-btn admin-btn-ghost"
                            style={{ padding: '2px', opacity: index === 0 ? 0.3 : 1 }}
                            disabled={index === 0}
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            onClick={() => {
                              const newLinks = [...authorLinks];
                              [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
                              setAuthorLinks(newLinks);
                            }}
                            className="admin-btn admin-btn-ghost"
                            style={{ padding: '2px', opacity: index === authorLinks.length - 1 ? 0.3 : 1 }}
                            disabled={index === authorLinks.length - 1}
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                        <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--admin-surface-2)', borderRadius: 'var(--admin-radius)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}>
                          <IconComp />
                        </div>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://..."
                          value={link}
                          onChange={(e) => {
                            const newLinks = [...authorLinks];
                            newLinks[index] = e.target.value;
                            setAuthorLinks(newLinks);
                          }}
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={() => {
                            const newLinks = [...authorLinks];
                            newLinks.splice(index, 1);
                            setAuthorLinks(newLinks);
                          }}
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ color: 'var(--admin-accent)', padding: '6px' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}

                  {authorLinks.length < 3 && (
                    <button
                      onClick={() => setAuthorLinks([...authorLinks, ''])}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      style={{ alignSelf: 'flex-start' }}
                    >
                      <Plus size={14} /> Add Link
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div className="admin-toast-wrapper">
        {toasts.map(t => (
          <div key={t.id} className={`admin-toast admin-toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Responsive style override */}
      <style>{`
        @media (max-width: 960px) {
          .admin-content > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminPostEditor;
