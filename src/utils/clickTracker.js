// Click tracking utility — drops into the main site to record user interactions
// Sends click events to /api/analytics/track with batching for performance

const SESSION_KEY = 'lbx_session_id';
const BATCH_SIZE = 5;
const FLUSH_INTERVAL = 10000; // 10 seconds

let eventQueue = [];
let flushTimer = null;

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getElementText(el) {
  const text = el.textContent?.trim();
  if (text && text.length <= 100) return text;
  if (text) return text.substring(0, 100) + '…';
  return el.getAttribute('aria-label') || el.getAttribute('alt') || '';
}

function flushQueue() {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];

  fetch('/api/analytics/track-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
    keepalive: true,
  }).catch(() => {
    // Silently fail — don't disrupt user experience
  });
}

function trackClick(event) {
  const el = event.target.closest('a, button, [role="button"], input[type="submit"], [data-track]') || event.target;

  const data = {
    event_type: 'click',
    element_tag: el.tagName?.toLowerCase(),
    element_id: el.id || null,
    element_text: getElementText(el),
    element_class: el.className?.toString()?.substring(0, 200) || null,
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
  const data = {
    event_type: 'pageview',
    element_tag: null,
    element_id: null,
    element_text: document.title,
    element_class: null,
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

export function initClickTracking() {
  // Don't track on admin pages
  if (window.location.pathname.startsWith('/admin')) return;

  document.addEventListener('click', trackClick, { passive: true });

  // Track page views
  trackPageView();

  // Set up periodic flush
  flushTimer = setInterval(flushQueue, FLUSH_INTERVAL);

  // Flush on page unload
  window.addEventListener('beforeunload', flushQueue);

  // Track route changes (SPA navigation)
  let lastPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      if (!lastPath.startsWith('/admin')) {
        trackPageView();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    document.removeEventListener('click', trackClick);
    window.removeEventListener('beforeunload', flushQueue);
    clearInterval(flushTimer);
    observer.disconnect();
    flushQueue();
  };
}
