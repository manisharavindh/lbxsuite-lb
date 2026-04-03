// Admin API utility — wraps fetch with auth handling

const API_BASE = '/api';

async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Send cookies
    ...options,
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${url}`, config);

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    // Redirect to login if unauthorized, but keep the detailed error
    if (!window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new Error(data.error || 'Unauthorized');
  }

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const authAPI = {
  login: (username, password) =>
    request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request('/admin/auth/logout', { method: 'POST' }),
  me: () => request('/admin/auth/me'),
};

// Posts
export const postsAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/posts${qs ? '?' + qs : ''}`);
  },
  get: (id) => request(`/admin/posts/${id}`),
  create: (data) =>
    request('/admin/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/admin/posts/${id}`, { method: 'DELETE' }),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/admin/posts/upload-image', {
      method: 'POST',
      body: formData,
    });
  },
};

// Analytics
export const analyticsAPI = {
  overview: (days = 30) => request(`/admin/analytics/overview?days=${days}`),
  clicks: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/analytics/clicks${qs ? '?' + qs : ''}`);
  },
  topElements: (days = 30) => request(`/admin/analytics/top-elements?days=${days}`),
  heatmap: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/analytics/heatmap${qs ? '?' + qs : ''}`);
  },
};
