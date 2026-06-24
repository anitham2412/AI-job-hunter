import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../services/api';
import JobCard from '../components/JobCard';

function Jobs() {
    const [jobs, setJobs]           = useState([]);
    const [filtered, setFiltered]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [search, setSearch]       = useState('');
    const [filter, setFilter]       = useState('all');

    useEffect(() => {
        loadJobs();
    }, []);

    // Filter whenever search or filter changes
    useEffect(() => {
        applyFilter();
    }, [search, filter, jobs]);

    const loadJobs = async () => {
        try {
            const res = await getAllJobs();
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        let result = [...jobs];

        // Search filter
        if (search) {
            result = result.filter(j =>
                j.title.toLowerCase().includes(search.toLowerCase()) ||
                j.company.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Score filter
        if (filter === 'high')   result = result.filter(j => j.matchScore >= 80);
        if (filter === 'medium') result = result.filter(j => j.matchScore >= 60
                                                          && j.matchScore < 80);
        if (filter === 'low')    result = result.filter(j => j.matchScore < 60);

        // Sort by score
        result.sort((a, b) => b.matchScore - a.matchScore);

        setFiltered(result);
    };

    return (
        <div>
            {/* Header */}
            <h1 style={styles.pageTitle}>💼 All Jobs</h1>

            {/* Search & Filter Bar */}
            <div className="card" style={{ padding: '16px' }}>
                <div style={styles.filterRow}>
                    <input
                        style={styles.searchInput}
                        placeholder="🔍 Search by title or company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        style={styles.select}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Jobs</option>
                        <option value="high">High Match (80%+)</option>
                        <option value="medium">Medium (60-80%)</option>
                        <option value="low">Low Match</option>
                    </select>
                </div>
            </div>

            {/* Results count */}
            <p style={styles.resultCount}>
                Showing {filtered.length} jobs
            </p>

            {/* Job List */}
            {loading ? (
                <div className="loader">⏳ Loading jobs...</div>
            ) : filtered.length === 0 ? (
                <div className="card" style={{ textAlign: 'center',
                                               padding: '40px' }}>
                    <p style={{ color: '#6b7280' }}>
                        No jobs found. Try a different filter.
                    </p>
                </div>
            ) : (
                filtered.map(job => (
                    <JobCard key={job.id} job={job} />
                ))
            )}
        </div>
    );
}

const styles = {
    pageTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: '20px'
    },
    filterRow: {
        display: 'flex',
        gap: '12px'
    },
    searchInput: {
        flex: 1,
        padding: '10px 14px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px'
    },
    select: {
        padding: '10px 14px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer'
    },
    resultCount: {
        color: '#6b7280',
        fontSize: '14px',
        margin: '12px 0'
    }
};

export default Jobs;