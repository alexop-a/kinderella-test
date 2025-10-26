import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [visitorCount, setVisitorCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Fetch stats from server
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            setStats(data);
            setVisitorCount(data.totalVisitors); // Update visitor count from stats
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Increment visitor count
    const incrementVisitor = async () => {
        try {
            const response = await fetch('/api/visitors');
            const data = await response.json();
            setVisitorCount(data.totalVisitors);
            // Also refresh stats to get updated page views
            await fetchStats();
        } catch (error) {
            console.error('Error incrementing visitor:', error);
        }
    };

    // Reset all stats
    const resetStats = async () => {
        try {
            const response = await fetch('/api/reset-stats', { method: 'POST' });
            if (response.ok) {
                setVisitorCount(0);
                await fetchStats();
            }
        } catch (error) {
            console.error('Error resetting stats:', error);
        }
    };

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            // First load stats to get current state
            await fetchStats();
            // Then increment visitor (this will also refresh stats)
            await incrementVisitor();
            setLoading(false);
        };
        loadData();
    }, []);

    // Auto-refresh stats every 10 seconds
    useEffect(() => {
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secs}s`;
    };

    const formatMemory = (bytes) => {
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <h3>🔄 Loading React Dashboard...</h3>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px', 
            margin: '20px 0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>
                ⚛️ React Dashboard - Real-time Stats
            </h2>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px',
                marginBottom: '20px'
            }}>
                {/* Visitor Counter */}
                <div style={{ 
                    background: '#e3f2fd', 
                    padding: '15px', 
                    borderRadius: '8px',
                    border: '2px solid #2196f3'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>👥 Visitors</h4>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                        {visitorCount}
                    </div>
                    <button 
                        onClick={incrementVisitor}
                        style={{
                            marginTop: '10px',
                            padding: '5px 10px',
                            backgroundColor: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        + Visit
                    </button>
                </div>

                {/* Page Views */}
                <div style={{ 
                    background: '#e8f5e8', 
                    padding: '15px', 
                    borderRadius: '8px',
                    border: '2px solid #4caf50'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>📄 Page Views</h4>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
                        {stats?.pageViews || 0}
                    </div>
                </div>

                {/* Server Uptime */}
                <div style={{ 
                    background: '#fff3e0', 
                    padding: '15px', 
                    borderRadius: '8px',
                    border: '2px solid #ff9800'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>⏱️ Uptime</h4>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f57c00' }}>
                        {stats ? formatUptime(stats.uptime) : '0s'}
                    </div>
                </div>

                {/* Memory Usage */}
                <div style={{ 
                    background: '#fce4ec', 
                    padding: '15px', 
                    borderRadius: '8px',
                    border: '2px solid #e91e63'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#c2185b' }}>💾 Memory</h4>
                    <div style={{ fontSize: '14px', color: '#c2185b' }}>
                        <div>Used: {stats ? formatMemory(stats.memoryUsage.heapUsed) : '0 MB'}</div>
                        <div>Total: {stats ? formatMemory(stats.memoryUsage.heapTotal) : '0 MB'}</div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginBottom: '15px' }}>
                <button 
                    onClick={fetchStats}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    🔄 Refresh Stats
                </button>
                <button 
                    onClick={resetStats}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    🗑️ Reset Stats
                </button>
            </div>

            {/* Status Info */}
            <div style={{ 
                fontSize: '12px', 
                color: '#666',
                borderTop: '1px solid #ddd',
                paddingTop: '10px'
            }}>
                <div>Node.js: {stats?.nodeVersion}</div>
                <div>Last Updated: {lastUpdated}</div>
                <div>Auto-refresh: Every 10 seconds</div>
            </div>
        </div>
    );
};

export default Dashboard;