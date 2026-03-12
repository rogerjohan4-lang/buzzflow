import express from 'express';
import { generateTrendingContent, searchTrends, platformConfigs, trendingTopics } from '../services/trendService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { q, platform, limit = 30 } = req.query;
        const content = (q || platform) ? await searchTrends(q, platform) : await generateTrendingContent(parseInt(limit));
        res.json({ success: true, count: content.length, data: content });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/platforms', (req, res) => {
    res.json({ success: true, data: platformConfigs });
});

router.get('/topics', (req, res) => {
    res.json({ success: true, data: trendingTopics });
});

router.get('/:platform', async (req, res) => {
    try {
        const content = await searchTrends(null, req.params.platform);
        res.json({ success: true, platform: req.params.platform, count: content.length, data: content });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
