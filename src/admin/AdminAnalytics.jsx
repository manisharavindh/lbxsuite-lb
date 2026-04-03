import React, { useState, useEffect } from 'react';
import {
  MousePointerClick, Eye, TrendingUp, Clock,
  BarChart3, Activity, Layers, Filter
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { analyticsAPI } from './api';

const AdminAnalytics = ({ user, onLogout }) => {
  const [overview, setOverview] = useState(null);
  const [topElements, setTopElements] = useState([]);
  const [recentClicks, setRecentClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, [days]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewData, elementsData, clicksData] = await Promise.all([
        analyticsAPI.overview(days).catch(() => ({
          totalClicks: 0,
          uniqueVisitors: 0,
          topPages: [],
          clicksByDay: [],
          clicksByHour: [],
        })),
        analyticsAPI.topElements(days).catch(() => ({ elements: [] })),
        analyticsAPI.clicks({ days, limit: 30 }).catch(() => ({ clicks: [] })),
      ]);
      setOverview(overviewData);
      setTopElements(elementsData.elements || []);
      setRecentClicks(clicksData.clicks || []);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxDayClicks = overview?.clicksByDay?.length > 0
    ? Math.max(...overview.clicksByDay.map(d => parseInt(d.clicks)))
    : 1;

  const maxElementClicks = topElements.length > 0
    ? Math.max(...topElements.map(e => parseInt(e.clicks)))
    : 1;

  return (
    <AdminLayout
      user={user}
      onLogout={onLogout}
      title="Analytics"
      subtitle="Track user engagement and optimize your site."
      actions={
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
      }
    >
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-stats-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="admin-skeleton" style={{ height: '120px' }} />
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
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon info"><Eye size={20} /></div>
              <div className="admin-stat-value">{(overview?.uniqueVisitors || 0).toLocaleString()}</div>
              <div className="admin-stat-label">Unique Visitors</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon success"><TrendingUp size={20} /></div>
              <div className="admin-stat-value">
                {overview?.clicksByDay?.length > 0
                  ? Math.round(overview.totalClicks / overview.clicksByDay.length).toLocaleString()
                  : '0'}
              </div>
              <div className="admin-stat-label">Avg. Daily Clicks</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon warning"><Layers size={20} /></div>
              <div className="admin-stat-value">{(overview?.topPages?.length || 0).toLocaleString()}</div>
              <div className="admin-stat-label">Active Pages</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'elements', label: 'Top Elements', icon: MousePointerClick },
              { key: 'clicks', label: 'Recent Clicks', icon: Activity },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
              >
                <tab.icon size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
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

              {/* Hourly Activity */}
              <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
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
                              style={{
                                height: `${Math.max((clicks / maxH) * 100, 4)}%`,
                                background: clicks > 0
                                  ? `linear-gradient(to top, rgba(255,85,85,0.4), rgba(255,85,85,${0.3 + (clicks/maxH) * 0.7}))`
                                  : 'var(--admin-surface-3)',
                                borderRadius: '3px 3px 0 0',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
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
            </div>
          )}

          {activeTab === 'elements' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Most Clicked Elements</span>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                  {topElements.length} elements tracked
                </span>
              </div>
              <div className="admin-card-body" style={{ padding: 0 }}>
                {topElements.length > 0 ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Element</th>
                          <th>Text</th>
                          <th>Tag</th>
                          <th>Page</th>
                          <th>Clicks</th>
                          <th style={{ width: '140px' }}>Intensity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topElements.map((el, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 700, color: 'var(--admin-text-muted)' }}>{i + 1}</td>
                            <td>
                              <code style={{
                                fontSize: '11px',
                                background: 'var(--admin-surface-3)',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                color: 'var(--admin-text-secondary)',
                              }}>
                                {el.element?.substring(0, 40) || '—'}
                              </code>
                            </td>
                            <td style={{ fontSize: '12px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {el.element_text || '—'}
                            </td>
                            <td>
                              <span className="admin-badge admin-badge-info" style={{ fontSize: '9px' }}>
                                {el.element_tag}
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
                    <div className="admin-empty-icon"><MousePointerClick size={20} /></div>
                    <p className="admin-empty-title">No element data</p>
                    <p className="admin-empty-text">Element tracking data will appear as visitors interact with your site.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'clicks' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <span className="admin-card-title">Recent Click Events</span>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                  Last {days} days
                </span>
              </div>
              <div className="admin-card-body" style={{ padding: 0 }}>
                {recentClicks.length > 0 ? (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Element</th>
                          <th>Text</th>
                          <th>Page</th>
                          <th>Position</th>
                          <th>Viewport</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentClicks.map((click, i) => (
                          <tr key={i}>
                            <td style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                              {new Date(click.created_at).toLocaleString('en-US', {
                                month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
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
                            <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                              {click.viewport_width ? `${click.viewport_width}×${click.viewport_height}` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty">
                    <div className="admin-empty-icon"><Activity size={20} /></div>
                    <p className="admin-empty-title">No recent clicks</p>
                    <p className="admin-empty-text">Click events will appear in real-time as visitors use your site.</p>
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
