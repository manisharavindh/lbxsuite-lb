import React, { useState, useEffect, useMemo } from 'react';
import {
  MousePointerClick, Eye, TrendingUp, Clock,
  BarChart3, Activity, Layers, Users, Zap, RefreshCw,
  Monitor, Smartphone, Globe, ArrowDownUp, Hash, Tag,
  ChevronDown, ChevronUp, Filter, Download, Search
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { analyticsAPI } from './api';

// Badge color helper
const eventBadge = (type) => {
  switch (type) {
    case 'click': return 'admin-badge-info';
    case 'pageview': return 'admin-badge-success';
    case 'scroll_depth': return 'admin-badge-warning';
    default: return 'admin-badge-info';
  }
};

const AdminAnalytics = ({ user, onLogout }) => {
  const [overview, setOverview] = useState(null);
  const [topElements, setTopElements] = useState([]);
  const [recentClicks, setRecentClicks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [eventFilter, setEventFilter] = useState('all');
  const [expandedSession, setExpandedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [days]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewData, elementsData, clicksData, sessionsData] = await Promise.all([
        analyticsAPI.overview(days).catch(() => ({
          totalClicks: 0,
          totalPageviews: 0,
          uniqueVisitors: 0,
          topPages: [],
          clicksByDay: [],
          pageviewsByDay: [],
          clicksByHour: [],
          scrollDepthByPage: [],
          topNamedElements: [],
        })),
        analyticsAPI.topElements(days).catch(() => ({ elements: [] })),
        analyticsAPI.clicks({ days, limit: 100 }).catch(() => ({ clicks: [] })),
        analyticsAPI.sessions(days).catch(() => ({ sessions: [] })),
      ]);
      setOverview(overviewData);
      setTopElements(elementsData.elements || []);
      setRecentClicks(clicksData.clicks || []);
      setSessions(sessionsData.sessions || []);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Derived data
  const maxDayClicks = overview?.clicksByDay?.length > 0
    ? Math.max(...overview.clicksByDay.map(d => parseInt(d.clicks)))
    : 1;

  const maxElementClicks = topElements.length > 0
    ? Math.max(...topElements.map(e => parseInt(e.clicks)))
    : 1;

  // Filter recent clicks by event type
  const filteredClicks = useMemo(() => {
    let filtered = recentClicks;
    if (eventFilter !== 'all') {
      filtered = filtered.filter(c => c.event_type === eventFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        (c.element_name || '').toLowerCase().includes(q) ||
        (c.element_text || '').toLowerCase().includes(q) ||
        (c.element_id || '').toLowerCase().includes(q) ||
        (c.page_path || '').toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [recentClicks, eventFilter, searchQuery]);

  // Named vs unnamed elements
  const namedElements = useMemo(() =>
    topElements.filter(e => e.element_name && !e.element_name.startsWith('a:') && !e.element_name.startsWith('button:') && !e.element_name.startsWith('div:')),
    [topElements]
  );

  const unnamedElements = useMemo(() =>
    topElements.filter(e => !e.element_name || e.element_name.startsWith('a:') || e.element_name.startsWith('button:') || e.element_name.startsWith('div:')),
    [topElements]
  );

  // Helper: format duration
  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '< 1s';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  // Helper: parse user agent into device type
  const getDeviceType = (ua) => {
    if (!ua) return 'Unknown';
    if (/mobile|android|iphone|ipad/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Desktop';
  };

  // Export analytics data as CSV
  const exportCSV = () => {
    const headers = ['Time', 'Event', 'Element Name', 'Element Tag', 'Element ID', 'Text', 'Page', 'Position', 'Session', 'Viewport'];
    const csvRows = [headers.join(',')];
    filteredClicks.forEach(c => {
      csvRows.push([
        new Date(c.created_at).toISOString(),
        c.event_type,
        `"${(c.element_name || '').replace(/"/g, '""')}"`,
        c.element_tag,
        c.element_id || '',
        `"${(c.element_text || '').replace(/"/g, '""')}"`,
        c.page_path,
        c.click_x != null ? `${c.click_x},${c.click_y}` : '',
        c.session_id || '',
        c.viewport_width ? `${c.viewport_width}x${c.viewport_height}` : '',
      ].join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout
      user={user}
      onLogout={onLogout}
      title="Analytics"
      subtitle="Track user engagement and optimize your site."
      actions={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleRefresh}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={refreshing}
            title="Refresh data"
          >
            <RefreshCw size={14} className={refreshing ? 'admin-spin' : ''} />
          </button>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`admin-btn admin-btn-sm ${days === d ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      }
    >
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="admin-skeleton" style={{ height: '140px' }} />
            ))}
          </div>
          <div className="admin-skeleton" style={{ height: '400px' }} />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon accent"><MousePointerClick size={20} /></div>
              <div className="admin-stat-value">{(overview?.totalClicks || 0).toLocaleString()}</div>
              <div className="admin-stat-label">Total Clicks</div>
              <div className="admin-stat-description">Last {days} days</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon success"><Eye size={20} /></div>
              <div className="admin-stat-value">{(overview?.totalPageviews || 0).toLocaleString()}</div>
              <div className="admin-stat-label">Page Views</div>
              <div className="admin-stat-description">Unique page loads</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon info"><Users size={20} /></div>
              <div className="admin-stat-value">{(overview?.uniqueVisitors || 0).toLocaleString()}</div>
              <div className="admin-stat-label">Unique Visitors</div>
              <div className="admin-stat-description">By session</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon warning"><TrendingUp size={20} /></div>
              <div className="admin-stat-value">
                {overview?.clicksByDay?.length > 0
                  ? Math.round(overview.totalClicks / overview.clicksByDay.length).toLocaleString()
                  : '0'}
              </div>
              <div className="admin-stat-label">Avg. Daily Clicks</div>
              <div className="admin-stat-description">
                {overview?.clicksByDay?.length > 0 ? `Over ${overview.clicksByDay.length} days` : 'No data'}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'elements', label: 'Tracked Elements', icon: Tag },
              { key: 'clicks', label: 'Event Log', icon: Activity },
              { key: 'sessions', label: 'Sessions', icon: Users },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
              >
                <tab.icon size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                {tab.label}
                {tab.key === 'elements' && namedElements.length > 0 && (
                  <span className="admin-tab-count">{namedElements.length}</span>
                )}
                {tab.key === 'sessions' && sessions.length > 0 && (
                  <span className="admin-tab-count">{sessions.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 'overview' && (
            <div className="admin-grid-2">
              {/* Click Trend Chart */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <span className="admin-card-title">Click Trend</span>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    Last {days} days
                  </span>
                </div>
                <div className="admin-card-body">
                  {overview?.clicksByDay?.length > 0 ? (
                    <div>
                      <div className="admin-chart-bar-group" style={{ height: '220px' }}>
                        {overview.clicksByDay.map((day, i) => (
                          <div
                            key={i}
                            className="admin-chart-bar"
                            style={{
                              height: `${Math.max((parseInt(day.clicks) / maxDayClicks) * 100, 4)}%`,
                            }}
                          >
                            <div className="admin-chart-bar-tooltip">
                              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {day.clicks} clicks
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
                          {new Date(overview.clicksByDay[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span>
                          {new Date(overview.clicksByDay[overview.clicksByDay.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-empty">
                      <div className="admin-empty-icon"><BarChart3 size={20} /></div>
                      <p className="admin-empty-title">No data yet</p>
                      <p className="admin-empty-text">Click data will appear as users visit your site.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Pages */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <span className="admin-card-title">Top Pages</span>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    {overview?.topPages?.length || 0} pages
                  </span>
                </div>
                <div className="admin-card-body">
                  {overview?.topPages?.length > 0 ? (
                    <div className="admin-heatmap-list">
                      {overview.topPages.map((page, i) => (
                        <div key={i} className="admin-heatmap-item">
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--admin-text-muted)',
                            minWidth: '20px',
                          }}>{i + 1}</span>
                          <span className="admin-heatmap-label" title={page.page_path}>
                            {page.page_path || '/'}
                          </span>
                          <div className="admin-heatmap-bar">
                            <div
                              className="admin-heatmap-bar-fill"
                              style={{
                                width: `${(parseInt(page.clicks) / parseInt(overview.topPages[0].clicks)) * 100}%`
                              }}
                            />
                          </div>
                          <span className="admin-heatmap-count">
                            {parseInt(page.clicks).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-empty">
                      <p className="admin-empty-text">No page data available.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Named Elements (Quick View) */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <span className="admin-card-title">Most Clicked Elements</span>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => setActiveTab('elements')}
                    style={{ fontSize: '11px' }}
                  >
                    View All →
                  </button>
                </div>
                <div className="admin-card-body">
                  {overview?.topNamedElements?.length > 0 ? (
                    <div className="admin-heatmap-list">
                      {overview.topNamedElements.slice(0, 8).map((el, i) => (
                        <div key={i} className="admin-heatmap-item">
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--admin-text-muted)',
                            minWidth: '20px',
                          }}>{i + 1}</span>
                          <span className="admin-heatmap-label" title={el.name} style={{ fontSize: '12px' }}>
                            {el.name}
                          </span>
                          <div className="admin-heatmap-bar">
                            <div
                              className="admin-heatmap-bar-fill"
                              style={{
                                width: `${(parseInt(el.clicks) / parseInt(overview.topNamedElements[0].clicks)) * 100}%`
                              }}
                            />
                          </div>
                          <span className="admin-heatmap-count">
                            {parseInt(el.clicks).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-empty">
                      <div className="admin-empty-icon"><Tag size={20} /></div>
                      <p className="admin-empty-title">No tracked elements</p>
                      <p className="admin-empty-text">Named element data will appear as visitors interact with your site.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hourly Activity */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <span className="admin-card-title">Activity by Hour (UTC)</span>
                </div>
                <div className="admin-card-body">
                  {overview?.clicksByHour?.length > 0 ? (
                    <div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(24, 1fr)',
                        gap: '4px',
                        alignItems: 'flex-end',
                        height: '120px',
                        padding: '0 4px',
                      }}>
                        {Array.from({ length: 24 }, (_, hour) => {
                          const hourData = overview.clicksByHour.find(h => parseInt(h.hour) === hour);
                          const clicks = hourData ? parseInt(hourData.clicks) : 0;
                          const maxH = Math.max(...overview.clicksByHour.map(h => parseInt(h.clicks)), 1);
                          return (
                            <div
                              key={hour}
                              className="admin-hourly-bar"
                              style={{
                                height: `${Math.max((clicks / maxH) * 100, 4)}%`,
                                background: clicks > 0
                                  ? `linear-gradient(to top, rgba(255,85,85,0.4), rgba(255,85,85,${0.3 + (clicks / maxH) * 0.7}))`
                                  : 'var(--admin-surface-3)',
                              }}
                              title={`${hour}:00 — ${clicks} clicks`}
                            />
                          );
                        })}
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(24, 1fr)',
                        gap: '4px',
                        padding: '6px 4px 0',
                      }}>
                        {Array.from({ length: 24 }, (_, i) => (
                          <span key={i} style={{
                            fontSize: '9px',
                            color: 'var(--admin-text-muted)',
                            textAlign: 'center',
                          }}>
                            {i % 3 === 0 ? `${i}` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="admin-empty">
                      <div className="admin-empty-icon"><Clock size={20} /></div>
                      <p className="admin-empty-title">No hourly data</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Scroll Depth */}
              {overview?.scrollDepthByPage?.length > 0 && (
                <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
                  <div className="admin-card-header">
                    <span className="admin-card-title">Scroll Depth by Page</span>
                    <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                      Average depth users scroll to
                    </span>
                  </div>
                  <div className="admin-card-body" style={{ padding: 0 }}>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Page</th>
                            <th>Avg Depth</th>
                            <th>Max Depth</th>
                            <th>Samples</th>
                            <th style={{ width: '200px' }}>Visual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview.scrollDepthByPage.map((page, i) => (
                            <tr key={i}>
                              <td style={{ fontSize: '12px' }}>{page.page_path}</td>
                              <td style={{ fontWeight: 700 }}>{page.avg_depth}%</td>
                              <td>{page.max_depth}%</td>
                              <td style={{ color: 'var(--admin-text-muted)' }}>{page.samples}</td>
                              <td>
                                <div style={{
                                  width: '100%',
                                  height: '8px',
                                  borderRadius: '4px',
                                  background: 'var(--admin-surface-3)',
                                  overflow: 'hidden',
                                }}>
                                  <div style={{
                                    width: `${page.avg_depth}%`,
                                    height: '100%',
                                    borderRadius: '4px',
                                    background: page.avg_depth > 75
                                      ? 'var(--admin-success)'
                                      : page.avg_depth > 40
                                        ? 'var(--admin-accent)'
                                        : 'var(--admin-warning)',
                                    transition: 'width 0.5s ease',
                                  }} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== TRACKED ELEMENTS TAB ===== */}
          {activeTab === 'elements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Named Elements */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <span className="admin-card-title">
                    <Tag size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                    Named Elements (data-track)
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    {namedElements.length} tracked element{namedElements.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="admin-card-body" style={{ padding: 0 }}>
                  {namedElements.length > 0 ? (
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>#</th>
                            <th>Element Name</th>
                            <th>Tag</th>
                            <th>Page</th>
                            <th>Clicks</th>
                            <th style={{ width: '160px' }}>Intensity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {namedElements.map((el, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 700, color: 'var(--admin-text-muted)' }}>{i + 1}</td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--admin-text)',
                                  }}>
                                    {el.element_name}
                                  </span>
                                  {el.element_text && el.element_text !== el.element_name && (
                                    <span style={{
                                      fontSize: '10px',
                                      color: 'var(--admin-text-muted)',
                                      maxWidth: '200px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}>
                                      "{el.element_text}"
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className="admin-badge admin-badge-info" style={{ fontSize: '9px' }}>
                                  {el.element_tag || '?'}
                                </span>
                              </td>
                              <td style={{ fontSize: '12px' }}>{el.page_path || '/'}</td>
                              <td style={{ fontWeight: 700, color: 'var(--admin-text)' }}>
                                {parseInt(el.clicks).toLocaleString()}
                              </td>
                              <td>
                                <div className="admin-heatmap-bar">
                                  <div
                                    className="admin-heatmap-bar-fill"
                                    style={{
                                      width: `${(parseInt(el.clicks) / maxElementClicks) * 100}%`,
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="admin-empty">
                      <div className="admin-empty-icon"><Tag size={20} /></div>
                      <p className="admin-empty-title">No named elements</p>
                      <p className="admin-empty-text">Named element tracking data will appear as visitors interact with your site.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Unnamed / Generic Elements */}
              {unnamedElements.length > 0 && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <span className="admin-card-title">
                      <Hash size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                      Other Clicked Elements
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                      {unnamedElements.length} element{unnamedElements.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="admin-card-body" style={{ padding: 0 }}>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>#</th>
                            <th>Element</th>
                            <th>Text</th>
                            <th>Tag</th>
                            <th>Page</th>
                            <th>Clicks</th>
                            <th style={{ width: '140px' }}>Intensity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {unnamedElements.map((el, i) => (
                            <tr key={i}>
                              <td style={{ fontWeight: 700, color: 'var(--admin-text-muted)' }}>{i + 1}</td>
                              <td>
                                <code style={{
                                  fontSize: '11px',
                                  background: 'var(--admin-surface-3)',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  color: 'var(--admin-text-secondary)',
                                  wordBreak: 'break-all',
                                }}>
                                  {el.element?.substring(0, 40) || '—'}
                                </code>
                              </td>
                              <td style={{ fontSize: '12px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {el.element_text || '—'}
                              </td>
                              <td>
                                <span className="admin-badge admin-badge-info" style={{ fontSize: '9px' }}>
                                  {el.element_tag || '?'}
                                </span>
                              </td>
                              <td style={{ fontSize: '12px' }}>{el.page_path || '/'}</td>
                              <td style={{ fontWeight: 700, color: 'var(--admin-text)' }}>
                                {parseInt(el.clicks).toLocaleString()}
                              </td>
                              <td>
                                <div className="admin-heatmap-bar">
                                  <div
                                    className="admin-heatmap-bar-fill"
                                    style={{
                                      width: `${(parseInt(el.clicks) / maxElementClicks) * 100}%`,
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== EVENT LOG TAB ===== */}
          {activeTab === 'clicks' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Event Log</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Search */}
                  <div style={{ position: 'relative' }}>
                    <Search size={12} style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--admin-text-muted)',
                    }} />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'var(--admin-surface-2)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '6px',
                        padding: '6px 10px 6px 28px',
                        fontSize: '11px',
                        color: 'var(--admin-text)',
                        outline: 'none',
                        width: '160px',
                      }}
                    />
                  </div>
                  {/* Event Type Filter */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['all', 'click', 'pageview', 'scroll_depth'].map(t => (
                      <button
                        key={t}
                        onClick={() => setEventFilter(t)}
                        className={`admin-btn admin-btn-sm ${eventFilter === t ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                        style={{ fontSize: '10px', padding: '4px 8px' }}
                      >
                        {t === 'all' ? 'All' : t === 'scroll_depth' ? 'Scroll' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                  {/* Export */}
                  <button
                    onClick={exportCSV}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    title="Export CSV"
                  >
                    <Download size={12} />
                  </button>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                    {filteredClicks.length} events
                  </span>
                </div>
              </div>
              <div className="admin-card-body" style={{ padding: 0 }}>
                {filteredClicks.length > 0 ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Type</th>
                          <th>Element Name</th>
                          <th>Tag / ID</th>
                          <th>Text</th>
                          <th>Page</th>
                          <th>Position</th>
                          <th>Session</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClicks.map((click, i) => (
                          <tr key={i}>
                            <td style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                              {new Date(click.created_at).toLocaleString('en-US', {
                                month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </td>
                            <td>
                              <span className={`admin-badge ${eventBadge(click.event_type)}`} style={{ fontSize: '9px' }}>
                                {click.event_type}
                              </span>
                            </td>
                            <td style={{
                              fontSize: '12px',
                              fontWeight: click.element_name ? 600 : 400,
                              color: click.element_name ? 'var(--admin-text)' : 'var(--admin-text-muted)',
                              maxWidth: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {click.element_name || '—'}
                            </td>
                            <td>
                              <span className="admin-badge admin-badge-info" style={{ fontSize: '9px' }}>
                                {click.element_tag || '?'}
                              </span>
                              {click.element_id && (
                                <code style={{
                                  fontSize: '10px',
                                  marginLeft: '4px',
                                  color: 'var(--admin-text-muted)',
                                }}>
                                  #{click.element_id}
                                </code>
                              )}
                            </td>
                            <td style={{
                              fontSize: '12px',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {click.element_text || '—'}
                            </td>
                            <td style={{ fontSize: '12px' }}>{click.page_path || '/'}</td>
                            <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                              {click.click_x != null ? `${click.click_x}, ${click.click_y}` : '—'}
                            </td>
                            <td style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--admin-text-muted)' }}>
                              {click.session_id ? click.session_id.substring(0, 12) + '…' : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty">
                    <div className="admin-empty-icon"><Activity size={20} /></div>
                    <p className="admin-empty-title">No events found</p>
                    <p className="admin-empty-text">
                      {eventFilter !== 'all' || searchQuery
                        ? 'Try adjusting your filters.'
                        : 'Events will appear in real-time as visitors use your site.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== SESSIONS TAB ===== */}
          {activeTab === 'sessions' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Visitor Sessions</span>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                  {sessions.length} session{sessions.length !== 1 ? 's' : ''} · Last {days} days
                </span>
              </div>
              <div className="admin-card-body" style={{ padding: 0 }}>
                {sessions.length > 0 ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Session</th>
                          <th>Device</th>
                          <th>Pages</th>
                          <th>Clicks</th>
                          <th>Views</th>
                          <th>Duration</th>
                          <th>Last Seen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((session, i) => (
                          <React.Fragment key={i}>
                            <tr
                              style={{ cursor: 'pointer' }}
                              onClick={() => setExpandedSession(expandedSession === i ? null : i)}
                            >
                              <td style={{ width: '30px' }}>
                                {expandedSession === i
                                  ? <ChevronUp size={12} style={{ color: 'var(--admin-text-muted)' }} />
                                  : <ChevronDown size={12} style={{ color: 'var(--admin-text-muted)' }} />
                                }
                              </td>
                              <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                                {session.session_id.substring(0, 16)}…
                              </td>
                              <td>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  {getDeviceType(session.user_agent) === 'Mobile'
                                    ? <Smartphone size={12} />
                                    : <Monitor size={12} />
                                  }
                                  <span style={{ fontSize: '11px' }}>{getDeviceType(session.user_agent)}</span>
                                </span>
                              </td>
                              <td style={{ fontWeight: 600 }}>{session.page_count}</td>
                              <td style={{ fontWeight: 600 }}>{session.clicks}</td>
                              <td style={{ fontWeight: 600 }}>{session.pageviews}</td>
                              <td style={{ fontSize: '11px' }}>{formatDuration(session.duration_seconds)}</td>
                              <td style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                                {new Date(session.last_seen).toLocaleString('en-US', {
                                  month: 'short', day: 'numeric',
                                  hour: '2-digit', minute: '2-digit',
                                })}
                              </td>
                            </tr>
                            {expandedSession === i && (
                              <tr>
                                <td></td>
                                <td colSpan={7}>
                                  <div style={{
                                    padding: '12px 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    fontSize: '12px',
                                  }}>
                                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                      <div>
                                        <span style={{ color: 'var(--admin-text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                          Viewport
                                        </span>
                                        <div style={{ fontFamily: 'monospace', marginTop: '2px' }}>
                                          {session.viewport || '—'}
                                        </div>
                                      </div>
                                      <div>
                                        <span style={{ color: 'var(--admin-text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                          IP Address
                                        </span>
                                        <div style={{ fontFamily: 'monospace', marginTop: '2px' }}>
                                          {session.ip_address || '—'}
                                        </div>
                                      </div>
                                      <div>
                                        <span style={{ color: 'var(--admin-text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                          First Seen
                                        </span>
                                        <div style={{ marginTop: '2px' }}>
                                          {new Date(session.first_seen).toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--admin-text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Pages Visited
                                      </span>
                                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                                        {session.pages.map((p, pi) => (
                                          <code key={pi} style={{
                                            fontSize: '11px',
                                            background: 'var(--admin-surface-3)',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            color: 'var(--admin-text-secondary)',
                                          }}>
                                            {p}
                                          </code>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <span style={{ color: 'var(--admin-text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        User Agent
                                      </span>
                                      <div style={{
                                        fontFamily: 'monospace',
                                        fontSize: '10px',
                                        marginTop: '2px',
                                        color: 'var(--admin-text-muted)',
                                        wordBreak: 'break-all',
                                      }}>
                                        {session.user_agent || '—'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty">
                    <div className="admin-empty-icon"><Users size={20} /></div>
                    <p className="admin-empty-title">No sessions</p>
                    <p className="admin-empty-text">Session data will appear as visitors browse your site.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;
