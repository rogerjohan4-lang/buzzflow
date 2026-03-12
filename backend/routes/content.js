import express from 'express';
import { remixContent, generateRemixedTitle, generateOptimizedHashtags, generateTimingSuggestion } from '../services/contentService.js';
import { saveContent, getSavedContent, deleteSavedContent } from '../data/db.js';

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

// GET /api/content/saved - Get all saved content
router.get('/saved', (req, res) => {
    const items = getSavedContent();
    res.json({ success: true, count: items.length, data: items });
});

// POST /api/content/saved - Save a content item
router.post('/saved', (req, res) => {
    const item = req.body;
    if (!item.id || !item.platform || !item.title) {
        return res.status(400).json({ success: false, error: 'id, platform and title are required' });
    }
    saveContent(item);
    res.status(201).json({ success: true, data: item });
});

// DELETE /api/content/saved/:id - Remove saved content
router.delete('/saved/:id', (req, res) => {
    const removed = deleteSavedContent(req.params.id);
    if (!removed) return res.status(404).json({ success: false, error: 'Item not found' });
    res.json({ success: true, data: removed });
});

export default router;
