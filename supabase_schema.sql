-- Supabase Schema Migration

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table (For custom JWT auth)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'General',
    author TEXT DEFAULT 'LbxSuite',
    author_role TEXT DEFAULT 'Team',
    read_time TEXT DEFAULT '5 min read',
    featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    content TEXT,
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Analytics Table
CREATE TABLE IF NOT EXISTS user_analytics (
    id BIGSERIAL PRIMARY KEY,
    element_clicked TEXT,
    page_path TEXT,
    user_agent TEXT,
    viewport_width INTEGER,
    viewport_height INTEGER,
    click_x INTEGER,
    click_y INTEGER,
    ip_address TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON user_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
