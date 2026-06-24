import React, { useState, useEffect } from 'react';
import { getApplications } from '../services/api';
import ApplicationCard from '../components/ApplicationCard';

function Applications() {
    const userId = localStorage.getItem('userId');

    const [applications, setApplications] = useState([]);
    const [filtered, setFiltered]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');

    useEffect(() => {
        loadApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [activeFilter, applications]);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const res = await getApplications(userId);
            setApplications(res.data);
        } catch (err) {
            console.error('Error loading applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        if (activeFilter === 'ALL') {
            setFiltered(applications);
        } else {
            setFiltered(applications.filter(
                a => a.status === activeFilter
            ));
        }
    };

    // Calculate counts per status
    const counts = {
        ALL:       applications.length,
        SAVED:     applications.filter(a =>
                       a.status === 'SAVED').length,
        APPLIED:   applications.filter(a =>
                       a.status === 'APPLIED').length,
        INTERVIEW: applications.filter(a =>
                       a.status === 'INTERVIEW').length,
        OFFER:     applications.filter(a =>
                       a.status === 'OFFER').length,
        REJECTED:  applications.filter(a =>
                       a.status === 'REJECTED').length,
    };

    // Filter tab config
    const tabs = [
        { key: 'ALL',       label: '📋 All',        color: '#4f46e5' },
        { key: 'SAVED',     label: '🔖 Saved',      color: '#6b7280' },
        { key: 'APPLIED',   label: '📤 Applied',    color: '#1d4ed8' },
        { key: 'INTERVIEW', label: '🎯 Interview',  color: '#d97706' },
        { key: 'OFFER',     label: '🎉 Offer',      color: '#065f46' },
        { key: 'REJECTED',  label: '❌ Rejected',   color: '#991b1b' },
    ];

    return (
        <div>
            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div>
                    <h1 style={styles.pageTitle}>
                        📋 Applications Tracker
                    </h1>
                    <p style={styles.subtitle}>
                        Track every job you've applied to
                    </p>
                </div>
            </div>

            {/* Summary Stats Row */}
            <div style={styles.statsRow}>
                <div style={styles.statBox}>
                    <span style={styles.statNum}>{counts.ALL}</span>
                    <span style={styles.statLabel}>Total</span>
                </div>
                <div style={styles.statBox}>
                    <span style={{...styles.statNum,
                                  color:'#1d4ed8'}}>
                        {counts.APPLIED}
                    </span>
                    <span style={styles.statLabel}>Applied</span>
                </div>
                <div style={styles.statBox}>
                    <span style={{...styles.statNum,
                                  color:'#d97706'}}>
                        {counts.INTERVIEW}
                    </span>
                    <span style={styles.statLabel}>Interviews</span>
                </div>
                <div style={styles.statBox}>
                    <span style={{...styles.statNum,
                                  color:'#065f46'}}>
                        {counts.OFFER}
                    </span>
                    <span style={styles.statLabel}>Offers</span>
                </div>
                <div style={styles.statBox}>
                    <span style={{...styles.statNum,
                                  color:'#991b1b'}}>
                        {counts.REJECTED}
                    </span>
                    <span style={styles.statLabel}>Rejected</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={styles.tabsRow}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        style={{
                            ...styles.tab,
                            ...(activeFilter === tab.key
                                ? { background: tab.color,
                                    color: 'white',
                                    borderColor: tab.color }
                                : {})
                        }}
                        onClick={() => setActiveFilter(tab.key)}>
                        {tab.label}
                        <span style={styles.tabCount}>
                            {counts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Applications List */}
            {loading ? (
                <div className="loader">
                    ⏳ Loading applications...
                </div>
            ) : filtered.length === 0 ? (
                <div className="card" style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📭</div>
                    <h3 style={styles.emptyTitle}>
                        No applications yet!
                    </h3>
                    <p style={styles.emptyText}>
                        Go to Jobs page, open a job,
                        and click "Apply" to track it here.
                    </p>
                </div>
            ) : (
                filtered.map(app => (
                    <ApplicationCard
                        key={app.id}
                        application={app}
                        onUpdate={loadApplications}
                    />
                ))
            )}
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
    subtitle: { color: '#6b7280', marginTop: '4px' },
    statsRow: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px'
    },
    statBox: {
        flex: 1,
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    statNum: {
        display: 'block',
        fontSize: '28px',
        fontWeight: '800',
        color: '#1f2937'
    },
    statLabel: {
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '4px'
    },
    tabsRow: {
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    tab: {
        padding: '8px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '20px',
        background: 'white',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        color: '#555',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s'
    },
    tabCount: {
        background: '#f3f4f6',
        borderRadius: '10px',
        padding: '1px 7px',
        fontSize: '11px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 40px'
    },
    emptyIcon:  { fontSize: '48px', marginBottom: '16px' },
    emptyTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '8px'
    },
    emptyText:  { color: '#6b7280', lineHeight: '1.6' }
};

export default Applications;