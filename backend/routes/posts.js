import express from 'express';
import { addToQueue, getQueue, updatePostStatus, removeFromQueue, reorderQueue, getAnalytics } from '../services/postService.js';

const router = express.Router();

// GET /api/posts/queue - Get post queue
router.get('/queue', (req, res) => {
    const { status, platform } = req.query;
    const queue = getQueue({ status, platform });

    res.json({
        success: true,
        count: queue.length,
        data: queue
    });
});

// POST /api/posts/schedule - Schedule a post
router.post('/schedule', (req, res) => {
    const post = req.body;

    if (!post.title || !post.targetPlatform) {
        return res.status(400).json({
            success: false,
            error: 'Title and target platform are required'
        });
    }

    const scheduled = addToQueue(post);

    res.status(201).json({
        success: true,
        data: scheduled
    });
});

// PUT /api/posts/:id/status - Update post status
router.put('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'scheduled', 'published', 'failed'].includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid status. Must be: draft, scheduled, published, failed'
        });
    }

    const updated = updatePostStatus(id, status);

    if (!updated) {
        return res.status(404).json({
            success: false,
            error: 'Post not found'
        });
    }

    res.json({
        success: true,
        data: updated
    });
});

// DELETE /api/posts/:id - Remove post from queue
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const removed = removeFromQueue(id);

    if (!removed) {
        return res.status(404).json({
            success: false,
            error: 'Post not found'
        });
    }

    res.json({
        success: true,
        data: removed
    });
});

// PUT /api/posts/reorder - Reorder queue
router.put('/reorder', (req, res) => {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
        return res.status(400).json({
            success: false,
            error: 'orderedIds array is required'
        });
    }

    const reordered = reorderQueue(orderedIds);

    res.json({
        success: true,
        data: reordered
    });
});

// GET /api/posts/analytics - Get analytics
router.get('/analytics', (req, res) => {
    const analytics = getAnalytics();

    res.json({
        success: true,
        data: analytics
    });
});

export default router;
