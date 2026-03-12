import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH) : path.join(__dirname);
const DB_PATH = path.join(DB_DIR, 'buzzflow.db');

mkdirSync(DB_DIR, { recursive: true });

let db;

function getDB() {
    if (!db) {
        db = new DatabaseSync(DB_PATH);
        db.exec('PRAGMA journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = ON');
        initTables();
    }
    return db;
}

function initTables() {
    getDB().exec(`
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            target_platform TEXT NOT NULL,
            description TEXT DEFAULT '',
            hashtags TEXT DEFAULT '[]',
            status TEXT DEFAULT 'draft',
            scheduled_at TEXT,
            published_at TEXT,
            original_title TEXT,
            virality_score INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS saved_content (
            id TEXT PRIMARY KEY,
            platform TEXT NOT NULL,
            title TEXT NOT NULL,
            topic TEXT DEFAULT '',
            creator_name TEXT DEFAULT '',
            creator_avatar TEXT DEFAULT '',
            thumbnail TEXT DEFAULT '',
            virality_score INTEGER DEFAULT 0,
            stats TEXT DEFAULT '{}',
            original_url TEXT DEFAULT '',
            saved_at TEXT DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
        CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(target_platform);
        CREATE INDEX IF NOT EXISTS idx_saved_platform ON saved_content(platform);
    `);
    console.log('Database initialized at', DB_PATH);
}

function insertPost(post) {
    const stmt = getDB().prepare(
        'INSERT INTO posts (id, title, target_platform, description, hashtags, status, scheduled_at, published_at, original_title, virality_score, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(post.id, post.title, post.targetPlatform, post.description || '', JSON.stringify(post.hashtags || []), post.status || 'draft', post.scheduledAt || null, post.publishedAt || null, post.originalTitle || '', post.viralityScore || 0, post.createdAt || new Date().toISOString());
}

function getAllPosts(filters = {}) {
    let sql = 'SELECT * FROM posts';
    const conditions = [];
    const params = [];
    if (filters.status) { conditions.push('status = ?'); params.push(filters.status); }
    if (filters.platform) { conditions.push('target_platform = ?'); params.push(filters.platform); }
    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY CASE WHEN scheduled_at IS NOT NULL THEN scheduled_at ELSE created_at END ASC';
    const stmt = getDB().prepare(sql);
    const rows = stmt.all(...params);
    return rows.map(rowToPost);
}

function getPostById(id) {
    const row = getDB().prepare('SELECT * FROM posts WHERE id = ?').get(id);
    return row ? rowToPost(row) : null;
}

function updatePost(id, updates) {
    const fields = [];
    const params = [];
    if (updates.status !== undefined) { fields.push('status = ?'); params.push(updates.status); }
    if (updates.publishedAt !== undefined) { fields.push('published_at = ?'); params.push(updates.publishedAt); }
    if (updates.scheduledAt !== undefined) { fields.push('scheduled_at = ?'); params.push(updates.scheduledAt); }
    if (updates.title !== undefined) { fields.push('title = ?'); params.push(updates.title); }
    if (updates.description !== undefined) { fields.push('description = ?'); params.push(updates.description); }
    if (updates.hashtags !== undefined) { fields.push('hashtags = ?'); params.push(JSON.stringify(updates.hashtags)); }
    fields.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);
    getDB().prepare('UPDATE posts SET ' + fields.join(', ') + ' WHERE id = ?').run(...params);
    return getPostById(id);
}

function deletePost(id) {
    const post = getPostById(id);
    if (post) getDB().prepare('DELETE FROM posts WHERE id = ?').run(id);
    return post;
}

function getPostCount() {
    return getDB().prepare('SELECT COUNT(*) as count FROM posts').get().count;
}

function saveContent(content) {
    getDB().prepare(
        'INSERT OR REPLACE INTO saved_content (id, platform, title, topic, creator_name, creator_avatar, thumbnail, virality_score, stats, original_url, saved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(content.id, content.platform, content.title, content.topic || '', content.creator?.name || '', content.creator?.avatar || '', content.thumbnail || '', content.viralityScore || 0, JSON.stringify(content.stats || {}), content.originalUrl || '', new Date().toISOString());
}

function getSavedContent() {
    return getDB().prepare('SELECT * FROM saved_content ORDER BY saved_at DESC').all().map(row => ({
        id: row.id, platform: row.platform, title: row.title, topic: row.topic,
        creator: { name: row.creator_name, avatar: row.creator_avatar },
        thumbnail: row.thumbnail, viralityScore: row.virality_score,
        stats: JSON.parse(row.stats || '{}'), originalUrl: row.original_url, savedAt: row.saved_at
    }));
}

function deleteSavedContent(id) {
    const row = getDB().prepare('SELECT * FROM saved_content WHERE id = ?').get(id);
    if (row) getDB().prepare('DELETE FROM saved_content WHERE id = ?').run(id);
    return row;
}

function getSavedContentCount() {
    return getDB().prepare('SELECT COUNT(*) as count FROM saved_content').get().count;
}

function rowToPost(row) {
    return {
        id: row.id, title: row.title, targetPlatform: row.target_platform,
        description: row.description, hashtags: JSON.parse(row.hashtags || '[]'),
        status: row.status, scheduledAt: row.scheduled_at, publishedAt: row.published_at,
        originalTitle: row.original_title, viralityScore: row.virality_score,
        createdAt: row.created_at, updatedAt: row.updated_at
    };
}

export { getDB, insertPost, getAllPosts, getPostById, updatePost, deletePost, getPostCount, saveContent, getSavedContent, deleteSavedContent, getSavedContentCount };
