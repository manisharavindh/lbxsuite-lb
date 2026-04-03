import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dbCheck, seedBlogsIfEmpty } from './server/db.js';
import authRoutes from './server/routes/authRoutes.js';
import postRoutes from './server/routes/postRoutes.js';
import analyticsRoutes from './server/routes/analyticsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/posts', postRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/analytics', analyticsRoutes); // Public tracking endpoint

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback — serve index.html for all non-file routes
// This handles client-side routing (react-router-dom)
app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize database then start server
async function start() {
  try {
    if (process.env.SUPABASE_URL) {
      await dbCheck();
      await seedBlogsIfEmpty();
    } else {
      console.log('[Server] No SUPABASE_URL found — running without database.');
    }
  } catch (err) {
    console.error('[Server] Database init failed:', err.message);
    // Continue running — the app should still serve the frontend
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
