import { X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
    if (!message) return null;

    return (
        <div className={`toast ${type}`}>
            <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span style={{ flex: 1 }}>{message}</span>
            <button className="btn-ghost" onClick={onClose} style={{ padding: 4, cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-tertiary)' }}>
                <X size={14} />
            </button>
        </div>
    );
}
