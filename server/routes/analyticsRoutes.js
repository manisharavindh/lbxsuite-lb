import { Router } from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../auth.js';

const router = Router();

// ===== PUBLIC TRACKING ENDPOINTS =====

// Track single event
router.post('/track', async (req, res) => {
  try {
    const {
      event_type = 'click',
      element_tag, element_id, element_text, element_class,
      element_name,
      page_url, page_path, referrer,
      viewport_width, viewport_height,
      click_x, click_y,
      session_id,
    } = req.body;

    const ip_address = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const user_agent = req.headers['user-agent'];

    // Keep legacy element_clicked for backwards compat
    const element_clicked = [element_tag, element_id ? `#${element_id}` : '', element_text ? `"${element_text.substring(0, 30)}"` : ''].filter(Boolean).join(' ');

    const { error } = await supabase.from('user_analytics').insert([{
      event_type,
      element_tag: element_tag || null,
      element_id: element_id || null,
      element_text: element_text ? element_text.substring(0, 200) : null,
      element_class: element_class ? element_class.substring(0, 300) : null,
      element_clicked,
      element_name: element_name ? element_name.substring(0, 200) : null,
      page_path: page_path || '/',
      page_url: page_url || null,
      referrer: referrer || null,
      user_agent,
      viewport_width: viewport_width || null,
      viewport_height: viewport_height || null,
      click_x: click_x != null ? click_x : null,
      click_y: click_y != null ? click_y : null,
      ip_address,
      session_id: session_id || null,
    }]);

    if (error) throw error;
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('[Analytics] Track error:', err.message);
    return res.status(500).json({ error: 'Failed to track event' });
  }
});

// Track batch events
router.post('/track-batch', async (req, res) => {
  try {
    const { events } = req.body;
    if (!Array.isArray(events) || events.length === 0) return res.status(400).json({ error: 'Events array required' });

    const ip_address = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    const user_agent = req.headers['user-agent'];

    const payload = events.slice(0, 50).map(evt => {
      const element_clicked = [evt.element_tag, evt.element_id ? `#${evt.element_id}` : '', evt.element_text ? `"${evt.element_text.substring(0, 30)}"` : ''].filter(Boolean).join(' ');
      return {
        event_type: evt.event_type || 'click',
        element_tag: evt.element_tag || null,
        element_id: evt.element_id || null,
        element_text: evt.element_text ? evt.element_text.substring(0, 200) : null,
        element_class: evt.element_class ? evt.element_class.substring(0, 300) : null,
        element_clicked,
        element_name: evt.element_name ? evt.element_name.substring(0, 200) : null,
        page_path: evt.page_path || '/',
        page_url: evt.page_url || null,
        referrer: evt.referrer || null,
        user_agent,
        viewport_width: evt.viewport_width || null,
        viewport_height: evt.viewport_height || null,
        click_x: evt.click_x != null ? evt.click_x : null,
        click_y: evt.click_y != null ? evt.click_y : null,
        ip_address,
        session_id: evt.session_id || null,
      };
    });

    const { error } = await supabase.from('user_analytics').insert(payload);

    if (error) throw error;
    return res.status(201).json({ success: true, count: payload.length });
  } catch (err) {
    console.error('[Analytics] Batch track error:', err.message);
    return res.status(500).json({ error: 'Failed to track events' });
  }
});

// ===== ADMIN DASHBOARD ANALYTICS (protected) =====

router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Fetch all analytics rows for the period
    const { data: rows, error } = await supabase
      .from('user_analytics')
      .select('event_type, page_path, session_id, click_x, created_at, element_name')
      .gte('created_at', since)
      .order('created_at', { ascending: true })
      .limit(10000);

    if (error) throw error;

    const analytics = rows || [];

    // Split by event type
    const clicks = analytics.filter(r => r.event_type === 'click');
    const pageviews = analytics.filter(r => r.event_type === 'pageview');
    const scrollEvents = analytics.filter(r => r.event_type === 'scroll_depth');
    const totalClicks = clicks.length;
    const totalPageviews = pageviews.length;

    // Unique visitors by session_id
    const uniqueSessions = new Set(analytics.map(r => r.session_id).filter(Boolean));
    const uniqueVisitors = uniqueSessions.size || (analytics.length > 0 ? 1 : 0);

    // Clicks by day
    const dayMap = {};
    clicks.forEach(row => {
      const date = new Date(row.created_at).toISOString().split('T')[0];
      dayMap[date] = (dayMap[date] || 0) + 1;
    });
    const clicksByDay = Object.entries(dayMap).map(([date, count]) => ({ date, clicks: String(count) }));

    // Pageviews by day
    const pvDayMap = {};
    pageviews.forEach(row => {
      const date = new Date(row.created_at).toISOString().split('T')[0];
      pvDayMap[date] = (pvDayMap[date] || 0) + 1;
    });
    const pageviewsByDay = Object.entries(pvDayMap).map(([date, count]) => ({ date, views: String(count) }));

    // Clicks by hour (UTC)
    const hourMap = {};
    clicks.forEach(row => {
      const hour = new Date(row.created_at).getUTCHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });
    const clicksByHour = Object.entries(hourMap).map(([hour, count]) => ({ hour: String(hour), clicks: String(count) }));

    // Top pages (combine clicks + pageviews)
    const pageMap = {};
    analytics.forEach(row => {
      const path = row.page_path || '/';
      if (!pageMap[path]) pageMap[path] = { clicks: 0, pageviews: 0 };
      if (row.event_type === 'click') pageMap[path].clicks++;
      else if (row.event_type === 'pageview') pageMap[path].pageviews++;
    });
    const topPages = Object.entries(pageMap)
      .map(([page_path, data]) => ({ page_path, clicks: String(data.clicks), pageviews: String(data.pageviews) }))
      .sort((a, b) => (parseInt(b.clicks) + parseInt(b.pageviews)) - (parseInt(a.clicks) + parseInt(a.pageviews)))
      .slice(0, 20);

    // Avg scroll depth per page
    const scrollMap = {};
    scrollEvents.forEach(row => {
      const path = row.page_path || '/';
      if (!scrollMap[path]) scrollMap[path] = [];
      const depth = row.click_y; // scroll depth stored in click_y
      if (depth != null) scrollMap[path].push(depth);
    });
    const scrollDepthByPage = Object.entries(scrollMap)
      .map(([page_path, depths]) => ({
        page_path,
        avg_depth: Math.round(depths.reduce((a, b) => a + b, 0) / depths.length),
        max_depth: Math.max(...depths),
        samples: depths.length,
      }))
      .sort((a, b) => b.samples - a.samples)
      .slice(0, 20);

    // Top named elements (elements with data-track names)
    const namedMap = {};
    clicks.forEach(row => {
      const name = row.element_name;
      if (name && !name.startsWith('a:') && !name.startsWith('button:') && !name.startsWith('div:') && !name.startsWith('span:')) {
        if (!namedMap[name]) namedMap[name] = 0;
        namedMap[name]++;
      }
    });
    const topNamedElements = Object.entries(namedMap)
      .map(([name, count]) => ({ name, clicks: String(count) }))
      .sort((a, b) => parseInt(b.clicks) - parseInt(a.clicks))
      .slice(0, 20);

    return res.json({
      totalClicks,
      totalPageviews,
      uniqueVisitors,
      topPages,
      clicksByDay,
      pageviewsByDay,
      clicksByHour,
      scrollDepthByPage,
      topNamedElements,
    });
  } catch (err) {
    console.error('[Analytics] Overview error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.get('/clicks', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = (page - 1) * limit;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const eventType = req.query.event_type || null;
    const pagePath = req.query.page_path || null;

    let query = supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    if (pagePath) {
      query = query.eq('page_path', pagePath);
    }

    const { data: clicks, error } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    // Map fields, handling both old schema and new schema
    const formatted = (clicks || []).map(c => ({
      element_tag: c.element_tag || c.element_clicked?.split(' ')[0] || '?',
      element_id: c.element_id || null,
      element_text: c.element_text || c.element_clicked || '—',
      element_class: c.element_class || null,
      element_name: c.element_name || null,
      page_path: c.page_path || '/',
      page_url: c.page_url || null,
      click_x: c.click_x,
      click_y: c.click_y,
      viewport_width: c.viewport_width,
      viewport_height: c.viewport_height,
      session_id: c.session_id,
      event_type: c.event_type || 'click',
      referrer: c.referrer || null,
      user_agent: c.user_agent || null,
      ip_address: c.ip_address || null,
      created_at: c.created_at,
    }));

    return res.json({ clicks: formatted });
  } catch (err) {
    console.error('[Analytics] Clicks error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch clicks' });
  }
});

router.get('/top-elements', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Fetch click events (not pageviews)
    const { data: rows, error } = await supabase
      .from('user_analytics')
      .select('element_tag, element_id, element_text, element_clicked, element_name, page_path')
      .gte('created_at', since)
      .eq('event_type', 'click')
      .not('element_tag', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5000);

    if (error) throw error;

    // Group by element — prefer element_name for grouping
    const elementMap = {};
    (rows || []).forEach(row => {
      const tag = row.element_tag || row.element_clicked?.split(' ')[0] || 'unknown';
      const name = row.element_name || null;
      const id = row.element_id || '';
      const text = (row.element_text || row.element_clicked || '').substring(0, 50);

      // Use element_name as primary key if available, else fall back to tag|id|text combo
      const key = name
        ? `name:${name}|${row.page_path || '/'}`
        : `${tag}|${id}|${text}|${row.page_path || '/'}`;

      if (!elementMap[key]) {
        elementMap[key] = {
          element: name || (id ? `${tag}#${id}` : (text ? `${tag} "${text.substring(0, 40)}"` : tag)),
          element_tag: tag,
          element_id: id || null,
          element_text: text || null,
          element_name: name,
          page_path: row.page_path || '/',
          clicks: 0,
        };
      }
      elementMap[key].clicks++;
    });

    const elements = Object.values(elementMap)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 50)
      .map(el => ({ ...el, clicks: String(el.clicks) }));

    return res.json({ elements });
  } catch (err) {
    console.error('[Analytics] Top elements error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch top elements' });
  }
});

router.get('/heatmap', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const pagePath = req.query.page || '/';
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data: rows, error } = await supabase
      .from('user_analytics')
      .select('click_x, click_y, viewport_width, viewport_height')
      .eq('page_path', pagePath)
      .gte('created_at', since)
      .not('click_x', 'is', null)
      .not('click_y', 'is', null)
      .limit(2000);

    if (error) throw error;

    const points = (rows || []).map(r => ({
      x: r.click_x,
      y: r.click_y,
      vw: r.viewport_width,
      vh: r.viewport_height,
    }));

    return res.json({ points });
  } catch (err) {
    console.error('[Analytics] Heatmap error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch heatmap' });
  }
});

// Get unique sessions with decoded details
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data: rows, error } = await supabase
      .from('user_analytics')
      .select('session_id, page_path, event_type, created_at, user_agent, ip_address, viewport_width, viewport_height')
      .gte('created_at', since)
      .not('session_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5000);

    if (error) throw error;

    // Group by session
    const sessionMap = {};
    (rows || []).forEach(row => {
      const sid = row.session_id;
      if (!sessionMap[sid]) {
        sessionMap[sid] = {
          session_id: sid,
          first_seen: row.created_at,
          last_seen: row.created_at,
          pages: new Set(),
          clicks: 0,
          pageviews: 0,
          user_agent: row.user_agent,
          ip_address: row.ip_address,
          viewport: row.viewport_width ? `${row.viewport_width}×${row.viewport_height}` : null,
        };
      }
      const session = sessionMap[sid];
      if (new Date(row.created_at) < new Date(session.first_seen)) session.first_seen = row.created_at;
      if (new Date(row.created_at) > new Date(session.last_seen)) session.last_seen = row.created_at;
      session.pages.add(row.page_path);
      if (row.event_type === 'click') session.clicks++;
      if (row.event_type === 'pageview') session.pageviews++;
    });

    const sessions = Object.values(sessionMap)
      .map(s => ({
        ...s,
        pages: Array.from(s.pages),
        page_count: s.pages.size,
        duration_seconds: Math.round((new Date(s.last_seen) - new Date(s.first_seen)) / 1000),
      }))
      .sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen))
      .slice(0, 100);

    return res.json({ sessions });
  } catch (err) {
    console.error('[Analytics] Sessions error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

export default router;
