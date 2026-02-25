import { useState, useEffect } from 'react';
import { contentAPI, postAPI } from '../services/api';
import PlatformBadge from '../components/PlatformBadge';
import { Sparkles, Wand2, Hash, Clock, Send, RefreshCw, ArrowRight, CheckCircle } from 'lucide-react';

const targetPlatforms = ['youtube', 'tiktok', 'instagram', 'facebook'];

export default function ContentEditor({ selectedContent, onToast }) {
    const [content, setContent] = useState(selectedContent || null);
    const [remixedVersions, setRemixedVersions] = useState([]);
    const [activePlatform, setActivePlatform] = useState('youtube');
    const [editing, setEditing] = useState({
        title: '',
        description: '',
        hashtags: []
    });
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [bestTimes, setBestTimes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedContent) {
            setContent(selectedContent);
            handleRemix(selectedContent);
        }
    }, [selectedContent]);

    useEffect(() => {
        loadBestTimes(activePlatform);
    }, [activePlatform]);

    async function handleRemix(sourceContent) {
        setLoading(true);
        try {
            const res = await contentAPI.remix(sourceContent, targetPlatforms);
            setRemixedVersions(res.data);
            const first = res.data.find(r => r.targetPlatform === activePlatform) || res.data[0];
            if (first) {
                setEditing({
                    title: first.title,
                    description: first.description,
                    hashtags: first.hashtags
                });
                setActivePlatform(first.targetPlatform);
            }
        } catch (err) {
            console.error('Remix failed:', err);
        } finally {
            setLoading(false);
        }
    }

    async function loadTitleSuggestions() {
        if (!content) return;
        try {
            const res = await contentAPI.suggestTitle(content.title, activePlatform);
            setTitleSuggestions(res.data);
        } catch (err) {
            console.error('Title suggestions failed:', err);
        }
    }

    async function loadBestTimes(platform) {
        try {
            const res = await contentAPI.getBestTimes(platform);
            setBestTimes(res.data);
        } catch (err) {
            console.error('Best times failed:', err);
        }
    }

    function handlePlatformChange(platform) {
        setActivePlatform(platform);
        const version = remixedVersions.find(r => r.targetPlatform === platform);
        if (version) {
            setEditing({
                title: version.title,
                description: version.description,
                hashtags: version.hashtags
            });
        }
        setTitleSuggestions([]);
    }

    async function handleSchedule() {
        try {
            await postAPI.schedule({
                title: editing.title,
                description: editing.description,
                hashtags: editing.hashtags,
                targetPlatform: activePlatform,
                originalTitle: content?.title,
                viralityScore: content?.viralityScore,
                scheduledAt: new Date(Date.now() + 3600000).toISOString()
            });
            onToast?.('✅ Post programmé avec succès !', 'success');
        } catch (err) {
            onToast?.('❌ Erreur lors de la programmation', 'error');
        }
    }

    if (!content) {
        return (
            <>
                <div className="page-header">
                    <h2>✏️ Content Editor</h2>
                    <p>Remixez et optimisez vos contenus pour chaque plateforme</p>
                </div>
                <div className="page-content">
                    <div className="empty-state">
                        <div className="empty-icon">✏️</div>
                        <h3>Aucun contenu sélectionné</h3>
                        <p>Allez dans le Trending Feed et cliquez sur "Remixer" pour commencer</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2>✏️ Content Editor</h2>
                        <p>Remixez <strong>"{content.title.substring(0, 40)}..."</strong></p>
                    </div>
                    <button className="btn btn-primary" onClick={handleSchedule}>
                        <Send size={16} /> Programmer le post
                    </button>
                </div>
            </div>

            <div className="page-content">
                {/* Source content info */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: '1.5rem' }}>{content.creator.avatar}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{content.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', gap: 12, marginTop: 4 }}>
                                <PlatformBadge platform={content.platform} />
                                <span>{content.creator.name}</span>
                                <span>🔥 Score: {content.viralityScore}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Tabs */}
                <div className="preview-tabs" style={{ marginBottom: 20 }}>
                    {targetPlatforms.map(p => (
                        <button
                            key={p}
                            className={`preview-tab ${activePlatform === p ? 'active' : ''}`}
                            onClick={() => handlePlatformChange(p)}
                        >
                            <PlatformBadge platform={p} />
                        </button>
                    ))}
                </div>

                <div className="editor-layout">
                    {/* Editor Panel */}
                    <div className="editor-panel">
                        <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Wand2 size={18} /> Éditeur de Contenu
                        </h3>

                        <div className="editor-field">
                            <label>Titre Remixé</label>
                            <input
                                type="text"
                                value={editing.title}
                                onChange={e => setEditing({ ...editing, title: e.target.value })}
                            />
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={loadTitleSuggestions}
                                style={{ marginTop: 8, fontSize: '0.75rem' }}
                            >
                                <Sparkles size={12} /> Générer des suggestions
                            </button>

                            {titleSuggestions.length > 0 && (
                                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {titleSuggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            className="btn btn-ghost btn-sm"
                                            style={{ justifyContent: 'flex-start', fontSize: '0.8rem' }}
                                            onClick={() => setEditing({ ...editing, title: s })}
                                        >
                                            <ArrowRight size={12} /> {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="editor-field">
                            <label>Description</label>
                            <textarea
                                value={editing.description}
                                onChange={e => setEditing({ ...editing, description: e.target.value })}
                                rows={6}
                            />
                        </div>

                        <div className="editor-field">
                            <label><Hash size={14} /> Hashtags Optimisés</label>
                            <div className="hashtag-list">
                                {editing.hashtags.map((tag, i) => (
                                    <span key={i} className="hashtag">{tag}</span>
                                ))}
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={async () => {
                                    try {
                                        const res = await contentAPI.suggestHashtags(content.topic, activePlatform, 10);
                                        setEditing({ ...editing, hashtags: res.data });
                                    } catch { }
                                }}
                                style={{ marginTop: 8, fontSize: '0.75rem' }}
                            >
                                <RefreshCw size={12} /> Régénérer les hashtags
                            </button>
                        </div>
                    </div>

                    {/* Preview + Best Times Panel */}
                    <div>
                        {/* Preview */}
                        <div className="preview-panel" style={{ marginBottom: 16 }}>
                            <h4 style={{ fontSize: '0.85rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <PlatformBadge platform={activePlatform} /> Aperçu
                            </h4>
                            <div className="preview-mockup">
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>
                                    {editing.title}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginBottom: 12, lineHeight: 1.6 }}>
                                    {editing.description?.substring(0, 200)}{editing.description?.length > 200 ? '...' : ''}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    {editing.hashtags.map((tag, i) => (
                                        <span key={i} style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Best Times */}
                        <div className="preview-panel">
                            <h4 style={{ fontSize: '0.85rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Clock size={16} /> Horaires Optimaux
                            </h4>
                            <table className="timing-table">
                                <thead>
                                    <tr>
                                        <th>Jour</th>
                                        <th>Heure</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bestTimes.map((t, i) => (
                                        <tr key={i}>
                                            <td>{t.day}</td>
                                            <td style={{ fontFamily: 'var(--font-mono)' }}>{t.time}</td>
                                            <td>
                                                <div className="timing-score">
                                                    <div className="timing-score-bar">
                                                        <div className="timing-score-bar-fill" style={{ width: `${t.score}%` }}></div>
                                                    </div>
                                                    {t.score}%
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
