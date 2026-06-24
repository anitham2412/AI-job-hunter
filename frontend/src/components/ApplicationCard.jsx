import React, { useState } from 'react';
import { updateStatus, updateNotes, deleteApplication }
    from '../services/api';

function ApplicationCard({ application, onUpdate }) {

    const [editing, setEditing]   = useState(false);
    const [notes, setNotes]       = useState(
                                    application.notes || '');
    const [loading, setLoading]   = useState(false);

    // Status config — color and emoji per status
    const statusConfig = {
        SAVED:      { color: '#6b7280', bg: '#f3f4f6', emoji: '🔖' },
        APPLIED:    { color: '#1d4ed8', bg: '#dbeafe', emoji: '📤' },
        INTERVIEW:  { color: '#d97706', bg: '#fef3c7', emoji: '🎯' },
        OFFER:      { color: '#065f46', bg: '#d1fae5', emoji: '🎉' },
        REJECTED:   { color: '#991b1b', bg: '#fee2e2', emoji: '❌' }
    };

    const config = statusConfig[application.status] || statusConfig.APPLIED;

    // All status options for dropdown
    const statusOptions = [
        'SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'
    ];

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            await updateStatus(application.id, newStatus);
            onUpdate(); // Refresh parent list
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotes = async () => {
        setLoading(true);
        try {
            await updateNotes(application.id, notes);
            setEditing(false);
            onUpdate();
        } catch (err) {
            alert('Failed to save notes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Remove this application?')) return;
        try {
            await deleteApplication(application.id);
            onUpdate();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="card" style={styles.card}>

            {/* Top Row — Job info + Status badge */}
            <div style={styles.topRow}>

                {/* Left — Job Details */}
                <div style={styles.jobInfo}>
                    <h3 style={styles.jobTitle}>
                        {application.job?.title || 'Unknown Role'}
                    </h3>
                    <p style={styles.company}>
                        🏢 {application.job?.company || 'Unknown Company'}
                    </p>
                    <p style={styles.location}>
                        📍 {application.job?.location || 'Unknown Location'}
                    </p>
                    <p style={styles.date}>
                        🗓️ Applied:&nbsp;
                        {application.appliedAt
                            ? new Date(application.appliedAt)
                                  .toLocaleDateString()
                            : 'Unknown'}
                    </p>
                </div>

                {/* Right — Status + Actions */}
                <div style={styles.rightCol}>

                    {/* Status Badge */}
                    <span style={{
                        ...styles.statusBadge,
                        color: config.color,
                        background: config.bg
                    }}>
                        {config.emoji} {application.status}
                    </span>

                    {/* Match Score */}
                    {application.job?.matchScore > 0 && (
                        <div style={styles.score}>
                            {application.job.matchScore}% Match
                        </div>
                    )}
                </div>
            </div>

            {/* Status Changer Row */}
            <div style={styles.statusRow}>
                <span style={styles.label}>Update Status:</span>
                <div style={styles.statusButtons}>
                    {statusOptions.map(s => (
                        <button
                            key={s}
                            style={{
                                ...styles.statusBtn,
                                background: application.status === s
                                    ? statusConfig[s].bg : 'transparent',
                                color: application.status === s
                                    ? statusConfig[s].color : '#9ca3af',
                                border: `1px solid ${
                                    application.status === s
                                        ? statusConfig[s].color
                                        : '#e5e7eb'}`
                            }}
                            onClick={() => handleStatusChange(s)}
                            disabled={loading ||
                                      application.status === s}>
                            {statusConfig[s].emoji} {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes Section */}
            <div style={styles.notesSection}>
                <div style={styles.notesHeader}>
                    <span style={styles.label}>📝 Notes</span>
                    {!editing ? (
                        <button
                            style={styles.editBtn}
                            onClick={() => setEditing(true)}>
                            Edit
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                style={styles.saveBtn}
                                onClick={handleSaveNotes}
                                disabled={loading}>
                                Save
                            </button>
                            <button
                                style={styles.cancelBtn}
                                onClick={() => setEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {editing ? (
                    <textarea
                        style={styles.notesInput}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this application..."
                        rows={3}
                    />
                ) : (
                    <p style={styles.notesText}>
                        {notes || 'No notes yet. Click Edit to add.'}
                    </p>
                )}
            </div>

            {/* Footer — Apply link + Delete */}
            <div style={styles.footer}>
                {application.job?.sourceUrl && (
                    <a
                        href={application.job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.applyLink}>
                        🔗 View Job Posting
                    </a>
                )}
                <button
                    style={styles.deleteBtn}
                    onClick={handleDelete}>
                    🗑️ Remove
                </button>
            </div>
        </div>
    );
}

const styles = {
    card: { borderLeft: '4px solid #4f46e5' },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px'
    },
    jobInfo: { flex: 1 },
    jobTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1f2937'
    },
    company: {
        fontSize: '14px',
        color: '#4f46e5',
        marginTop: '4px'
    },
    location: {
        fontSize: '13px',
        color: '#6b7280',
        marginTop: '2px'
    },
    date: {
        fontSize: '12px',
        color: '#9ca3af',
        marginTop: '4px'
    },
    rightCol: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px'
    },
    statusBadge: {
        padding: '6px 14px',
        borderRadius: '20px',
        fontWeight: '700',
        fontSize: '13px'
    },
    score: {
        fontSize: '13px',
        color: '#4f46e5',
        fontWeight: '600'
    },
    statusRow: {
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #f3f4f6'
    },
    label: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: '8px',
        display: 'block'
    },
    statusButtons: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
    },
    statusBtn: {
        padding: '5px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    notesSection: { marginBottom: '16px' },
    notesHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    notesText: {
        fontSize: '13px',
        color: '#4b5563',
        lineHeight: '1.6',
        fontStyle: 'italic'
    },
    notesInput: {
        width: '100%',
        padding: '10px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '13px',
        resize: 'vertical'
    },
    editBtn: {
        fontSize: '12px',
        color: '#4f46e5',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600'
    },
    saveBtn: {
        fontSize: '12px',
        color: 'white',
        background: '#10b981',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 10px',
        cursor: 'pointer'
    },
    cancelBtn: {
        fontSize: '12px',
        color: '#6b7280',
        background: 'none',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        padding: '4px 10px',
        cursor: 'pointer'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #f3f4f6'
    },
    applyLink: {
        fontSize: '13px',
        color: '#4f46e5',
        textDecoration: 'none',
        fontWeight: '600'
    },
    deleteBtn: {
        fontSize: '12px',
        color: '#ef4444',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600'
    }
};

export default ApplicationCard;