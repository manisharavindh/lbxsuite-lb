import { Router } from 'express';
import { login } from '../auth.js';

const router = Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await login(username, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set httpOnly cookie
    res.cookie('admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.json({ user: result.user });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  return res.json({ success: true });
});

// GET /api/admin/me — check if authenticated
router.get('/me', async (req, res) => {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'lbxsuite-admin-secret-change-me';
    const decoded = jwt.default.verify(token, JWT_SECRET);
    return res.json({ user: { id: decoded.id, username: decoded.username } });
  } catch {
    res.clearCookie('admin_token');
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
