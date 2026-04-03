import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save, ArrowLeft, Upload, X, Image, Type, AlignLeft,
  Quote, List, Heading2, Heading3, Bold, Italic, Link as LinkIcon,
  Eye, Trash2, Plus, GripVertical, ChevronDown, ChevronUp
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { postsAPI } from './api';

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
    content: [],
    status: 'draft',
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [toasts, setToasts] = useState([]);
  const [autoSlug, setAutoSlug] = useState(true);
  const [addBlockType, setAddBlockType] = useState(null);
  const [newBlockText, setNewBlockText] = useState('');
  const [newBlockItems, setNewBlockItems] = useState(['']);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isNew) loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const post = await postsAPI.get(id);
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
        tags: post.tags || [],
        content: typeof post.content === 'string' ? JSON.parse(post.content) : (post.content || []),
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

    setSaving(true);
    const payload = { ...form };
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
      }
    } catch (err) {
      addToast(err.message || 'Failed to save post', 'error');
    } finally {
      setSaving(false);
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

  // Content blocks
  const addContentBlock = () => {
    if (!addBlockType) return;

    let block;
    if (addBlockType === 'list') {
      block = { type: 'list', items: newBlockItems.filter(i => i.trim()) };
    } else {
      block = { type: addBlockType, text: newBlockText.trim() };
    }

    if (block.type === 'list' && block.items.length === 0) return;
    if (block.type !== 'list' && !block.text) return;

    updateField('content', [...form.content, block]);
    setAddBlockType(null);
    setNewBlockText('');
    setNewBlockItems(['']);
  };

  const removeContentBlock = (index) => {
    updateField('content', form.content.filter((_, i) => i !== index));
  };

  const moveContentBlock = (index, direction) => {
    const newContent = [...form.content];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newContent.length) return;
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    updateField('content', newContent);
  };

  const blockTypeIcons = {
    paragraph: AlignLeft,
    heading: Heading2,
    quote: Quote,
    list: List,
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
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            className="admin-btn admin-btn-primary admin-btn-sm"
            disabled={saving}
          >
            {saving ? <div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: '2px' }} /> : <Save size={14} />}
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
                  {autoSlug && <span style={{ color: 'var(--admin-text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}> — auto-generated</span>}
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

          {/* Content Blocks */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Content Blocks</span>
              <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                {form.content.length} block{form.content.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="admin-card-body">
              {form.content.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  {form.content.map((block, i) => {
                    const Icon = blockTypeIcons[block.type] || AlignLeft;
                    return (
                      <div key={i} className="admin-content-block">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                          <button
                            onClick={() => moveContentBlock(i, -1)}
                            className="admin-btn admin-btn-ghost"
                            style={{ padding: '2px', opacity: i === 0 ? 0.3 : 1 }}
                            disabled={i === 0}
                          >
                            <ChevronUp size={12} />
                          </button>
                          <GripVertical size={12} style={{ color: 'var(--admin-text-muted)' }} />
                          <button
                            onClick={() => moveContentBlock(i, 1)}
                            className="admin-btn admin-btn-ghost"
                            style={{ padding: '2px', opacity: i === form.content.length - 1 ? 0.3 : 1 }}
                            disabled={i === form.content.length - 1}
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                        <span className="admin-content-block-type">
                          <Icon size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                          {block.type}
                        </span>
                        <span className="admin-content-block-text">
                          {block.type === 'list' ? block.items?.join(' • ') : block.text}
                        </span>
                        <div className="admin-content-block-actions">
                          <button
                            onClick={() => removeContentBlock(i)}
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            style={{ color: 'var(--admin-accent)' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="admin-empty" style={{ padding: '32px' }}>
                  <p className="admin-empty-text">No content blocks yet. Add blocks below.</p>
                </div>
              )}

              {/* Add Block UI */}
              {addBlockType ? (
                <div style={{
                  padding: '16px',
                  background: 'var(--admin-surface-2)',
                  borderRadius: 'var(--admin-radius)',
                  border: '1px solid var(--admin-border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-accent)', textTransform: 'uppercase' }}>
                      Add {addBlockType}
                    </span>
                    <button onClick={() => setAddBlockType(null)} className="admin-btn admin-btn-ghost admin-btn-sm">
                      <X size={14} />
                    </button>
                  </div>

                  {addBlockType === 'list' ? (
                    <div>
                      {newBlockItems.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder={`List item ${i + 1}...`}
                            value={item}
                            onChange={(e) => {
                              const items = [...newBlockItems];
                              items[i] = e.target.value;
                              setNewBlockItems(items);
                            }}
                          />
                          {newBlockItems.length > 1 && (
                            <button
                              onClick={() => setNewBlockItems(newBlockItems.filter((_, j) => j !== i))}
                              className="admin-btn admin-btn-ghost admin-btn-sm"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setNewBlockItems([...newBlockItems, ''])}
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        style={{ marginTop: '4px' }}
                      >
                        <Plus size={12} /> Add Item
                      </button>
                    </div>
                  ) : (
                    <textarea
                      className="admin-textarea"
                      placeholder={`Enter ${addBlockType} text...`}
                      value={newBlockText}
                      onChange={(e) => setNewBlockText(e.target.value)}
                      rows={addBlockType === 'paragraph' ? 4 : 2}
                      autoFocus
                    />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                    <button onClick={() => setAddBlockType(null)} className="admin-btn admin-btn-secondary admin-btn-sm">
                      Cancel
                    </button>
                    <button onClick={addContentBlock} className="admin-btn admin-btn-primary admin-btn-sm">
                      <Plus size={14} /> Add Block
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { type: 'paragraph', label: 'Paragraph', icon: AlignLeft },
                    { type: 'heading', label: 'Heading', icon: Heading2 },
                    { type: 'quote', label: 'Quote', icon: Quote },
                    { type: 'list', label: 'List', icon: List },
                  ].map((bt) => (
                    <button
                      key={bt.type}
                      onClick={() => { setAddBlockType(bt.type); setNewBlockText(''); setNewBlockItems(['']); }}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                    >
                      <bt.icon size={14} /> {bt.label}
                    </button>
                  ))}
                </div>
              )}
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
            </div>
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
                      <div className="admin-upload-zone-icon"><Upload size={24} /></div>
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
                  value={form.cover_image}
                  onChange={(e) => updateField('cover_image', e.target.value)}
                />
              </div>
            </div>
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
