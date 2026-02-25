import PlatformBadge from './PlatformBadge';
import { Eye, Heart, MessageCircle, Share2, Sparkles, ExternalLink } from 'lucide-react';

export default function TrendCard({ item, onRemix, onSchedule }) {
    const scoreColor = item.viralityScore >= 85 ? '#10b981' :
        item.viralityScore >= 70 ? '#f59e0b' : '#ef4444';

    return (
        <div className="trend-card">
            <div className="trend-card-thumbnail">
                <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                <span className="duration">{item.duration}</span>
                <div className="platform-badge-wrapper" style={{ position: 'absolute', top: 8, left: 8 }}>
                    <PlatformBadge platform={item.platform} />
                </div>
                <div
                    className="virality-badge"
                    style={{ color: scoreColor }}
                >
                    🔥 {item.viralityScore}
                </div>
            </div>

            <div className="trend-card-body">
                <div className="trend-card-title">{item.title}</div>
                <div className="trend-card-meta">
                    <span className="avatar">{item.creator.avatar}</span>
                    <span>{item.creator.name}</span>
                    <span>•</span>
                    <span>{item.hoursAgo}h ago</span>
                </div>
            </div>

            <div className="trend-card-stats">
                <div><Eye size={13} /> {item.stats.viewsFormatted}</div>
                <div><Heart size={13} /> {item.stats.likesFormatted}</div>
                <div><MessageCircle size={13} /> {item.stats.commentsFormatted}</div>
                <div><Share2 size={13} /> {item.stats.sharesFormatted}</div>
            </div>

            <div className="trend-card-actions">
                <button className="btn btn-primary btn-sm" onClick={() => onRemix?.(item)}>
                    <Sparkles size={14} /> Remixer
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => onSchedule?.(item)}>
                    <ExternalLink size={14} /> Programmer
                </button>
            </div>
        </div>
    );
}
