import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MousePointerClick, Eye, FileText, TrendingUp,
  ArrowUpRight, Clock, Plus
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { analyticsAPI, postsAPI } from './api';

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, postsData] = await Promise.all([
        analyticsAPI.overview(30).catch(() => ({
          totalClicks: 0,
          uniqueVisitors: 0,
          topPages: [],
          clicksByDay: [],
          clicksByHour: [],
        })),
        postsAPI.list({ limit: 5 }).catch(() => ({ posts: [], total: 0 })),
      ]);
      setStats(analyticsData);
      setRecentPosts(postsData.posts || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      label: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: MousePointerClick,
      color: 'accent',
    },
    {
      label: 'Unique Visitors',
      value: stats.uniqueVisitors.toLocaleString(),
      icon: Eye,
      color: 'info',
    },
    {
      label: 'Blog Posts',
      value: recentPosts.length > 0 ? recentPosts.length.toString() : '0',
      icon: FileText,
      color: 'success',
    },
    {
      label: 'Avg. Daily Clicks',
      value: stats.clicksByDay.length > 0
        ? Math.round(stats.totalClicks / Math.max(stats.clicksByDay.length, 1)).toLocaleString()
        : '0',
      icon: TrendingUp,
      color: 'warning',
    },
  ] : [];

  const maxDayClicks = stats?.clicksByDay?.length > 0
    ? Math.max(...stats.clicksByDay.map(d => parseInt(d.clicks)))
    : 1;

  return (
    <AdminLayout user={user} onLogout={onLogout} title="Dashboard" subtitle="Welcome back — here's your overview.">
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="admin-skeleton" style={{ height: '120px' }} />
            ))}
          </div>
          <div className="admin-skeleton" style={{ height: '340px' }} />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="admin-stats-grid">
            {statCards.map((card) => (
              <div key={card.label} className="admin-stat-card">
                <div className={`admin-stat-icon ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <div className="admin-stat-value">{card.value}</div>
                <div className="admin-stat-label">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="admin-grid-2" style={{ marginBottom: '24px' }}>
            {/* Click Trend */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Click Trend (30 days)</span>
              </div>
              <div className="admin-card-body">
                {stats?.clicksByDay?.length > 0 ? (
                  <div>
                    <div className="admin-chart-bar-group">
                      {stats.clicksByDay.map((day, i) => (
                        <div
                          key={i}
                          className="admin-chart-bar"
                          style={{
                            height: `${Math.max((parseInt(day.clicks) / maxDayClicks) * 100, 4)}%`,
                          }}
                        >
                          <div className="admin-chart-bar-tooltip">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            : {day.clicks}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '10px',
                      color: 'var(--admin-text-muted)',
                    }}>
                      <span>
                        {stats.clicksByDay.length > 0 &&
                          new Date(stats.clicksByDay[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        }
                      </span>
                      <span>
                        {stats.clicksByDay.length > 0 &&
                          new Date(stats.clicksByDay[stats.clicksByDay.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        }
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="admin-empty">
                    <div className="admin-empty-icon"><MousePointerClick size={20} /></div>
                    <p className="admin-empty-title">No click data yet</p>
                    <p className="admin-empty-text">Analytics will appear once visitors interact with your site.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Peak Hours */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Activity by Hour</span>
              </div>
              <div className="admin-card-body">
                {stats?.clicksByHour?.length > 0 ? (
                  <div>
                    <div className="admin-hour-grid">
                      {Array.from({ length: 24 }, (_, i) => {
                        const hourData = stats.clicksByHour.find(h => parseInt(h.hour) === i);
                        const clicks = hourData ? parseInt(hourData.clicks) : 0;
                        const maxH = Math.max(...stats.clicksByHour.map(h => parseInt(h.clicks)), 1);
                        const intensity = clicks / maxH;
                        return (
                          <div
                            key={i}
                            className="admin-hour-cell"
                            style={{
                              background: clicks > 0
                                ? `rgba(255, 85, 85, ${0.1 + intensity * 0.8})`
                                : 'var(--admin-surface-2)',
                            }}
                            title={`${i}:00 — ${clicks} clicks`}
                          />
                        );
                      })}
                    </div>
                    <div className="admin-hour-labels">
                      {Array.from({ length: 24 }, (_, i) => (
                        <span key={i} className="admin-hour-label">
                          {i % 6 === 0 ? `${i}h` : ''}
                        </span>
                      ))}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '16px',
                      fontSize: '11px',
                      color: 'var(--admin-text-muted)',
                    }}>
                      <span>Low</span>
                      <div style={{
                        flex: 1,
                        height: '6px',
                        borderRadius: '3px',
                        background: 'linear-gradient(90deg, var(--admin-surface-3), var(--admin-accent))',
                      }} />
                      <span>High</span>
                    </div>
                  </div>
                ) : (
                  <div className="admin-empty">
                    <div className="admin-empty-icon"><Clock size={20} /></div>
                    <p className="admin-empty-title">No hourly data</p>
                    <p className="admin-empty-text">Peak hours will show once tracking data accumulates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="admin-grid-2">
            {/* Top Pages */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Top Pages</span>
                <Link to="/admin/analytics" className="admin-btn admin-btn-ghost admin-btn-sm">
                  View All <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="admin-card-body" style={{ padding: 0 }}>
                {stats?.topPages?.length > 0 ? (
                  <div className="admin-heatmap-list" style={{ padding: '16px' }}>
                    {stats.topPages.slice(0, 5).map((page, i) => (
                      <div key={i} className="admin-heatmap-item">
                        <span className="admin-heatmap-label">{page.page_path || '/'}</span>
                        <div className="admin-heatmap-bar">
                          <div
                            className="admin-heatmap-bar-fill"
                            style={{
                              width: `${(parseInt(page.clicks) / parseInt(stats.topPages[0].clicks)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="admin-heatmap-count">{parseInt(page.clicks).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="admin-empty" style={{ padding: '40px 24px' }}>
                    <p className="admin-empty-text">No page data available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Recent Posts</span>
                <Link to="/admin/posts/new" className="admin-btn admin-btn-primary admin-btn-sm">
                  <Plus size={14} /> New Post
                </Link>
              </div>
              <div className="admin-card-body" style={{ padding: 0 }}>
                {recentPosts.length > 0 ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPosts.map((post) => (
                          <tr key={post.id}>
                            <td>
                              <Link
                                to={`/admin/posts/${post.id}`}
                                style={{ color: 'var(--admin-text)', textDecoration: 'none', fontWeight: 500 }}
                              >
                                {post.title}
                              </Link>
                            </td>
                            <td>
                              <span className={`admin-badge ${post.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                                {post.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '12px' }}>
                              {new Date(post.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty" style={{ padding: '40px 24px' }}>
                    <div className="admin-empty-icon"><FileText size={20} /></div>
                    <p className="admin-empty-title">No posts yet</p>
                    <p className="admin-empty-text">Create your first blog post to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
