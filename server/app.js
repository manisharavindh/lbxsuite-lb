import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

// Import routes — use .default fallback for ESM/CJS interop (Netlify bundles as CJS)
import _authRoutes from './routes/authRoutes.js';
import _postRoutes from './routes/postRoutes.js';
import _analyticsRoutes from './routes/analyticsRoutes.js';
const authRoutes = _authRoutes.default || _authRoutes;
const postRoutes = _postRoutes.default || _postRoutes;
const analyticsRoutes = _analyticsRoutes.default || _analyticsRoutes;

// Resolve current directory — works in both ESM (local dev) and CJS (Netlify bundle)
const _currentDir = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/posts', postRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/analytics', analyticsRoutes); // Public tracking endpoint

// SPA fallback for local dev (Netlify handles this via redirects in production)
if (process.env.NODE_ENV !== 'production') {
  // Adjusted path since we are now inside /server
  app.use(express.static(path.join(_currentDir, '../dist')));
  app.get('*splat', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(_currentDir, '../dist', 'index.html'));
  });
}

export default app;
