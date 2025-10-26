const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for demo purposes
let visitorCount = 0;
let pageViews = 0;

// Middleware to count page views - MUST be before routes
app.use((req, res, next) => {
    if (req.path === '/') {
        pageViews++;
    }
    next();
});

// Serve static files from the public directory
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for testing
app.get('/api/status', (req, res) => {
    res.json({
        status: 'success',
        message: 'Simple Node.js app with React is running!',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        hasReact: true
    });
});

// Visitor counter API
app.get('/api/visitors', (req, res) => {
    visitorCount++;
    res.json({
        totalVisitors: visitorCount,
        currentTimestamp: new Date().toISOString()
    });
});

// Stats API for React dashboard
app.get('/api/stats', (req, res) => {
    res.json({
        pageViews: pageViews,
        totalVisitors: visitorCount,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString(),
        nodeVersion: process.version
    });
});

// Reset stats API
app.post('/api/reset-stats', (req, res) => {
    visitorCount = 0;
    pageViews = 0;
    res.json({ message: 'Stats reset successfully', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});