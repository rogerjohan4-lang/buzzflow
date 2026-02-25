import express from 'express';
import { remixContent, generateRemixedTitle, generateOptimizedHashtags, generateTimingSuggestion } from '../services/contentService.js';

const router = express.Router();

// POST /api/content/remix - Remix content for target platforms
router.post('/remix', (req, res) => {
    const { content, targetPlatforms = ['youtube', 'tiktok', 'instagram', 'facebook'] } = req.body;

    if (!content) {
        return res.status(400).json({
            success: false,
            error: 'Content object is required'
        });
    }

    const remixed = remixContent(content, targetPlatforms);

    res.json({
        success: true,
        count: remixed.length,
        data: remixed
    });
});

// POST /api/content/suggest-title - Get title suggestions
router.post('/suggest-title', (req, res) => {
    const { title, platform } = req.body;

    if (!title || !platform) {
        return res.status(400).json({
            success: false,
            error: 'Title and platform are required'
        });
    }

    const suggestions = [];
    for (let i = 0; i < 5; i++) {
        suggestions.push(generateRemixedTitle(title, platform));
    }

    res.json({
        success: true,
        data: suggestions
    });
});

// POST /api/content/suggest-hashtags - Get hashtag suggestions
router.post('/suggest-hashtags', (req, res) => {
    const { topic, platform, count = 10 } = req.body;

    if (!topic || !platform) {
        return res.status(400).json({
            success: false,
            error: 'Topic and platform are required'
        });
    }

    const hashtags = generateOptimizedHashtags(topic, platform, count);

    res.json({
        success: true,
        data: hashtags
    });
});

// GET /api/content/best-times/:platform - Get best posting times
router.get('/best-times/:platform', (req, res) => {
    const { platform } = req.params;
    const times = generateTimingSuggestion(platform);

    res.json({
        success: true,
        platform,
        data: times
    });
});

export default router;
