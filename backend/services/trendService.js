import { v4 as uuidv4 } from 'uuid';

// Realistic demo data for trending content across platforms
const platformConfigs = {
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    icon: '▶️',
    maxHashtags: 15,
    captionLength: 5000,
    format: '16:9'
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    icon: '🎵',
    maxHashtags: 5,
    captionLength: 300,
    format: '9:16'
  },
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    icon: '📸',
    maxHashtags: 30,
    captionLength: 2200,
    format: '1:1'
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    icon: '👥',
    maxHashtags: 10,
    captionLength: 63206,
    format: '16:9'
  }
};

const trendingTopics = [
  'AI Revolution', 'Sustainable Living', 'Future of Work', 'Mental Health',
  'Crypto & Web3', 'Space Exploration', 'Gaming Culture', 'Street Food',
  'Fitness Hacks', 'Tech Reviews', 'Travel Vlogs', 'DIY Projects',
  'Fashion Trends', 'Music Covers', 'Comedy Sketches', 'Life Hacks',
  'Science Facts', 'Startup Stories', 'Photography Tips', 'Cooking Recipes'
];

const creators = [
  { name: 'TechVision Pro', followers: '2.4M', avatar: '🤖' },
  { name: 'Creative Studios', followers: '1.8M', avatar: '🎨' },
  { name: 'Daily Dose', followers: '5.2M', avatar: '☀️' },
  { name: 'Viral Moments', followers: '3.1M', avatar: '🔥' },
  { name: 'The Explorer', followers: '890K', avatar: '🌍' },
  { name: 'FitLife Coach', followers: '1.5M', avatar: '💪' },
  { name: 'CodeMaster', followers: '720K', avatar: '💻' },
  { name: 'FoodieNation', followers: '4.3M', avatar: '🍕' },
  { name: 'Music Factory', followers: '2.8M', avatar: '🎶' },
  { name: 'DesignPulse', followers: '1.1M', avatar: '✨' },
  { name: 'ScienceHub', followers: '3.7M', avatar: '🔬' },
  { name: 'GamerZone', followers: '6.1M', avatar: '🎮' },
  { name: 'StreetStyle', followers: '950K', avatar: '👗' },
  { name: 'LaughFactory', followers: '4.8M', avatar: '😂' },
  { name: 'DIY Master', followers: '2.1M', avatar: '🔧' }
];

const titles = {
  youtube: [
    "I Tried AI For 30 Days and This Happened...",
    "The TRUTH About Social Media in 2026",
    "How I Built a $1M Business From My Phone",
    "This Simple Trick Changed My Life Forever",
    "We Tested Every AI Tool So You Don't Have To",
    "The Future of Technology is HERE (Mind Blown)",
    "I Quit My Job to Travel the World - 1 Year Update",
    "Why Everyone is Wrong About Cryptocurrency",
    "Building the ULTIMATE Smart Home Setup",
    "24 Hours Using Only AI to Run My Business",
    "Scientists Just Made an INCREDIBLE Discovery",
    "The Dark Side of Social Media Nobody Talks About",
    "I Lived Like a Millionaire for a Week",
    "This Hidden Feature Will Change How You Use Your Phone",
    "Why This Video Will Get 10 Million Views"
  ],
  tiktok: [
    "POV: When the AI does your homework 📚✨",
    "Things only 2026 kids understand 😭",
    "Wait for it... 🤯 #mindblown",
    "My boss when I automate his entire job 💀",
    "The gym hack nobody told you about 💪",
    "Cooking the viral cloud bread recipe ☁️🍞",
    "This sound hits different at 3am 🎵",
    "Day 47 of asking my crush out 💀❤️",
    "POV: You discovered this life hack too late",
    "The transition that broke TikTok ✨",
    "Testing if this viral trend actually works",
    "My reaction to my Spotify Wrapped 🎶😱",
    "When the algorithm finally gets you 🎯",
    "This is why I have trust issues 💔",
    "Making art with AI - the results are INSANE 🎨"
  ],
  instagram: [
    "Golden hour never disappoints ✨ #photography",
    "New collection drop 🔥 Link in bio",
    "Morning routine that changed everything ☀️",
    "This view was worth the 6-hour hike 🏔️",
    "Behind the scenes of our latest project 🎬",
    "Swipe to see the transformation →",
    "The details make all the difference ✨",
    "Sunday self-care essentials 🧖‍♀️",
    "Quick healthy meal prep for the week 🥗",
    "New city, new adventures 🌆",
    "Studio vibes today 🎵",
    "The perfect workspace doesn't exis— 💻✨",
    "Sunset chasing in paradise 🌅",
    "Before vs After - 6 months of consistency 💪",
    "Art is not what you see, but what you make others see"
  ],
  facebook: [
    "BREAKING: New study reveals surprising facts about AI",
    "Share if you agree! 10 Things Parents Need to Know",
    "Local community raises $50K for children's hospital ❤️",
    "5 Easy Home Improvements That Add Serious Value",
    "This Teacher's Method is Going Viral - Here's Why",
    "Watch: Incredible rescue caught on camera 🎥",
    "The Recipe That Went Viral Last Week - Finally Revealed!",
    "Scientists Discover New Species in Deep Ocean 🌊",
    "How This Small Business Survived Against All Odds",
    "Warning: New Scam Targeting Online Shoppers",
    "Feel-Good Story: Dog Reunited With Owner After 3 Years",
    "The Garden Hack That's Saving People Thousands 🌱",
    "Expert Tips for Navigating the 2026 Job Market",
    "This Video Has 50 Million Views For Good Reason",
    "Why You Should Think Twice Before Throwing This Away ♻️"
  ]
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function generateViralityScore() {
  // Score between 0 and 100, weighted towards higher values for "trending"
  const base = randomFloat(55, 100);
  return Math.round(base);
}

function generateHashtags(topic, platform) {
  const universal = ['#viral', '#trending', '#fyp', '#foryou', '#explore'];
  const topicTags = {
    'AI Revolution': ['#ai', '#artificialintelligence', '#chatgpt', '#tech', '#future', '#innovation'],
    'Sustainable Living': ['#sustainable', '#eco', '#green', '#zerowaste', '#environment'],
    'Future of Work': ['#remote', '#freelance', '#career', '#hustle', '#entrepreneur'],
    'Mental Health': ['#mentalhealth', '#selfcare', '#wellness', '#mindfulness', '#therapy'],
    'Crypto & Web3': ['#crypto', '#bitcoin', '#web3', '#blockchain', '#nft'],
    'Space Exploration': ['#space', '#nasa', '#mars', '#astronomy', '#rocket'],
    'Gaming Culture': ['#gaming', '#gamer', '#esports', '#twitch', '#streamer'],
    'Street Food': ['#streetfood', '#foodie', '#cooking', '#recipe', '#delicious'],
    'Fitness Hacks': ['#fitness', '#gym', '#workout', '#health', '#gains'],
    'Tech Reviews': ['#tech', '#review', '#gadgets', '#apple', '#samsung'],
    'Travel Vlogs': ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation'],
    'DIY Projects': ['#diy', '#craft', '#handmade', '#creative', '#howto'],
    'Fashion Trends': ['#fashion', '#style', '#ootd', '#outfit', '#streetstyle'],
    'Music Covers': ['#music', '#cover', '#sing', '#musician', '#talent'],
    'Comedy Sketches': ['#comedy', '#funny', '#humor', '#meme', '#laugh'],
    'Life Hacks': ['#lifehack', '#tips', '#tricks', '#useful', '#didyouknow'],
    'Science Facts': ['#science', '#facts', '#education', '#learn', '#discovery'],
    'Startup Stories': ['#startup', '#business', '#founder', '#growth', '#sideproject'],
    'Photography Tips': ['#photography', '#photo', '#camera', '#composition', '#editing'],
    'Cooking Recipes': ['#recipe', '#cooking', '#homemade', '#kitchen', '#yummy']
  };

  const tags = [...(topicTags[topic] || []).slice(0, 3), ...universal.slice(0, 2)];
  const config = platformConfigs[platform];
  return tags.slice(0, config.maxHashtags);
}

function generateTrendingContent(count = 30) {
  const platforms = Object.keys(platformConfigs);
  const content = [];

  for (let i = 0; i < count; i++) {
    const platform = platforms[randomInt(0, platforms.length - 1)];
    const topic = trendingTopics[randomInt(0, trendingTopics.length - 1)];
    const creator = creators[randomInt(0, creators.length - 1)];
    const titleList = titles[platform];
    const title = titleList[randomInt(0, titleList.length - 1)];
    const views = randomInt(100000, 50000000);
    const likes = Math.round(views * randomFloat(0.03, 0.15));
    const comments = Math.round(views * randomFloat(0.005, 0.03));
    const shares = Math.round(views * randomFloat(0.01, 0.08));
    const engagementRate = ((likes + comments + shares) / views * 100).toFixed(1);
    const hoursAgo = randomInt(1, 72);

    content.push({
      id: uuidv4(),
      platform,
      platformConfig: platformConfigs[platform],
      title,
      topic,
      creator,
      thumbnail: `https://picsum.photos/seed/${i + Date.now()}/640/360`,
      stats: {
        views,
        viewsFormatted: formatNumber(views),
        likes,
        likesFormatted: formatNumber(likes),
        comments,
        commentsFormatted: formatNumber(comments),
        shares,
        sharesFormatted: formatNumber(shares),
        engagementRate: parseFloat(engagementRate)
      },
      viralityScore: generateViralityScore(),
      hashtags: generateHashtags(topic, platform),
      publishedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
      hoursAgo,
      originalUrl: `https://${platform}.com/watch?v=demo_${i}`,
      duration: platform === 'tiktok' ? `0:${randomInt(15, 60)}` : `${randomInt(1, 30)}:${String(randomInt(0, 59)).padStart(2, '0')}`
    });
  }

  // Sort by virality score descending
  content.sort((a, b) => b.viralityScore - a.viralityScore);
  return content;
}

function searchTrends(query, platform = null) {
  let content = generateTrendingContent(40);

  if (platform) {
    content = content.filter(c => c.platform === platform);
  }

  if (query) {
    const q = query.toLowerCase();
    content = content.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q) ||
      c.hashtags.some(h => h.toLowerCase().includes(q))
    );
  }

  return content;
}

export { generateTrendingContent, searchTrends, platformConfigs, trendingTopics };
