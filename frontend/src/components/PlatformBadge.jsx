export default function PlatformBadge({ platform, size = 'md' }) {
    const labels = {
        youtube: '▶ YouTube',
        tiktok: '♪ TikTok',
        instagram: '◉ Instagram',
        facebook: '◆ Facebook'
    };

    return (
        <span className={`platform-badge ${platform} ${size}`}>
            {labels[platform] || platform}
        </span>
    );
}
