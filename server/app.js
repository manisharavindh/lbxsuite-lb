import 'dotenv/config';
import _express from 'express';
import path from 'path';
import _cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

// ESM/CJS interop — Netlify's esbuild may wrap default exports
const express = _express.default || _express;
const cookieParser = _cookieParser.default || _cookieParser;

// Import routes
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
app.post('/api/debug', (req, res) => {
  res.json({
    body: req.body,
    headers: req.headers,
    rawBody: req.rawBody, // if any
    isBase64: req.isBase64Encoded
  });
});

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
