import React from 'react';
import { useNavigate } from 'react-router-dom';

function JobCard({ job }) {
    const navigate = useNavigate();

    // Determine score color
    const getScoreStyle = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 60) return 'score-medium';
        return 'score-low';
    };

    return (
        <div className="card" style={styles.card}>

            {/* Header row */}
            <div style={styles.header}>
                <div>
                    <h3 style={styles.title}>{job.title}</h3>
                    <p style={styles.company}>🏢 {job.company}</p>
                    <p style={styles.location}>📍 {job.location}</p>
                </div>

                {/* Match Score Badge */}
                {job.matchScore > 0 && (
                    <span className={`score-badge
                        ${getScoreStyle(job.matchScore)}`}>
                        {job.matchScore}% Match
                    </span>
                )}
            </div>

            {/* Score progress bar */}
            {job.matchScore > 0 && (
                <div style={{ margin: '12px 0' }}>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${job.matchScore}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Description preview */}
            <p style={styles.description}>
                {job.description
                    ? job.description.substring(0, 120) + '...'
                    : 'No description available'}
            </p>

            {/* Footer buttons */}
            <div style={styles.footer}>
                <span style={styles.source}>
                    🔗 {job.source || 'External'}
                </span>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/jobs/${job.id}`)}>
                    View Details →
                </button>
            </div>
        </div>
    );
}

const styles = {
    card: { cursor: 'default' },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
    },
    title: { fontSize: '17px', fontWeight: '700', color: '#1f2937' },
    company: { fontSize: '14px', color: '#4f46e5', marginTop: '4px' },
    location: { fontSize: '13px', color: '#6b7280', marginTop: '2px' },
    description: {
        fontSize: '13px',
        color: '#6b7280',
        lineHeight: '1.5',
        margin: '12px 0'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px'
    },
    source: { fontSize: '12px', color: '#9ca3af' }
};

export default JobCard;