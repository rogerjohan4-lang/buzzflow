import { useState, useEffect } from 'react';
import { trendAPI, postAPI } from '../services/api';
import TrendCard from '../components/TrendCard';
import PlatformBadge from '../components/PlatformBadge';
import { TrendingUp, Eye, Zap, Calendar, ArrowUpRight, BarChart3, Clock } from 'lucide-react';

export default function Dashboard({ onNavigate, onRemix }) {
    const [trends, setTrends] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [trendsRes, analyticsRes] = await Promise.all([
                trendAPI.getAll({ limit: 6 }),
                postAPI.getAnalytics()
            ]);
            setTrends(trendsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setLoading(false);
        }
    }

    const stats = analytics ? [
        {
            icon: '🔥', label: 'Contenus Découverts', value: analytics.topMetrics.contentRemixed,
            change: '+12 aujourd\'hui', positive: true,
            bg: 'rgba(239, 68, 68, 0.1)'
        },
        {
            icon: '📊', label: 'Vues Totales', value: analytics.topMetrics.totalViews,
            change: '+18.5%', positive: true,
            bg: 'rgba(59, 130, 246, 0.1)'
        },
        {
            icon: '⚡', label: 'Engagement Total', value: analytics.topMetrics.totalEngagement,
            change: '+24.2%', positive: true,
            bg: 'rgba(124, 58, 237, 0.1)'
        },
        {
            icon: '📅', label: 'Posts Programmés', value: analytics.overview.scheduled,
            change: `${analytics.overview.published} publiés`, positive: true,
            bg: 'rgba(16, 185, 129, 0.1)'
        }
    ] : [];

    return (
        <>
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Vue d'ensemble de votre activité BuzzFlow</p>
            </div>

            <div className="page-content">
                {/* Stats Grid */}
                <div className="stats-grid">
                    {stats.map((stat, i) => (
                        <div className="stat-card" key={i}>
                            <div className="stat-icon" style={{ background: stat.bg }}>
                                {stat.icon}
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                                <ArrowUpRight size={12} />
                                {stat.change}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Insights */}
                {analytics && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
                        <div className="card">
                            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(0, 242, 234, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                                    🏆
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Meilleure Plateforme</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{analytics.topMetrics.bestPlatform}</div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                                    <Clock size={22} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Meilleur Horaire</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{analytics.topMetrics.bestTime}</div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                                    <Zap size={22} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Score Viralité Moyen</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{analytics.topMetrics.avgViralityScore}/100</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Platform Performance */}
                {analytics && (
                    <div className="card" style={{ marginBottom: 24 }}>
                        <div className="card-header">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem' }}>
                                <BarChart3 size={18} /> Performance par Plateforme
                            </h3>
                        </div>
                        <div className="card-body">
                            {analytics.platformPerformance.map(p => (
                                <div className="platform-perf-item" key={p.platform}>
                                    <PlatformBadge platform={p.platform} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                                            <span>{p.posts} posts</span>
                                            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{p.growth}</span>
                                        </div>
                                        <div className="perf-bar">
                                            <div
                                                className="perf-bar-fill"
                                                style={{
                                                    width: `${Math.min(p.avgEngagement * 7, 100)}%`,
                                                    background: p.color
                                                }}
                                            ></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                            <span>Avg. {p.avgViews.toLocaleString()} vues</span>
                                            <span>{p.avgEngagement}% engagement</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Latest Trending */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TrendingUp size={18} /> Derniers Contenus Viraux
                    </h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('trending')}>
                        Voir tout <ArrowUpRight size={14} />
                    </button>
                </div>

                <div className="trending-grid">
                    {trends.slice(0, 6).map(item => (
                        <TrendCard key={item.id} item={item} onRemix={onRemix} />
                    ))}
                </div>

                {loading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)' }}></div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
