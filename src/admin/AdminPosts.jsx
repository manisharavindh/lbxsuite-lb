import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Trash2, Edit3, Eye, MoreHorizontal,
  FileText, Filter, ChevronLeft, ChevronRight, Download, Upload
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { postsAPI } from './api';

const AdminPosts = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const limit = 10;

  useEffect(() => {
    loadPosts();
  }, [page, status, search]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (status !== 'all') params.status = status;
      if (search) params.search = search;
      const data = await postsAPI.list(params);
      setPosts(data.posts || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Load posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await postsAPI.delete(id);
      setPosts(posts.filter(p => p.id !== id));
      setTotal(t => t - 1);
      addToast('Post deleted successfully', 'success');
    } catch (err) {
      addToast('Failed to delete post', 'error');
    }
    setDeleteId(null);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await postsAPI.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lbxsuite_blog_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Data exported successfully', 'success');
    } catch (err) {
      addToast('Failed to export data', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('Invalid format: expected array');
      
      const result = await postsAPI.importData(data);
      addToast(`Successfully imported ${result.count} posts`, 'success');
      loadPosts(); // Refresh the list
    } catch (err) {
      console.error(err);
      addToast('Failed to import data: ' + err.message, 'error');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout
      user={user}
      onLogout={onLogout}
      title="Blog Posts"
      subtitle={`${total} post${total !== 1 ? 's' : ''} total`}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExport} disabled={exporting} className="admin-btn admin-btn-secondary admin-btn-sm" title="Download all posts as JSON">
            {exporting ? <div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: '2px' }} /> : <Download size={14} />} {exporting ? 'Exporting...' : 'Export'}
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            style={{ display: 'none' }} 
          />
          <button onClick={() => fileInputRef.current?.click()} disabled={importing} className="admin-btn admin-btn-secondary admin-btn-sm" title="Upload posts from JSON">
            {importing ? <div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: '2px' }} /> : <Upload size={14} />} {importing ? 'Importing...' : 'Import'}
          </button>

          <Link to="/admin/posts/new" className="admin-btn admin-btn-primary admin-btn-sm">
            <Plus size={14} /> New Post
          </Link>
        </div>
      }
    >
      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)',
            }}
          />
          <input
            type="text"
            className="admin-input"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: '34px' }}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'draft', 'published'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`admin-btn admin-btn-sm ${status === s ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-card-body">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="admin-skeleton" style={{ height: '48px', marginBottom: '8px' }} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <Link
                          to={`/admin/posts/${post.id}`}
                          style={{
                            color: 'var(--admin-text)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                        >
                          {post.title}
                        </Link>
                        {post.featured && (
                          <span className="admin-badge admin-badge-accent" style={{ marginLeft: '8px', fontSize: '9px' }}>
                            Featured
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '12px' }}>{post.category}</span>
                      </td>
                      <td>
                        <span className={`admin-badge ${post.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                          {post.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>{post.author}</td>
                      <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => navigate(`/admin/posts/${post.id}`)}
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          {post.status === 'published' && (
                            <Link
                              to={`/blog/${post.slug}`}
                              target="_blank"
                              className="admin-btn admin-btn-ghost admin-btn-sm"
                              title="View"
                            >
                              <Eye size={14} />
                            </Link>
                          )}
                          <button
                            onClick={() => setDeleteId(post.id)}
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            title="Delete"
                            style={{ color: 'var(--admin-accent)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderTop: '1px solid var(--admin-border)',
                fontSize: '12px',
                color: 'var(--admin-text-muted)',
              }}>
                <span>
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="admin-empty">
            <div className="admin-empty-icon"><FileText size={20} /></div>
            <p className="admin-empty-title">No posts found</p>
            <p className="admin-empty-text">
              {search || status !== 'all'
                ? 'Try adjusting your filters.'
                : 'Create your first blog post to get started.'}
            </p>
            {!search && status === 'all' && (
              <Link to="/admin/posts/new" className="admin-btn admin-btn-primary admin-btn-sm" style={{ marginTop: '16px' }}>
                <Plus size={14} /> Create Post
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">Delete Post</span>
              <button onClick={() => setDeleteId(null)} className="admin-btn admin-btn-ghost admin-btn-sm">✕</button>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', lineHeight: 1.6 }}>
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setDeleteId(null)} className="admin-btn admin-btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="admin-btn admin-btn-danger">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="admin-toast-wrapper">
        {toasts.map(t => (
          <div key={t.id} className={`admin-toast admin-toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminPosts;
