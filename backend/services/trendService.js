import { v4 as uuidv4 } from 'uuid';

const platformConfigs = {
  youtube: { name: 'YouTube', color: '#FF0000', icon: '▶️', maxHashtags: 15, captionLength: 5000, format: '16:9' },
  tiktok: { name: 'TikTok', color: '#000000', icon: '🎵', maxHashtags: 5, captionLength: 300, format: '9:16' },
  instagram: { name: 'Instagram', color: '#E1306C', icon: '📸', maxHashtags: 30, captionLength: 2200, format: '1:1' },
  facebook: { name: 'Facebook', color: '#1877F2', icon: '👥', maxHashtags: 10, captionLength: 63206, format: '16:9' }
};

const trendingTopics = [
  'AI Revolution', 'Sustainable Living', 'Future of Work', 'Mental Health',
  'Crypto & Web3', 'Space Exploration', 'Gaming Culture', 'Street Food',
  'Fitness Hacks', 'Tech Reviews', 'Travel Vlogs', 'DIY Projects'
];

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

async function fetchYouTubeTrends(maxResults = 10) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey === 'your_youtube_api_key_here') {
    console.log('No YouTube API key — using demo data');
    return null;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=FR&maxResults=${maxResults}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      console.error('YouTube API error:', data.error?.message);
      return null;
    }

    return data.items.map(item => {
      const views = parseInt(item.statistics.viewCount || 0);
      const likes = parseInt(item.statistics.likeCount || 0);
      const comments = parseInt(item.statistics.commentCount || 0);
      const shares = Math.round(views * 0.02);
      const engagementRate = views > 0 ? ((likes + comments + shares) / views * 100).toFixed(1) : 0;

      return {
        id: item.id,
        platform: 'youtube',
        platformConfig: platformConfigs.youtube,
        title: item.snippet.title,
        topic: item.snippet.categoryId || 'Trending',
        creator: {
          name: item.snippet.channelTitle,
          avatar: '▶️'
        },
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        stats: {
          views, viewsFormatted: formatNumber(views),
          likes, likesFormatted: formatNumber(likes),
          comments, commentsFormatted: formatNumber(comments),
          shares, sharesFormatted: formatNumber(shares),
          engagementRate: parseFloat(engagementRate)
        },
        viralityScore: Math.min(100, Math.round(50 + (parseFloat(engagementRate) * 3))),
        hashtags: (item.snippet.tags || []).slice(0, 5),
        publishedAt: item.snippet.publishedAt,
        hoursAgo: Math.round((Date.now() - new Date(item.snippet.publishedAt)) / 3600000),
        originalUrl: `https://youtube.com/watch?v=${item.id}`,
        duration: '0:00',
        isReal: true
      };
    });
  } catch (err) {
    console.error('YouTube fetch error:', err.message);
    return null;
  }
}

function generateDemoContent(count = 20) {
  const platforms = ['youtube', 'tiktok', 'instagram', 'facebook'];
  const demoTitles = {
    youtube: ["I Tried AI For 30 Days", "The TRUTH About Social Media", "Building a $1M Business From My Phone"],
    tiktok: ["POV: When the AI does your homework", "Things only 2026 kids understand", "Wait for it..."],
    instagram: ["Golden hour never disappoints", "Morning routine that changed everything", "This view was worth the hike"],
    facebook: ["BREAKING: New study reveals AI facts", "5 Home Improvements That Add Value", "Local community raises $50K"]
  };

  return Array.from({ length: count }, (_, i) => {
    const platform = platforms[i % platforms.length];
    const titles = demoTitles[platform];
    const views = randomInt(100000, 50000000);
    const likes = Math.round(views * (Math.random() * 0.12 + 0.03));
    const comments = Math.round(views * (Math.random() * 0.025 + 0.005));
    const shares = Math.round(views * (Math.random() * 0.07 + 0.01));
    const engagementRate = ((likes + comments + shares) / views * 100).toFixed(1);

    return {
      id: uuidv4(),
      platform,
      platformConfig: platformConfigs[platform],
      title: titles[i % titles.length],
      topic: trendingTopics[i % trendingTopics.length],
      creator: { name: 'Demo Creator', avatar: '🎬' },
      thumbnail: `https://picsum.photos/seed/${i + 1}/640/360`,
      stats: {
        views, viewsFormatted: formatNumber(views),
        likes, likesFormatted: formatNumber(likes),
        comments, commentsFormatted: formatNumber(comments),
        shares, sharesFormatted: formatNumber(shares),
        engagementRate: parseFloat(engagementRate)
      },
      viralityScore: randomInt(60, 99),
      hashtags: ['#trending', '#viral', '#fyp'].slice(0, platformConfigs[platform].maxHashtags),
      publishedAt: new Date(Date.now() - randomInt(1, 72) * 3600000).toISOString(),
      hoursAgo: randomInt(1, 72),
      originalUrl: `https://${platform}.com/demo_${i}`,
      duration: platform === 'tiktok' ? `0:${randomInt(15, 60)}` : `${randomInt(1, 30)}:00`,
      isReal: false
    };
  }).sort((a, b) => b.viralityScore - a.viralityScore);
}

async function generateTrendingContent(count = 30) {
  const youtubeReal = await fetchYouTubeTrends(10);
  const demo = generateDemoContent(count);

  if (youtubeReal) {
    const combined = [...youtubeReal, ...demo.filter(d => d.platform !== 'youtube')];
    return combined.sort((a, b) => b.viralityScore - a.viralityScore).slice(0, count);
  }

  return demo.slice(0, count);
}

async function searchTrends(query, platform = null) {
  let content = await generateTrendingContent(40);
  if (platform) content = content.filter(c => c.platform === platform);
  if (query) {
    const q = query.toLowerCase();
    content = content.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q)
    );
  }
  return content;
}

export { generateTrendingContent, searchTrends, platformConfigs, trendingTopics };
