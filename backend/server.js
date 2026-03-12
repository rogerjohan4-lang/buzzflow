import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getDB } from './data/db.js';
import { seedDemoData } from './services/postService.js';
import trendsRouter from './routes/trends.js';
import contentRouter from './routes/content.js';
import postsRouter from './routes/posts.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Routes
app.use('/api/trends', trendsRouter);
app.use('/api/content', contentRouter);
app.use('/api/posts', postsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        name: 'BuzzFlow API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Init DB
getDB();
seedDemoData();

app.listen(PORT, () => {
    console.log(`\n🚀 BuzzFlow API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔥 Trends: http://localhost:${PORT}/api/trends`);
    console.log(`📝 Content: http://localhost:${PORT}/api/content`);
    console.log(`📅 Posts: http://localhost:${PORT}/api/posts/queue\n`);
});
