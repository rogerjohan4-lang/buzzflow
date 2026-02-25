import { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import PlatformBadge from '../components/PlatformBadge';
import { Calendar, CheckCircle, Clock, Trash2, Play, GripVertical, AlertCircle } from 'lucide-react';

export default function PostQueue({ onToast }) {
    const [queue, setQueue] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadQueue(); }, []);

    async function loadQueue() {
        setLoading(true);
        try {
            const res = await postAPI.getQueue();
            setQueue(res.data);
        } catch (err) {
            console.error('Failed to load queue:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handlePublish(id) {
        try {
            await postAPI.updateStatus(id, 'published');
            onToast?.('✅ Post publié avec succès !', 'success');
            loadQueue();
        } catch (err) {
            onToast?.('❌ Erreur lors de la publication', 'error');
        }
    }

    async function handleDelete(id) {
        try {
            await postAPI.remove(id);
            onToast?.('🗑️ Post supprimé', 'info');
            loadQueue();
        } catch (err) {
            onToast?.('❌ Erreur lors de la suppression', 'error');
        }
    }

    const filteredQueue = filter === 'all'
        ? queue
        : queue.filter(p => p.status === filter);

    const statusCounts = {
        all: queue.length,
        scheduled: queue.filter(p => p.status === 'scheduled').length,
        published: queue.filter(p => p.status === 'published').length,
        draft: queue.filter(p => p.status === 'draft').length,
        failed: queue.filter(p => p.status === 'failed').length
    };

    function formatDate(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' à ' +
            d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <>
            <div className="page-header">
                <h2>📅 File de Publication</h2>
                <p>Gérez vos publications programmées et suivez leur statut</p>
            </div>

            <div className="page-content">
                {/* Status Filters */}
                <div className="stats-grid" style={{ marginBottom: 20 }}>
                    {[
                        { key: 'all', label: 'Total', icon: '📋', bg: 'rgba(124, 58, 237, 0.1)' },
                        { key: 'scheduled', label: 'Programmés', icon: '⏰', bg: 'rgba(59, 130, 246, 0.1)' },
                        { key: 'published', label: 'Publiés', icon: '✅', bg: 'rgba(16, 185, 129, 0.1)' },
                        { key: 'draft', label: 'Brouillons', icon: '📝', bg: 'rgba(245, 158, 11, 0.1)' }
                    ].map(s => (
                        <div
                            key={s.key}
                            className={`stat-card ${filter === s.key ? 'active' : ''}`}
                            onClick={() => setFilter(s.key)}
                            style={{
                                cursor: 'pointer',
                                border: filter === s.key ? '1px solid var(--accent-purple)' : undefined
                            }}
                        >
                            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                            <div className="stat-value">{statusCounts[s.key]}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Queue List */}
                {loading ? (
                    <div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton" style={{ height: 72, marginBottom: 8, borderRadius: 'var(--radius-lg)' }}></div>
                        ))}
                    </div>
                ) : filteredQueue.length > 0 ? (
                    <div>
                        {filteredQueue.map(post => (
                            <div key={post.id} className="queue-item">
                                <div className="drag-handle">
                                    <GripVertical size={16} />
                                </div>

                                <PlatformBadge platform={post.targetPlatform} />

                                <div className="post-info">
                                    <div className="post-title">{post.title}</div>
                                    <div className="post-meta">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={12} />
                                            {post.scheduledAt ? formatDate(post.scheduledAt) : 'Non programmé'}
                                        </span>
                                        {post.viralityScore && (
                                            <span>🔥 {post.viralityScore}</span>
                                        )}
                                        {post.hashtags && (
                                            <span style={{ color: 'var(--accent-blue)' }}>
                                                {post.hashtags.slice(0, 2).join(' ')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <span className={`status-badge ${post.status}`}>
                                    {post.status === 'published' ? 'Publié' :
                                        post.status === 'scheduled' ? 'Programmé' :
                                            post.status === 'draft' ? 'Brouillon' : 'Échoué'}
                                </span>

                                <div style={{ display: 'flex', gap: 4 }}>
                                    {post.status !== 'published' && (
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => handlePublish(post.id)}
                                            title="Publier maintenant"
                                        >
                                            <Play size={14} />
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        onClick={() => handleDelete(post.id)}
                                        title="Supprimer"
                                        style={{ color: 'var(--accent-red)' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h3>File d'attente vide</h3>
                        <p>Remixez des contenus tendance pour les ajouter ici</p>
                    </div>
                )}
            </div>
        </>
    );
}
