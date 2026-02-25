import { v4 as uuidv4 } from 'uuid';

// In-memory post queue (persists during server runtime)
const postQueue = [];

function addToQueue(post) {
    const newPost = {
        id: uuidv4(),
        ...post,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        scheduledAt: post.scheduledAt || new Date(Date.now() + 3600000).toISOString()
    };
    postQueue.push(newPost);
    return newPost;
}

function getQueue(filters = {}) {
    let queue = [...postQueue];

    if (filters.status) {
        queue = queue.filter(p => p.status === filters.status);
    }
    if (filters.platform) {
        queue = queue.filter(p => p.targetPlatform === filters.platform);
    }

    queue.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    return queue;
}

function updatePostStatus(id, status) {
    const post = postQueue.find(p => p.id === id);
    if (post) {
        post.status = status;
        post.updatedAt = new Date().toISOString();
        if (status === 'published') {
            post.publishedAt = new Date().toISOString();
        }
        return post;
    }
    return null;
}

function removeFromQueue(id) {
    const index = postQueue.findIndex(p => p.id === id);
    if (index !== -1) {
        return postQueue.splice(index, 1)[0];
    }
    return null;
}

function reorderQueue(orderedIds) {
    const reordered = [];
    for (const id of orderedIds) {
        const post = postQueue.find(p => p.id === id);
        if (post) reordered.push(post);
    }
    // Add any posts not in the ordered list at the end
    for (const post of postQueue) {
        if (!orderedIds.includes(post.id)) reordered.push(post);
    }
    postQueue.length = 0;
    postQueue.push(...reordered);
    return postQueue;
}

function getAnalytics() {
    const total = postQueue.length;
    const published = postQueue.filter(p => p.status === 'published').length;
    const scheduled = postQueue.filter(p => p.status === 'scheduled').length;
    const failed = postQueue.filter(p => p.status === 'failed').length;
    const draft = postQueue.filter(p => p.status === 'draft').length;

    const byPlatform = {};
    postQueue.forEach(p => {
        if (!byPlatform[p.targetPlatform]) {
            byPlatform[p.targetPlatform] = { total: 0, published: 0, scheduled: 0 };
        }
        byPlatform[p.targetPlatform].total++;
        if (p.status === 'published') byPlatform[p.targetPlatform].published++;
        if (p.status === 'scheduled') byPlatform[p.targetPlatform].scheduled++;
    });

    // Generate demo analytics data
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        weeklyData.push({
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
            posts: Math.floor(Math.random() * 8) + 2,
            engagement: Math.floor(Math.random() * 15000) + 3000,
            views: Math.floor(Math.random() * 150000) + 30000,
            newFollowers: Math.floor(Math.random() * 500) + 50
        });
    }

    const platformPerformance = [
        { platform: 'youtube', name: 'YouTube', posts: 12, avgViews: 45200, avgEngagement: 8.2, growth: '+12%', color: '#FF0000' },
        { platform: 'tiktok', name: 'TikTok', posts: 28, avgViews: 127800, avgEngagement: 14.5, growth: '+34%', color: '#00F2EA' },
        { platform: 'instagram', name: 'Instagram', posts: 18, avgViews: 32100, avgEngagement: 6.8, growth: '+8%', color: '#E1306C' },
        { platform: 'facebook', name: 'Facebook', posts: 8, avgViews: 18400, avgEngagement: 4.2, growth: '+5%', color: '#1877F2' }
    ];

    return {
        overview: { total, published, scheduled, failed, draft },
        byPlatform,
        weeklyData,
        platformPerformance,
        topMetrics: {
            totalViews: '2.4M',
            totalEngagement: '186K',
            avgViralityScore: 78,
            bestPlatform: 'TikTok',
            bestTime: 'Vendredi 17h',
            contentRemixed: 66
        }
    };
}

// Seed some demo posts
function seedDemoData() {
    const demoPosts = [
        {
            title: "🔥 The REAL Truth About AI in 2026 (2026 Edition)",
            targetPlatform: 'youtube',
            description: "Our deep dive into the AI revolution...",
            hashtags: ['#ai', '#tech', '#trending'],
            status: 'published',
            scheduledAt: new Date(Date.now() - 86400000).toISOString(),
            publishedAt: new Date(Date.now() - 82800000).toISOString(),
            originalTitle: "I Tried AI For 30 Days",
            viralityScore: 92
        },
        {
            title: "POV: When the algorithm gets it right 🎯 #fyp",
            targetPlatform: 'tiktok',
            description: "Our take on viral content...",
            hashtags: ['#fyp', '#viral', '#trending'],
            status: 'published',
            scheduledAt: new Date(Date.now() - 43200000).toISOString(),
            publishedAt: new Date(Date.now() - 39600000).toISOString(),
            originalTitle: "POV: When the AI does your homework",
            viralityScore: 88
        },
        {
            title: "✨ The productivity hack that changed everything ✨",
            targetPlatform: 'instagram',
            description: "Save this for later...",
            hashtags: ['#productivity', '#lifehack', '#instagood'],
            status: 'scheduled',
            scheduledAt: new Date(Date.now() + 7200000).toISOString(),
            originalTitle: "Morning routine that changed everything",
            viralityScore: 85
        },
        {
            title: "⚡ Why Everyone is Wrong About Crypto [FULL BREAKDOWN]",
            targetPlatform: 'youtube',
            description: "Complete analysis...",
            hashtags: ['#crypto', '#bitcoin', '#trending'],
            status: 'scheduled',
            scheduledAt: new Date(Date.now() + 14400000).toISOString(),
            originalTitle: "Why Everyone is Wrong About Cryptocurrency",
            viralityScore: 81
        },
        {
            title: "Wait for it... This science fact will blow your mind 🤯",
            targetPlatform: 'tiktok',
            description: "Science explained differently...",
            hashtags: ['#science', '#facts', '#fyp'],
            status: 'scheduled',
            scheduledAt: new Date(Date.now() + 28800000).toISOString(),
            originalTitle: "Scientists Just Made an INCREDIBLE Discovery",
            viralityScore: 79
        },
        {
            title: "📢 How This Small Business Beat The Odds — Share If You Agree!",
            targetPlatform: 'facebook',
            description: "Inspiring story...",
            hashtags: ['#business', '#motivation', '#share'],
            status: 'draft',
            scheduledAt: null,
            originalTitle: "How This Small Business Survived Against All Odds",
            viralityScore: 74
        }
    ];

    demoPosts.forEach(post => {
        postQueue.push({
            id: uuidv4(),
            ...post,
            createdAt: new Date(Date.now() - Math.random() * 172800000).toISOString()
        });
    });
}

seedDemoData();

export { addToQueue, getQueue, updatePostStatus, removeFromQueue, reorderQueue, getAnalytics };
