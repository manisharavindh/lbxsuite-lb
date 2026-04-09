import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import _supabase from './db.js';
const supabase = _supabase.default || _supabase;

const JWT_SECRET = process.env.JWT_SECRET || 'lbxsuite-admin-secret-change-me';
const TOKEN_EXPIRY = '24h';

export async function login(username, password) {
  console.log(`[Auth] Attempting login for user: ${username}`);
  const { data: user, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error(`[Auth] Supabase query error:`, error.message, error.details || '');
    return null;
  }
  
  if (!user) {
    console.error(`[Auth] User not found in 'admin_users' table inside Supabase`);
    return null;
  }

  const valid = await bcryptjs.compare(password, user.password_hash);
  if (!valid) {
    console.error(`[Auth] User found, but bcrypt password hash validation failed.`);
    return null;
  }

  console.log(`[Auth] Login successful for user: ${username}`);
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  return { token, user: { id: user.id, username: user.username } };
}

export function authMiddleware(req, res, next) {
  const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
