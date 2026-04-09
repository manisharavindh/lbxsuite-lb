import 'dotenv/config';
import app from './server/app.js';
import { dbCheck, seedBlogsIfEmpty } from './server/db.js';

const PORT = process.env.PORT || 3000;

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
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Local development server running on http://localhost:${PORT}`);
  });
}

start();

