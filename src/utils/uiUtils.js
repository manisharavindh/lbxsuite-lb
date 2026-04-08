// Click tracking utility — drops into the main site to record user interactions
// Sends click events to /api/analytics/track with batching for performance
// Tracks: clicks, page views, scroll depth, and form interactions

const SESSION_KEY = 'lbx_session_id';
const BATCH_SIZE = 5;
const FLUSH_INTERVAL = 10000; // 10 seconds

let eventQueue = [];
let flushTimer = null;
let scrollTimer = null;
let maxScrollDepth = 0;

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getElementText(el) {
  // Try innerText first for better accuracy, then textContent
  const text = (el.innerText || el.textContent || '').trim();
  if (text && text.length <= 100) return text;
  if (text) return text.substring(0, 100) + '…';
  return el.getAttribute('aria-label') || el.getAttribute('alt') || el.getAttribute('title') || '';
}

/**
 * Build a meaningful, human-readable element name.
 * Priority: data-track > id > aria-label > inferred from context
 */
function getElementName(el) {
  // 1. Explicit data-track attribute (highest priority)
  const trackName = el.getAttribute('data-track');
  if (trackName) return trackName;

  // 2. Walk up to find nearest data-track in parents (for deeply nested clicks)
  let parent = el.parentElement;
  let depth = 0;
  while (parent && depth < 5) {
    const parentTrack = parent.getAttribute('data-track');
    if (parentTrack) return parentTrack;
    parent = parent.parentElement;
    depth++;
  }

  // 3. Use id if available
  if (el.id) return el.id;

  // 4. Build from tag + text
  const tag = el.tagName?.toLowerCase() || 'unknown';
  const text = getElementText(el);
  if (text && text.length <= 50) return `${tag}: ${text}`;

  return tag;
}

function getElementIdentifier(el) {
  const tag = el.tagName?.toLowerCase() || 'unknown';
  const id = el.id || null;
  const classes = el.className?.toString() || '';
  const name = getElementName(el);

  // For links, include the href
  if (tag === 'a' && el.href) {
    try {
      const url = new URL(el.href);
      return { tag, id, href: url.pathname + url.hash, name };
    } catch {
      return { tag, id, href: el.getAttribute('href'), name };
    }
  }

  return { tag, id, name };
}

function flushQueue() {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];

  const payload = JSON.stringify({ events });
  
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    const sent = navigator.sendBeacon('/api/analytics/track-batch', blob);
    if (!sent) {
      fetch('/api/analytics/track-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } else {
    fetch('/api/analytics/track-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

function trackClick(event) {
  // Don't track clicks on admin pages
  if (window.location.pathname.startsWith('/admin')) return;

  // Find the nearest interactive element or tracked element
  const el = event.target.closest(
    '[data-track], a, button, [role="button"], input[type="submit"], nav, .nav-link, .anim-btn'
  ) || event.target;

  const { tag, id, href, name } = getElementIdentifier(el);

  const data = {
    event_type: 'click',
    element_tag: tag,
    element_id: id,
    element_text: getElementText(el),
    element_class: el.className?.toString()?.substring(0, 200) || null,
    element_name: name,
    page_url: window.location.href,
    page_path: window.location.pathname,
    referrer: document.referrer || null,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    click_x: Math.round(event.clientX),
    click_y: Math.round(event.clientY),
    session_id: getSessionId(),
  };

  eventQueue.push(data);

  if (eventQueue.length >= BATCH_SIZE) {
    flushQueue();
  }
}

function trackPageView() {
  if (window.location.pathname.startsWith('/admin')) return;

  const data = {
    event_type: 'pageview',
    element_tag: 'page',
    element_id: null,
    element_text: document.title,
    element_class: null,
    element_name: `Page: ${window.location.pathname}`,
    page_url: window.location.href,
    page_path: window.location.pathname,
    referrer: document.referrer || null,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    click_x: null,
    click_y: null,
    session_id: getSessionId(),
  };

  eventQueue.push(data);
  flushQueue();
}

function trackScrollDepth() {
  if (window.location.pathname.startsWith('/admin')) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  ) - window.innerHeight;
  
  if (docHeight <= 0) return;

  const depth = Math.min(100, Math.round((scrollTop / docHeight) * 100));

  if (depth > maxScrollDepth) {
    maxScrollDepth = depth;
  }
}

function sendScrollDepth() {
  if (maxScrollDepth <= 0 || window.location.pathname.startsWith('/admin')) return;

  const data = {
    event_type: 'scroll_depth',
    element_tag: 'page',
    element_id: null,
    element_text: `${maxScrollDepth}%`,
    element_class: null,
    element_name: `Scroll Depth: ${maxScrollDepth}%`,
    page_url: window.location.href,
    page_path: window.location.pathname,
    referrer: null,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    click_x: null,
    click_y: maxScrollDepth,
    session_id: getSessionId(),
  };

  eventQueue.push(data);
  maxScrollDepth = 0;
}

export function initClickTracking() {
  // Don't track on admin pages — but always return a valid cleanup function
  if (window.location.pathname.startsWith('/admin')) {
    return () => {};
  }

  document.addEventListener('click', trackClick, { passive: true });

  // Track initial page view
  trackPageView();

  // Track scroll depth
  window.addEventListener('scroll', trackScrollDepth, { passive: true });

  // Send scroll depth every 30 seconds
  scrollTimer = setInterval(sendScrollDepth, 30000);

  // Set up periodic flush
  flushTimer = setInterval(flushQueue, FLUSH_INTERVAL);

  // Flush on page unload (also send final scroll depth)
  const handleUnload = () => {
    sendScrollDepth();
    flushQueue();
  };
  window.addEventListener('beforeunload', handleUnload);

  // Track route changes (SPA navigation)
  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      // Send scroll depth for the page we're leaving
      sendScrollDepth();

      lastPath = window.location.pathname;
      if (!lastPath.startsWith('/admin')) {
        trackPageView();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    document.removeEventListener('click', trackClick);
    window.removeEventListener('scroll', trackScrollDepth);
    window.removeEventListener('beforeunload', handleUnload);
    clearInterval(flushTimer);
    clearInterval(scrollTimer);
    observer.disconnect();
    sendScrollDepth();
    flushQueue();
  };
}
