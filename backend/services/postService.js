import { v4 as uuidv4 } from 'uuid';
import { insertPost, getAllPosts, getPostById, updatePost, deletePost, getPostCount } from '../data/db.js';

function addToQueue(post) {
    const newPost = {
        id: uuidv4(),
        title: post.title,
        targetPlatform: post.targetPlatform,
        description: post.description || '',
        hashtags: post.hashtags || [],
        status: post.status || 'scheduled',
        scheduledAt: post.scheduledAt || new Date(Date.now() + 3600000).toISOString(),
        publishedAt: post.publishedAt || null,
        originalTitle: post.originalTitle || '',
        viralityScore: post.viralityScore || 0,
        createdAt: new Date().toISOString()
    };
    insertPost(newPost);
    return newPost;
}

function getQueue(filters = {}) {
    return getAllPosts(filters);
}

function updatePostStatus(id, status) {
    const updates = { status };
    if (status === 'published') updates.publishedAt = new Date().toISOString();
    return updatePost(id, updates);
}

function removeFromQueue(id) {
    return deletePost(id);
}

function getAnalytics() {
    const posts = getAllPosts();
    const total = posts.length;
    const published = posts.filter(p => p.status === 'published').length;
    const scheduled = posts.filter(p => p.status === 'scheduled').length;
    const failed = posts.filter(p => p.status === 'failed').length;
    const draft = posts.filter(p => p.status === 'draft').length;

    const byPlatform = {};
    posts.forEach(p => {
        if (!byPlatform[p.targetPlatform]) byPlatform[p.targetPlatform] = { total: 0, published: 0, scheduled: 0 };
        byPlatform[p.targetPlatform].total++;
        if (p.status === 'published') byPlatform[p.targetPlatform].published++;
        if (p.status === 'scheduled') byPlatform[p.targetPlatform].scheduled++;
    });

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
        { platform: 'youtube', name: 'YouTube', posts: byPlatform.youtube?.total || 0, avgViews: 45200, avgEngagement: 8.2, growth: '+12%', color: '#FF0000' },
        { platform: 'tiktok', name: 'TikTok', posts: byPlatform.tiktok?.total || 0, avgViews: 127800, avgEngagement: 14.5, growth: '+34%', color: '#00F2EA' },
        { platform: 'instagram', name: 'Instagram', posts: byPlatform.instagram?.total || 0, avgViews: 32100, avgEngagement: 6.8, growth: '+8%', color: '#E1306C' },
        { platform: 'facebook', name: 'Facebook', posts: byPlatform.facebook?.total || 0, avgViews: 18400, avgEngagement: 4.2, growth: '+5%', color: '#1877F2' }
    ];

    return {
        overview: { total, published, scheduled, failed, draft },
        byPlatform,
        weeklyData,
        platformPerformance,
        topMetrics: { totalViews: '2.4M', totalEngagement: '186K', avgViralityScore: 78, bestPlatform: 'TikTok', bestTime: 'Vendredi 17h', contentRemixed: total }
    };
}

function seedDemoData() {
    const count = getPostCount();
    if (count > 0) { console.log('DB already has ' + count + ' posts - skipping seed'); return; }
    const demoPosts = [
        { title: "The REAL Truth About AI in 2026", targetPlatform: 'youtube', description: "Deep dive...", hashtags: ['#ai', '#tech'], status: 'published', scheduledAt: new Date(Date.now() - 86400000).toISOString(), publishedAt: new Date(Date.now() - 82800000).toISOString(), originalTitle: "I Tried AI For 30 Days", viralityScore: 92 },
        { title: "POV: When the algorithm gets it right", targetPlatform: 'tiktok', description: "Viral...", hashtags: ['#fyp', '#viral'], status: 'published', scheduledAt: new Date(Date.now() - 43200000).toISOString(), publishedAt: new Date(Date.now() - 39600000).toISOString(), originalTitle: "POV: AI homework", viralityScore: 88 },
        { title: "The productivity hack that changed everything", targetPlatform: 'instagram', description: "Save this...", hashtags: ['#productivity'], status: 'scheduled', scheduledAt: new Date(Date.now() + 7200000).toISOString(), originalTitle: "Morning routine", viralityScore: 85 },
        { title: "Why Everyone is Wrong About Crypto", targetPlatform: 'youtube', description: "Analysis...", hashtags: ['#crypto'], status: 'scheduled', scheduledAt: new Date(Date.now() + 14400000).toISOString(), originalTitle: "Crypto breakdown", viralityScore: 81 },
        { title: "Wait for it... mindblown", targetPlatform: 'tiktok', description: "Science...", hashtags: ['#science', '#fyp'], status: 'scheduled', scheduledAt: new Date(Date.now() + 28800000).toISOString(), originalTitle: "Science discovery", viralityScore: 79 },
        { title: "How This Small Business Beat The Odds", targetPlatform: 'facebook', description: "Inspiring...", hashtags: ['#business'], status: 'draft', scheduledAt: null, originalTitle: "Small business story", viralityScore: 74 }
    ];
    demoPosts.forEach(post => addToQueue(post));
    console.log('Seeded ' + demoPosts.length + ' demo posts into SQLite');
}


function reorderQueue(orderedIds) {
    const posts = getAllPosts();
    orderedIds.forEach((id, index) => {
        const post = posts.find(p => p.id === id);
        if (post && post.scheduledAt) {
            const base = new Date(post.scheduledAt).getTime();
            updatePost(id, { scheduledAt: new Date(base + index).toISOString() });
        }
    });
    return getAllPosts();
}

export { addToQueue, getQueue, updatePostStatus, removeFromQueue, reorderQueue, getAnalytics, seedDemoData };
