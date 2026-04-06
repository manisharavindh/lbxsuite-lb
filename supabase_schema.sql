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

-- User Analytics Table (v2 — with granular element data)
CREATE TABLE IF NOT EXISTS user_analytics (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT DEFAULT 'click',
    element_tag TEXT,
    element_id TEXT,
    element_text TEXT,
    element_class TEXT,
    element_clicked TEXT,
    page_path TEXT,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    viewport_width INTEGER,
    viewport_height INTEGER,
    click_x INTEGER,
    click_y INTEGER,
    ip_address TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if table already exists (safe to re-run)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_analytics' AND column_name='event_type') THEN
        ALTER TABLE user_analytics ADD COLUMN event_type TEXT DEFAULT 'click';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_analytics' AND column_name='element_tag') THEN
        ALTER TABLE user_analytics ADD COLUMN element_tag TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_analytics' AND column_name='element_id') THEN
        ALTER TABLE user_analytics ADD COLUMN element_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_analytics' AND column_name='element_text') THEN
        ALTER TABLE user_analytics ADD COLUMN element_text TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_analytics' AND column_name='element_class') THEN
        ALTER TABLE user_analytics ADD COLUMN element_class TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_analytics' AND column_name='page_url') THEN
        ALTER TABLE user_analytics ADD COLUMN page_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_analytics' AND column_name='referrer') THEN
        ALTER TABLE user_analytics ADD COLUMN referrer TEXT;
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON user_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON user_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON user_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_element_tag ON user_analytics(element_tag);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
