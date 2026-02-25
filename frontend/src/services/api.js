const API_BASE = 'http://localhost:3001/api';

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'API error');
        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

export const trendAPI = {
    getAll: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return fetchAPI(`/trends${qs ? '?' + qs : ''}`);
    },
    getByPlatform: (platform) => fetchAPI(`/trends/${platform}`),
    getPlatforms: () => fetchAPI('/trends/platforms'),
    getTopics: () => fetchAPI('/trends/topics')
};

export const contentAPI = {
    remix: (content, targetPlatforms) =>
        fetchAPI('/content/remix', {
            method: 'POST',
            body: JSON.stringify({ content, targetPlatforms })
        }),
    suggestTitle: (title, platform) =>
        fetchAPI('/content/suggest-title', {
            method: 'POST',
            body: JSON.stringify({ title, platform })
        }),
    suggestHashtags: (topic, platform, count) =>
        fetchAPI('/content/suggest-hashtags', {
            method: 'POST',
            body: JSON.stringify({ topic, platform, count })
        }),
    getBestTimes: (platform) => fetchAPI(`/content/best-times/${platform}`)
};

export const postAPI = {
    getQueue: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return fetchAPI(`/posts/queue${qs ? '?' + qs : ''}`);
    },
    schedule: (post) =>
        fetchAPI('/posts/schedule', {
            method: 'POST',
            body: JSON.stringify(post)
        }),
    updateStatus: (id, status) =>
        fetchAPI(`/posts/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        }),
    remove: (id) => fetchAPI(`/posts/${id}`, { method: 'DELETE' }),
    getAnalytics: () => fetchAPI('/posts/analytics')
};
