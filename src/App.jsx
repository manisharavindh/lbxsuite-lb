import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import GiveawaysPage from './pages/GiveawaysPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import { initClickTracking } from './utils/uiUtils';

// Lazy-load admin to keep the main bundle lean
const AdminApp = lazy(() => import('./admin/AdminApp'));

const AdminLoader = () => (
  <div style={{
    minHeight: '100vh',
    background: '#0a0a0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid rgba(255,255,255,0.06)',
        borderTopColor: '#FF5555',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
        margin: '0 auto 16px',
      }} />
      <p style={{ fontSize: '13px', color: '#71717a', fontFamily: 'Inter, sans-serif' }}>
        Loading admin...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    const cleanup = initClickTracking();
    return cleanup;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/giveaways" element={<GiveawaysPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsConditionsPage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
