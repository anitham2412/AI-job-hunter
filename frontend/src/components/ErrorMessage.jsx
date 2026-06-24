import React from 'react';

function ErrorMessage({ message, onRetry }) {
    return (
        <div style={styles.container}>
            <div style={styles.icon}>⚠️</div>
            <p style={styles.message}>{message}</p>
            {onRetry && (
                <button
                    style={styles.retryBtn}
                    onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
}

const styles = {
    container: {
        background: '#fee2e2',
        border: '1px solid #fca5a5',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        margin: '16px 0'
    },
    icon:    { fontSize: '32px', marginBottom: '8px' },
    message: { color: '#991b1b', fontWeight: '600' },
    retryBtn: {
        marginTop: '12px',
        padding: '8px 20px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600'
    }
};

export default ErrorMessage;