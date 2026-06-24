import React, { useState, useEffect } from 'react';
import {
    getAllJobs,
    getHighMatchJobs,
    matchAllJobs,
    fetchJobs,
    getDashboardStats,
    triggerScheduler
} from '../services/api';
import StatsCard from '../components/StatsCard';
import JobCard from '../components/JobCard';

function Dashboard() {
    const userId = localStorage.getItem('userId');

    const [allJobs, setAllJobs]               = useState([]);
    const [topJobs, setTopJobs]               = useState([]);
    const [loading, setLoading]               = useState(false);
    const [fetchLoading, setFetchLoading]     = useState(false);
    const [triggerLoading, setTriggerLoading] = useState(false);
    const [lastUpdated, setLastUpdated]       = useState(null);
    const [keyword, setKeyword]               = useState('Java Developer');
    const [location, setLocation]             = useState('Hyderabad');

    // Load jobs when page opens
    useEffect(() => {
        loadJobs();
    }, []);

    // ─── LOAD ALL DATA ────────────────────────────────────
    const loadJobs = async () => {
        setLoading(true);
        try {
            const [allRes, topRes, statsRes] = await Promise.all([
                getAllJobs(),
                getHighMatchJobs(70),
                getDashboardStats(userId)
            ]);
            setAllJobs(allRes.data);
            setTopJobs(topRes.data);
            setLastUpdated(statsRes.data.lastUpdated);
        } catch (err) {
            console.error('Error loading jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    // ─── FETCH JOBS FROM INTERNET ─────────────────────────
    const handleFetchJobs = async () => {
        setFetchLoading(true);
        try {
            await fetchJobs(keyword, location);
            await loadJobs();
            alert('✅ New jobs fetched successfully!');
        } catch (err) {
            alert('❌ Failed to fetch jobs. Check API key.');
        } finally {
            setFetchLoading(false);
        }
    };

    // ─── RUN AI MATCHING ──────────────────────────────────
    const handleMatchAll = async () => {
        setLoading(true);
        try {
            await matchAllJobs(userId);
            await loadJobs();
            alert('✅ AI matching complete!');
        } catch (err) {
            alert('❌ Matching failed.');
        } finally {
            setLoading(false);
        }
    };

    // ─── TRIGGER SCHEDULER MANUALLY ───────────────────────
    const handleTriggerScheduler = async () => {
        setTriggerLoading(true);
        try {
            await triggerScheduler();
            alert('✅ Scheduler triggered! Jobs will update in 2-3 minutes. Refresh the page after.');
        } catch (err) {
            alert('❌ Trigger failed!');
        } finally {
            setTriggerLoading(false);
        }
    };

    // ─── CALCULATE STATS ──────────────────────────────────
    const stats = {
        total:     allJobs.length,
        highMatch: allJobs.filter(j => j.matchScore >= 80).length,
        medMatch:  allJobs.filter(j => j.matchScore >= 60
                             && j.matchScore < 80).length,
        applied:   0
    };

    return (
        <div>
            {/* ── Page Header ── */}
            <div style={styles.pageHeader}>
                <div>
                    <h1 style={styles.pageTitle}>Dashboard</h1>
                    <p style={styles.pageSubtitle}>
                        Your daily job hunting summary
                    </p>
                    {lastUpdated && (
                        <p style={styles.lastUpdated}>
                            Last updated:&nbsp;
                            {new Date(lastUpdated).toLocaleString()}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="btn btn-outline"
                        onClick={handleMatchAll}
                        disabled={loading}>
                        🤖 Run AI Match
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={handleTriggerScheduler}
                        disabled={triggerLoading}>
                        {triggerLoading ? '⏳ Triggering...' : '⚡ Run Now'}
                    </button>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid-4">
                <StatsCard
                    icon="💼"
                    title="Total Jobs"
                    value={stats.total}
                    color="#4f46e5"
                />
                <StatsCard
                    icon="🔥"
                    title="High Match (80%+)"
                    value={stats.highMatch}
                    color="#10b981"
                />
                <StatsCard
                    icon="⭐"
                    title="Good Match (60%+)"
                    value={stats.medMatch}
                    color="#f59e0b"
                />
                <StatsCard
                    icon="✅"
                    title="Applied"
                    value={stats.applied}
                    color="#6366f1"
                />
            </div>

            {/* ── Fetch Jobs Section ── */}
            <div className="card">
                <h2 style={styles.sectionTitle}>🔍 Fetch New Jobs</h2>
                <div style={styles.fetchRow}>
                    <input
                        style={styles.searchInput}
                        placeholder="Job keyword..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <input
                        style={styles.searchInput}
                        placeholder="Location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleFetchJobs}
                        disabled={fetchLoading}>
                        {fetchLoading ? '⏳ Fetching...' : '🚀 Fetch Jobs'}
                    </button>
                </div>
            </div>

            {/* ── Top Matches Section ── */}
            {topJobs.length > 0 && (
                <div>
                    <h2 style={styles.sectionTitle}>
                        🏆 Top Matches Today
                    </h2>
                    {topJobs.slice(0, 3).map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}

            {/* ── All Jobs Section ── */}
            <div>
                <h2 style={styles.sectionTitle}>
                    📋 All Jobs ({allJobs.length})
                </h2>
                {loading ? (
                    <div className="loader">⏳ Loading jobs...</div>
                ) : allJobs.length === 0 ? (
                    <div className="card"
                         style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '16px', color: '#6b7280' }}>
                            No jobs yet! Use "Fetch Jobs" above to get started.
                        </p>
                    </div>
                ) : (
                    allJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    pageTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#1f2937'
    },
    pageSubtitle: {
        color: '#6b7280',
        marginTop: '4px'
    },
    lastUpdated: {
        fontSize: '12px',
        color: '#9ca3af',
        marginTop: '4px'
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '16px',
        marginTop: '8px'
    },
    fetchRow: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },
    searchInput: {
        padding: '10px 14px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        flex: 1
    }
};

export default Dashboard;
