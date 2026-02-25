import { LayoutDashboard, TrendingUp, Edit3, Calendar, BarChart3, Settings, Zap } from 'lucide-react';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trending', label: 'Trending Feed', icon: TrendingUp, badge: 'Live' },
    { id: 'editor', label: 'Content Editor', icon: Edit3 },
    { id: 'queue', label: 'Post Queue', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ activePage, onNavigate }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h1>⚡ BuzzFlow</h1>
                <span>Social Media Aggregator</span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-label">Navigation</div>
                </div>

                {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <Icon className="icon" size={18} />
                            {item.label}
                            {item.badge && <span className="nav-badge">{item.badge}</span>}
                        </button>
                    );
                })}

                <div className="nav-section" style={{ marginTop: 'auto' }}>
                    <div className="nav-section-label">Système</div>
                </div>
                <button className="nav-item" onClick={() => { }}>
                    <Settings className="icon" size={18} />
                    Paramètres
                </button>
            </nav>

            <div className="sidebar-footer">
                <div className="status-indicator">
                    <span className="status-dot"></span>
                    <span>Mode Démo Actif</span>
                    <Zap size={12} style={{ marginLeft: 'auto', color: 'var(--accent-orange)' }} />
                </div>
            </div>
        </aside>
    );
}
