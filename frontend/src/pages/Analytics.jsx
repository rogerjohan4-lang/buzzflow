import { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import PlatformBadge from '../components/PlatformBadge';
import { BarChart3, TrendingUp, Eye, Users, Zap, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const CHART_COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export default function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    async function loadAnalytics() {
        setLoading(true);
        try {
            const res = await postAPI.getAnalytics();
            setAnalytics(res.data);
        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading || !analytics) {
        return (
            <>
                <div className="page-header">
                    <h2>📊 Analytics</h2>
                    <p>Performances et statistiques détaillées</p>
                </div>
                <div className="page-content">
                    <div className="stats-grid">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }}></div>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    const pieData = analytics.platformPerformance.map(p => ({
        name: p.name,
        value: p.posts,
        color: p.color
    }));

    return (
        <>
            <div className="page-header">
                <h2>📊 Analytics</h2>
                <p>Performances et statistiques détaillées de vos publications</p>
            </div>

            <div className="page-content">
                {/* Top Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.1)' }}>
                            <Eye size={20} style={{ color: 'var(--accent-purple)' }} />
                        </div>
                        <div className="stat-value">{analytics.topMetrics.totalViews}</div>
                        <div className="stat-label">Vues Totales</div>
                        <div className="stat-change positive"><ArrowUpRight size={12} /> +18.5%</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <Zap size={20} style={{ color: 'var(--accent-green)' }} />
                        </div>
                        <div className="stat-value">{analytics.topMetrics.totalEngagement}</div>
                        <div className="stat-label">Interactions</div>
                        <div className="stat-change positive"><ArrowUpRight size={12} /> +24.2%</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                            <TrendingUp size={20} style={{ color: 'var(--accent-blue)' }} />
                        </div>
                        <div className="stat-value">{analytics.topMetrics.avgViralityScore}</div>
                        <div className="stat-label">Score Viralité Moyen</div>
                        <div className="stat-change positive"><ArrowUpRight size={12} /> +5 pts</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                            <Users size={20} style={{ color: 'var(--accent-pink)' }} />
                        </div>
                        <div className="stat-value">{analytics.topMetrics.contentRemixed}</div>
                        <div className="stat-label">Contenus Remixés</div>
                        <div className="stat-change positive"><ArrowUpRight size={12} /> +12 cette semaine</div>
                    </div>
                </div>

                <div className="analytics-grid">
                    {/* Weekly Views Chart */}
                    <div className="chart-card">
                        <h3><BarChart3 size={18} /> Vues Hebdomadaires</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={analytics.weeklyData}>
                                <defs>
                                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" stroke="#6b6b80" fontSize={12} />
                                <YAxis stroke="#6b6b80" fontSize={12} tickFormatter={(v) => v >= 1000 ? (v / 1000) + 'K' : v} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        color: '#f0f0f5',
                                        fontSize: 13
                                    }}
                                    formatter={(value) => [value.toLocaleString(), 'Vues']}
                                />
                                <Area type="monotone" dataKey="views" stroke="#7c3aed" strokeWidth={2} fill="url(#viewsGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Engagement Chart */}
                    <div className="chart-card">
                        <h3><Zap size={18} /> Engagement Quotidien</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analytics.weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" stroke="#6b6b80" fontSize={12} />
                                <YAxis stroke="#6b6b80" fontSize={12} tickFormatter={(v) => v >= 1000 ? (v / 1000) + 'K' : v} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        color: '#f0f0f5',
                                        fontSize: 13
                                    }}
                                    formatter={(value) => [value.toLocaleString(), 'Engagement']}
                                />
                                <Bar dataKey="engagement" radius={[4, 4, 0, 0]}>
                                    {analytics.weeklyData.map((entry, index) => (
                                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Platform Distribution */}
                    <div className="chart-card">
                        <h3>📊 Répartition par Plateforme</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        color: '#f0f0f5',
                                        fontSize: 13
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Platform Performance */}
                    <div className="chart-card">
                        <h3><TrendingUp size={18} /> Performance Détaillée</h3>
                        {analytics.platformPerformance.map(p => (
                            <div className="platform-perf-item" key={p.platform}>
                                <PlatformBadge platform={p.platform} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>{p.avgEngagement}% engagement</span>
                                        <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{p.growth}</span>
                                    </div>
                                    <div className="perf-bar">
                                        <div className="perf-bar-fill" style={{ width: `${Math.min(p.avgEngagement * 7, 100)}%`, background: p.color }}></div>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        {p.posts} posts • Avg. {p.avgViews.toLocaleString()} vues
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* New Followers */}
                    <div className="chart-card" style={{ gridColumn: 'span 2' }}>
                        <h3><Users size={18} /> Nouveaux Abonnés</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={analytics.weeklyData}>
                                <defs>
                                    <linearGradient id="followersGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" stroke="#6b6b80" fontSize={12} />
                                <YAxis stroke="#6b6b80" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1a1a2e',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        color: '#f0f0f5',
                                        fontSize: 13
                                    }}
                                    formatter={(value) => [value.toLocaleString(), 'Nouveaux abonnés']}
                                />
                                <Area type="monotone" dataKey="newFollowers" stroke="#10b981" strokeWidth={2} fill="url(#followersGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}
