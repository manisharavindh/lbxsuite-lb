import 'dotenv/config';
import supabase, { dbCheck } from './server/db.js';
import blogPosts from './src/data/blogPosts.js';

async function migrate() {
    console.log("Starting migration...");
    await dbCheck();
    
    for (const post of blogPosts) {
        // Only set fields that exist in the database schema or map them correctly
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
            // Try to parse the date string (e.g., "March 20, 2026")
            published_at: new Date(post.date).toISOString()
        };
        
        console.log(`Inserting: ${post.id}`);
        const { data, error } = await supabase.from('posts').upsert(payload, { onConflict: 'slug' }).select();
        if (error) {
            console.error(`Error inserting ${post.id}:`, error);
        } else {
            console.log(`Success: ${post.id}`);
        }
    }
    console.log("Migration complete.");
    process.exit(0);
}

migrate();
