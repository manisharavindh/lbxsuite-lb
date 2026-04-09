import serverless from 'serverless-http';
import _app from '../../server/app.js';
import _db from '../../server/db.js';

// ESM/CJS interop — Netlify's bundler may wrap default exports
const app = _app.default || _app;
const { dbCheck, seedBlogsIfEmpty } = _db.default || _db;

// We run the DB initialization at the top level so it persists across "warm" function calls
let initialized = false;

async function init() {
  if (initialized) return;
  try {
    if (process.env.SUPABASE_URL) {
      await dbCheck();
      await seedBlogsIfEmpty();
    }
    initialized = true;
  } catch (err) {
    console.error('[Netlify Function] Initialization failed:', err.message);
  }
}

// Wrap the app with serverless-http
const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  // Ensure DB is checked before processing the request
  await init();
  
  // Standard serverless-http handler
  return await serverlessHandler(event, context);
};

