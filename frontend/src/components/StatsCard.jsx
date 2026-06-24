import React from 'react';

function StatsCard({ icon, title, value, color }) {
    return (
        <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
            <div style={styles.icon}>{icon}</div>
            <div style={styles.value}>{value}</div>
            <div style={styles.title}>{title}</div>
        </div>
    );
}

const styles = {
    card: {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textAlign: 'center'
    },
    icon: { fontSize: '32px', marginBottom: '8px' },
    value: { fontSize: '28px', fontWeight: '800', color: '#1f2937' },
    title: { fontSize: '13px', color: '#6b7280', marginTop: '4px' }
};

export default StatsCard;