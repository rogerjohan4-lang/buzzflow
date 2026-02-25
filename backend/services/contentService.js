import { v4 as uuidv4 } from 'uuid';

const remixTemplates = {
    youtube: {
        titlePrefixes: [
            "🔥 ", "⚡ ", "🚀 ", "💡 ", "🎯 ",
            "REVEALED: ", "UPDATED: ", "The REAL ", "Why ", "How "
        ],
        titleSuffixes: [
            " (2026 Edition)", " | Complete Guide", " - You Need To See This",
            " [FULL BREAKDOWN]", " | Expert Analysis", " — Honest Review"
        ],
        descriptionTemplates: [
            "In this video, we break down {topic} and share our unique perspective on why this matters in 2026.\n\n🔔 Subscribe for more content like this!\n\n⏱️ Timestamps:\n00:00 - Introduction\n01:30 - Key Insights\n05:00 - Deep Dive\n08:30 - Our Take\n10:00 - Conclusion\n\n#trending #viral",
            "Everyone's talking about {topic} — but here's what they're NOT telling you.\n\nWe did the research so you don't have to. In this comprehensive breakdown, we cover everything you need to know.\n\n👇 Drop a comment with your thoughts!\n\n🔔 Don't forget to like and subscribe!"
        ]
    },
    tiktok: {
        titlePrefixes: [
            "POV: ", "Wait for it... ", "Part 2: ", "Replying to @viewer: ",
            "No one talks about ", "Watch till the end 👀 "
        ],
        titleSuffixes: [
            " #fyp", " 🤯", " (mind blown)", " ✨", " 💀"
        ],
        descriptionTemplates: [
            "Remixed take on {topic} 🔥 What do you think? #fyp #viral #trending",
            "Our perspective on {topic} hits different 🎯 #foryou #trending"
        ]
    },
    instagram: {
        titlePrefixes: [
            "✨ ", "📍 ", "🔥 ", "💫 ", "🎯 "
        ],
        titleSuffixes: [
            " ✨", " | Swipe →", " 📸", " (Save this!)", " 💡"
        ],
        descriptionTemplates: [
            "Our take on {topic} ✨\n\nWhat's your experience with this? Share below 👇\n\n.\n.\n.\n#trending #viral #explore #instagood #reels",
            "Breaking down {topic} in a way that actually makes sense 🎯\n\nSave this for later! 🔖\n\n#trending #viral #explore #fyp #reels"
        ]
    },
    facebook: {
        titlePrefixes: [
            "📢 ", "JUST IN: ", "MUST READ: ", "🔴 LIVE: ", "Share This: "
        ],
        titleSuffixes: [
            " — Share If You Agree!", " (Everyone Needs To See This)",
            " | Full Story Below", " — Thoughts?", ""
        ],
        descriptionTemplates: [
            "We took a deep dive into {topic} and here's what we found:\n\n🔹 Key Insight 1: The data speaks for itself\n🔹 Key Insight 2: What experts are saying\n🔹 Key Insight 3: What this means for you\n\nWhat do you think? Drop your thoughts in the comments! 👇\n\nShare this with someone who needs to see it!",
            "Everyone's talking about {topic}, but nobody is addressing the real issue.\n\nHere's our breakdown with added context and expert analysis.\n\nLike & Share if you found this helpful! ❤️"
        ]
    }
};

const hashtagSuggestions = {
    general: ['#trending', '#viral', '#2026', '#mustwatch', '#foryou'],
    youtube: ['#youtube', '#youtuber', '#subscribe', '#video', '#content'],
    tiktok: ['#fyp', '#foryoupage', '#tiktok', '#tiktokviral', '#trend'],
    instagram: ['#instagood', '#reels', '#explore', '#instagram', '#ig'],
    facebook: ['#facebook', '#share', '#community', '#news', '#story']
};

function generateRemixedTitle(originalTitle, targetPlatform) {
    const templates = remixTemplates[targetPlatform];
    const prefix = templates.titlePrefixes[Math.floor(Math.random() * templates.titlePrefixes.length)];
    const suffix = templates.titleSuffixes[Math.floor(Math.random() * templates.titleSuffixes.length)];

    // Clean up original title
    let cleaned = originalTitle
        .replace(/^(POV:|BREAKING:|JUST IN:|📢|🔥|⚡|🚀|💡|🎯|✨)\s*/gi, '')
        .replace(/\s*(#\w+\s*)+$/g, '')
        .replace(/\s*[\|—\-]\s*.*$/, '')
        .trim();

    // Ensure title isn't too long
    if (cleaned.length > 60) {
        cleaned = cleaned.substring(0, 57) + '...';
    }

    return `${prefix}${cleaned}${suffix}`;
}

function generateRemixedDescription(topic, targetPlatform) {
    const templates = remixTemplates[targetPlatform].descriptionTemplates;
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace(/{topic}/g, topic);
}

function generateOptimizedHashtags(topic, targetPlatform, count = 8) {
    const topicTag = '#' + topic.toLowerCase().replace(/[^a-z0-9]/g, '');
    const platformTags = hashtagSuggestions[targetPlatform] || [];
    const generalTags = hashtagSuggestions.general;

    const tags = [topicTag, ...platformTags.slice(0, 3), ...generalTags.slice(0, count - 4)];
    return [...new Set(tags)].slice(0, count);
}

function generateTimingSuggestion(targetPlatform) {
    const optimalTimes = {
        youtube: [
            { day: 'Lundi', time: '14:00', score: 85 },
            { day: 'Mercredi', time: '17:00', score: 92 },
            { day: 'Vendredi', time: '15:00', score: 88 },
            { day: 'Samedi', time: '10:00', score: 95 },
            { day: 'Dimanche', time: '11:00', score: 90 }
        ],
        tiktok: [
            { day: 'Mardi', time: '19:00', score: 94 },
            { day: 'Jeudi', time: '12:00', score: 88 },
            { day: 'Vendredi', time: '17:00', score: 96 },
            { day: 'Samedi', time: '21:00', score: 91 },
            { day: 'Dimanche', time: '15:00', score: 87 }
        ],
        instagram: [
            { day: 'Lundi', time: '11:00', score: 89 },
            { day: 'Mercredi', time: '11:00', score: 93 },
            { day: 'Vendredi', time: '10:00', score: 91 },
            { day: 'Samedi', time: '09:00', score: 86 },
            { day: 'Dimanche', time: '17:00', score: 88 }
        ],
        facebook: [
            { day: 'Mardi', time: '09:00', score: 87 },
            { day: 'Mercredi', time: '12:00', score: 92 },
            { day: 'Jeudi', time: '14:00', score: 89 },
            { day: 'Vendredi', time: '09:00', score: 85 },
            { day: 'Samedi', time: '12:00', score: 90 }
        ]
    };

    return optimalTimes[targetPlatform] || optimalTimes.youtube;
}

function remixContent(originalContent, targetPlatforms) {
    const remixed = targetPlatforms.map(platform => {
        return {
            id: uuidv4(),
            originalId: originalContent.id,
            targetPlatform: platform,
            title: generateRemixedTitle(originalContent.title, platform),
            description: generateRemixedDescription(originalContent.topic, platform),
            hashtags: generateOptimizedHashtags(originalContent.topic, platform),
            suggestedTimes: generateTimingSuggestion(platform),
            format: remixTemplates[platform] ? '✅ Optimisé' : '⚠️ Standard',
            status: 'draft',
            createdAt: new Date().toISOString(),
            originalContent: {
                title: originalContent.title,
                platform: originalContent.platform,
                creator: originalContent.creator,
                viralityScore: originalContent.viralityScore
            }
        };
    });

    return remixed;
}

export {
    remixContent,
    generateRemixedTitle,
    generateRemixedDescription,
    generateOptimizedHashtags,
    generateTimingSuggestion
};
