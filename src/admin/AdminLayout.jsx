import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BarChart3, Settings,
  LogOut, Menu, X, ChevronRight, Plus
} from 'lucide-react';
import { authAPI } from './api';
import './admin.css';

const navItems = [
  {
    section: 'Overview',
    links: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Content',
    links: [
      { label: 'Blog Posts', href: '/admin/posts', icon: FileText },
      { label: 'New Post', href: '/admin/posts/new', icon: Plus },
    ],
  },
  {
    section: 'Insights',
    links: [
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
];

const AdminLayout = ({ user, onLogout, children, title, subtitle, actions }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }
    onLogout();
    navigate('/admin/login');
  };

  const isActive = (href) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-brand">
            LBXSUITE <span>Admin</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section} className="admin-sidebar-section">
              <div className="admin-sidebar-section-title">{section.section}</div>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`admin-sidebar-link ${isActive(link.href) ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--admin-accent-bg)',
              border: '1px solid var(--admin-accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--admin-accent)',
              fontSize: '12px',
              fontWeight: '700',
            }}>
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--admin-text)' }}>
                {user?.username || 'Admin'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                Administrator
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="admin-sidebar-link"
            target="_blank"
            style={{ fontSize: '12px' }}
          >
            <ChevronRight size={14} />
            View Live Site
          </Link>

          <button onClick={handleLogout} className="admin-sidebar-link" style={{ color: 'var(--admin-accent)' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h1 className="admin-topbar-title">{title || 'Dashboard'}</h1>
              {subtitle && <p className="admin-topbar-subtitle">{subtitle}</p>}
            </div>
          </div>
          {actions && <div style={{ display: 'flex', gap: '8px' }}>{actions}</div>}
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
