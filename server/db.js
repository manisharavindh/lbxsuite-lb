import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';

// Singleton instance to ensure connection pooling logic within the application
let supabaseInstance = null;

export function getSupabase() {
  if (!supabaseInstance) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.warn('[DB] Warning: SUPABASE_URL or SUPABASE_KEY environment variable is missing.');
    }
    supabaseInstance = createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_KEY || 'placeholder_key'
    );
  }
  return supabaseInstance;
}

const supabase = getSupabase();

export async function dbCheck() {
  try {
    // Verify connection and table reachability
    const { error } = await supabase.from('posts').select('id').limit(1);
    
    if (error) {
      console.error('[DB] Verification error - Check if tables exist:', error.message);
      return false;
    }
    
    // Always sync the admin credentials with the current Environment Variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Only attempt admin user modifications if credentials explicitly exist via ENV
    if (adminUsername && adminPassword) {
      const hash = await bcryptjs.hash(adminPassword, 12);

      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', adminUsername)
        .maybeSingle();

      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([{ username: adminUsername, password_hash: hash }]);
          
        if (insertError) {
          console.error('[DB] Failed to prepare default admin user:', insertError.message);
        } else {
          console.log(`[DB] Admin user '${adminUsername}' prepared successfully.`);
        }
      } else {
        // Force update to guarantee ENV password works if they changed it in Render panel
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ password_hash: hash })
          .eq('id', existingUser.id);
          
        if (updateError) {
          console.error('[DB] Failed to sync admin password change:', updateError.message);
        }
      }
    } else {
      console.warn('[DB] Warning: ADMIN_USERNAME or ADMIN_PASSWORD missing from ENV. Skipping admin sync.');
    }

    console.log('[DB] Supabase connection and tables verified active.');
    return true;
  } catch (err) {
    console.error('[DB] Verification exception caught:', err.message);
    return false;
  }
}

export default supabase;
