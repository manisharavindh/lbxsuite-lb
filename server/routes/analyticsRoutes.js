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

    // Fetch all analytics rows for the period (select only needed columns to reduce payload)
    const { data: rows, error } = await supabase
      .from('user_analytics')
      .select('page_path, session_id, click_x, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true })
      .limit(10000);

    if (error) throw error;

    const analytics = rows || [];
    const totalClicks = analytics.length;

    // Unique visitors by session_id
    const uniqueSessions = new Set(analytics.map(r => r.session_id).filter(Boolean));
    const uniqueVisitors = uniqueSessions.size || (totalClicks > 0 ? 1 : 0);

    // Clicks by day
    const dayMap = {};
    analytics.forEach(row => {
      const date = new Date(row.created_at).toISOString().split('T')[0];
      dayMap[date] = (dayMap[date] || 0) + 1;
    });
    const clicksByDay = Object.entries(dayMap).map(([date, clicks]) => ({ date, clicks: String(clicks) }));

    // Clicks by hour (UTC)
    const hourMap = {};
    analytics.forEach(row => {
      const hour = new Date(row.created_at).getUTCHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });
    const clicksByHour = Object.entries(hourMap).map(([hour, clicks]) => ({ hour: String(hour), clicks: String(clicks) }));

    // Top pages
    const pageMap = {};
    analytics.forEach(row => {
      const path = row.page_path || '/';
      pageMap[path] = (pageMap[path] || 0) + 1;
    });
    const topPages = Object.entries(pageMap)
      .map(([page_path, clicks]) => ({ page_path, clicks: String(clicks) }))
      .sort((a, b) => parseInt(b.clicks) - parseInt(a.clicks))
      .slice(0, 20);

    return res.json({
      totalClicks,
      uniqueVisitors,
      topPages,
      clicksByDay,
      clicksByHour,
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

    const { data: clicks, error } = await supabase
      .from('user_analytics')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Map fields, handling both old schema (element_clicked only) and new schema (granular fields)
    const formatted = (clicks || []).map(c => ({
      element_tag: c.element_tag || c.element_clicked?.split(' ')[0] || '?',
      element_id: c.element_id || null,
      element_text: c.element_text || c.element_clicked || '—',
      element_class: c.element_class || null,
      page_path: c.page_path || '/',
      page_url: c.page_url || null,
      click_x: c.click_x,
      click_y: c.click_y,
      viewport_width: c.viewport_width,
      viewport_height: c.viewport_height,
      session_id: c.session_id,
      event_type: c.event_type || 'click',
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
      .select('element_tag, element_id, element_text, element_clicked, page_path')
      .gte('created_at', since)
      .not('element_tag', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5000);

    if (error) throw error;

    // Group by element identifier (tag + id + text combo)
    const elementMap = {};
    (rows || []).forEach(row => {
      // Build a unique key for this element
      const tag = row.element_tag || row.element_clicked?.split(' ')[0] || 'unknown';
      const id = row.element_id || '';
      const text = (row.element_text || row.element_clicked || '').substring(0, 50);
      const key = `${tag}|${id}|${text}|${row.page_path || '/'}`;

      if (!elementMap[key]) {
        elementMap[key] = {
          element: id ? `${tag}#${id}` : (text ? `${tag} "${text.substring(0, 40)}"` : tag),
          element_tag: tag,
          element_id: id || null,
          element_text: text || null,
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

export default router;
