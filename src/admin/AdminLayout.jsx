import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BarChart3, Settings,
  LogOut, Menu, X, Plus, ExternalLink
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
            LBXSUITE<span> ADMIN</span>
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
          <Link
            to="/"
            className="admin-sidebar-link"
            target="_blank"
            style={{ fontSize: '12px' }}
          >
            <ExternalLink size={14} />
            View Live Site
          </Link>

          <button onClick={() => setShowLogoutConfirm(true)} className="admin-sidebar-link" style={{ color: 'var(--admin-accent)' }}>
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="admin-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <span className="admin-modal-title">Confirm Sign Out</span>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', lineHeight: 1.6 }}>
                Are you sure you want to sign out of the LBXSUITE admin portal? You will need to enter your credentials to access the dashboard again.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
