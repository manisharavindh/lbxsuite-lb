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
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }
  return supabaseInstance;
}

const supabase = getSupabase();

export async function dbCheck() {
  try {
    // Moved posts table verification below to prevent it from aborting the admin loop

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

    // Verify connection and posts table reachability explicitly at the end
    const { error: postsError } = await supabase.from('posts').select('id').limit(1);
    if (postsError) {
      console.error('[DB] Posts Verification error - Check if tables exist:', postsError.message);
      return false;
    }

    console.log('[DB] Supabase connection and tables verified active.');
    return true;
  } catch (err) {
    console.error('[DB] Verification exception caught:', err.message);
    return false;
  }
}

export async function seedBlogsIfEmpty() {
  try {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[DB] Failed to count posts for seeding:', error.message);
      return;
    }

    if (count === 0) {
      console.log('[DB] Posts table is empty. Seeding initial data...');
      
      // Dynamic import to avoid issues if file path changes
      const { default: blogPosts } = await import('../src/data/blogPosts.js');
      
      for (const post of blogPosts) {
        const payload = {
            title: post.title,
            slug: post.id,
            excerpt: post.excerpt,
            image_url: post.coverImage,
            category: post.category,
            author: post.author,
            author_role: post.authorRole,
            read_time: post.readTime,
            featured: post.featured,
            tags: post.tags || [],
            content: JSON.stringify(post.content || []),
            status: 'published',
            // Try to parse the date string or fallback
            published_at: new Date(post.date).toISOString()
        };
        
        await supabase.from('posts').upsert(payload, { onConflict: 'slug' });
      }
      console.log('[DB] Successfully seeded initial blog posts.');
    }
  } catch (err) {
    console.error('[DB] Error during blog seeding:', err.message);
  }
}

export default supabase;
