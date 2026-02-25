import { useState, useEffect } from 'react';
import { trendAPI } from '../services/api';
import TrendCard from '../components/TrendCard';
import { Search, RefreshCw, TrendingUp, Filter } from 'lucide-react';

const platforms = [
    { id: 'all', label: '🌐 Toutes' },
    { id: 'youtube', label: '▶ YouTube' },
    { id: 'tiktok', label: '♪ TikTok' },
    { id: 'instagram', label: '◉ Instagram' },
    { id: 'facebook', label: '◆ Facebook' }
];

export default function TrendingFeed({ onRemix }) {
    const [trends, setTrends] = useState([]);
    const [activePlatform, setActivePlatform] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('virality');

    useEffect(() => {
        loadTrends();
    }, [activePlatform]);

    async function loadTrends() {
        setLoading(true);
        try {
            const params = {};
            if (activePlatform !== 'all') params.platform = activePlatform;
            if (searchQuery) params.q = searchQuery;
            const res = await trendAPI.getAll(params);
            setTrends(res.data);
        } catch (err) {
            console.error('Failed to load trends:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(e) {
        e.preventDefault();
        loadTrends();
    }

    const sortedTrends = [...trends].sort((a, b) => {
        switch (sortBy) {
            case 'views': return b.stats.views - a.stats.views;
            case 'engagement': return b.stats.engagementRate - a.stats.engagementRate;
            case 'recent': return a.hoursAgo - b.hoursAgo;
            default: return b.viralityScore - a.viralityScore;
        }
    });

    return (
        <>
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2>🔥 Trending Feed</h2>
                        <p>Découvrez les contenus viraux en temps réel</p>
                    </div>
                    <button className="btn btn-secondary" onClick={loadTrends}>
                        <RefreshCw size={16} className={loading ? 'spinning' : ''} /> Actualiser
                    </button>
                </div>
            </div>

            <div className="page-content">
                {/* Search & Filters */}
                <div className="filter-bar">
                    <form onSubmit={handleSearch} className="search-input" style={{ flex: '0 0 auto' }}>
                        <Search size={16} style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Rechercher un sujet, créateur..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div style={{ display: 'flex', gap: 8 }}>
                        {platforms.map(p => (
                            <button
                                key={p.id}
                                className={`filter-chip ${activePlatform === p.id ? 'active' : ''}`}
                                onClick={() => setActivePlatform(p.id)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            style={{
                                background: 'var(--bg-glass)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-secondary)',
                                padding: '6px 12px',
                                fontSize: '0.8rem',
                                outline: 'none',
                                fontFamily: 'var(--font-sans)',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="virality">Score Viralité</option>
                            <option value="views">Nombre de vues</option>
                            <option value="engagement">Engagement</option>
                            <option value="recent">Plus récent</option>
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={14} />
                    <span>{sortedTrends.length} contenus tendance trouvés</span>
                    {activePlatform !== 'all' && (
                        <span style={{ color: 'var(--accent-purple)' }}>• Filtré: {activePlatform}</span>
                    )}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="trending-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton" style={{ height: 320, borderRadius: 'var(--radius-lg)' }}></div>
                        ))}
                    </div>
                ) : sortedTrends.length > 0 ? (
                    <div className="trending-grid">
                        {sortedTrends.map(item => (
                            <TrendCard
                                key={item.id}
                                item={item}
                                onRemix={onRemix}
                                onSchedule={(item) => onRemix?.(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>Aucun contenu trouvé</h3>
                        <p>Essayez de modifier vos filtres ou votre recherche</p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spinning { animation: spin 1s linear infinite; }
      `}</style>
        </>
    );
}
