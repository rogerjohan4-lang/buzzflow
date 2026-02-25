import express from 'express';
import { generateTrendingContent, searchTrends, platformConfigs, trendingTopics } from '../services/trendService.js';

const router = express.Router();

// GET /api/trends - Get all trending content
router.get('/', (req, res) => {
    const { q, platform, limit = 30 } = req.query;
    let content;

    if (q || platform) {
        content = searchTrends(q, platform);
    } else {
        content = generateTrendingContent(parseInt(limit));
    }

    res.json({
        success: true,
        count: content.length,
        data: content
    });
});

// GET /api/trends/platforms - Get available platforms
router.get('/platforms', (req, res) => {
    res.json({
        success: true,
        data: platformConfigs
    });
});

// GET /api/trends/topics - Get trending topics
router.get('/topics', (req, res) => {
    res.json({
        success: true,
        data: trendingTopics
    });
});

// GET /api/trends/:platform - Get trending by platform
router.get('/:platform', (req, res) => {
    const { platform } = req.params;
    const content = searchTrends(null, platform);

    res.json({
        success: true,
        platform,
        count: content.length,
        data: content
    });
});

export default router;
