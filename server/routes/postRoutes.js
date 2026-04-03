import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import supabase from '../db.js';
import { authMiddleware } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Ensure uploads directory exists for image pipeline fallback
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
});

router.post('/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    const thumbFilename = `thumb-${filename}`;

    // Compress to WebP in memory
    const webpBuffer = await sharp(req.file.buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Create Thumbnail in memory
    const thumbBuffer = await sharp(req.file.buffer)
      .resize(400, 300, { fit: 'cover' })
      .webp({ quality: 70 })
      .toBuffer();

    // Upload to Supabase Storage Bucket 'blog-images'
    const { error: uploadErr } = await supabase.storage
      .from('blog-images')
      .upload(filename, webpBuffer, { contentType: 'image/webp' });
      
    const { error: thumbErr } = await supabase.storage
      .from('blog-images')
      .upload(thumbFilename, thumbBuffer, { contentType: 'image/webp' });

    if (uploadErr || thumbErr) {
        console.error('[Supabase Storage] Error:', uploadErr || thumbErr);
        throw new Error('Supabase bucket upload failed. Ensure "blog-images" bucket exists and is public.');
    }
    
    // Retrieve public URLs
    const { data: publicUrlData } = supabase.storage.from('blog-images').getPublicUrl(filename);
    const { data: thumbUrlData } = supabase.storage.from('blog-images').getPublicUrl(thumbFilename);

    return res.json({
      url: publicUrlData.publicUrl,
      thumbnail: thumbUrlData.publicUrl,
    });
  } catch (err) {
    console.error('[Upload] Error:', err);
    return res.status(500).json({ error: 'Image upload failed' });
  }
});

// GET /api/admin/posts — List all
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('posts').select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data: posts, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const formattedPosts = posts.map(post => ({
        ...post,
        cover_image: post.image_url
    }));

    return res.json({
      posts: formattedPosts,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error('[Posts] List error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/admin/posts/:id — Get single
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Post not found' });
    
    data.cover_image = data.image_url;
    // Parse content JSON if stored as string since supabase handles JSON arrays
    if (typeof data.content === 'string') {
        try { data.content = JSON.parse(data.content); } catch { }
    }
    return res.json(data);
  } catch (err) {
    console.error('[Posts] Get error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/admin/posts — Create
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, slug, excerpt, cover_image, category, author, author_role, read_time, featured, tags, content, status } = req.body;

    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' });

    const payload = {
      title, slug,
      excerpt: excerpt || '',
      image_url: cover_image || '',
      category: category || 'General',
      author: author || 'LbxSuite',
      author_role: author_role || 'Team',
      read_time: read_time || '5 min read',
      featured: featured || false,
      tags: tags || [],
      content: JSON.stringify(content || []),
      status: status || 'draft',
      published_at: status === 'published' ? new Date().toISOString() : null
    };

    const { data, error } = await supabase.from('posts').insert([payload]).select().single();
    if (error) {
        if (error.code === '23505') return res.status(400).json({ error: 'A post with this slug already exists' });
        throw error;
    }

    if (data.featured) {
        await supabase.from('posts').update({ featured: false }).neq('id', data.id).eq('featured', true);
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('[Posts] Create error:', err.message);
    return res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/admin/posts/:id — Update
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, slug, excerpt, cover_image, category, author, author_role, read_time, featured, tags, content, status } = req.body;

    const payload = {};
    if (title !== undefined) payload.title = title;
    if (slug !== undefined) payload.slug = slug;
    if (excerpt !== undefined) payload.excerpt = excerpt;
    if (cover_image !== undefined) payload.image_url = cover_image;
    if (category !== undefined) payload.category = category;
    if (author !== undefined) payload.author = author;
    if (author_role !== undefined) payload.author_role = author_role;
    if (read_time !== undefined) payload.read_time = read_time;
    if (featured !== undefined) payload.featured = featured;
    if (tags !== undefined) payload.tags = tags;
    if (content !== undefined) payload.content = JSON.stringify(content);
    
    if (status !== undefined) {
        payload.status = status;
        if (status === 'published') payload.published_at = new Date().toISOString();
    }
    
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('posts').update(payload).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: 'Post not found or update error' });

    if (data.featured) {
        await supabase.from('posts').update({ featured: false }).neq('id', data.id).eq('featured', true);
    }

    return res.json(data);
  } catch (err) {
    console.error('[Posts] Update error:', err.message);
    return res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/admin/posts/:id — Delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').delete().eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: 'Post not found' });
    return res.json({ success: true, id: data.id });
  } catch (err) {
    console.error('[Posts] Delete error:', err.message);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ====== PUBLIC ROUTES ======

router.get('/public/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, slug, title, excerpt, image_url, category, author, author_role, read_time, featured, tags, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    
    const formattedData = data.map(post => ({
        ...post,
        cover_image: post.image_url
    }));
    return res.json(formattedData);
  } catch (err) {
    console.error('[Posts] Public list error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/public/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('status', 'published')
      .single();
      
    if (error || !data) return res.status(404).json({ error: 'Post not found' });
    
    data.cover_image = data.image_url;
    if (typeof data.content === 'string') {
        try { data.content = JSON.parse(data.content); } catch { }
    }
    return res.json(data);
  } catch (err) {
    console.error('[Posts] Public get error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch post' });
  }
});

export default router;
