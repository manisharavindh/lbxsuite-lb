import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminPosts from './AdminPosts';
import AdminPostEditor from './AdminPostEditor';
import AdminAnalytics from './AdminAnalytics';
import { authAPI } from './api';
import './admin.css';

const AdminApp = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authAPI.me();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (checking) {
    return (
      <div className="admin-loading-page">
        <div style={{ textAlign: 'center' }}>
          <div className="admin-spinner admin-spinner-lg" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', fontFamily: 'var(--admin-font)' }}>
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
      <Route path="/posts" element={<AdminPosts user={user} onLogout={handleLogout} />} />
      <Route path="/posts/new" element={<AdminPostEditor user={user} onLogout={handleLogout} />} />
      <Route path="/posts/:id" element={<AdminPostEditor user={user} onLogout={handleLogout} />} />
      <Route path="/analytics" element={<AdminAnalytics user={user} onLogout={handleLogout} />} />
      <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminApp;
