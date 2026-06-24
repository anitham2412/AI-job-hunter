import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    // Check which page is active for highlighting
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/register');
    };

    return (
        <nav style={styles.nav}>
            {/* Logo */}
            <div style={styles.logo}>
                🎯 AI Job Hunter
            </div>

            {/* Navigation Links */}
            <div style={styles.links}>
                <Link
                    to="/dashboard"
                    style={{
                        ...styles.link,
                        ...(isActive('/dashboard') ? styles.activeLink : {})
                    }}>
                    📊 Dashboard
                </Link>

                <Link
                    to="/applications"
                    style={{
                        ...styles.link,
                        ...(isActive('/applications') ? styles.activeLink : {})
                    }}>
                    📋 Applications
                </Link>

                <Link
                    to="/jobs"
                    style={{
                        ...styles.link,
                        ...(isActive('/jobs') ? styles.activeLink : {})
                    }}>
                    💼 Jobs
                </Link>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                style={styles.logoutBtn}>
                Logout
            </button>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '64px',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    logo: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#4f46e5'
    },
    links: {
        display: 'flex',
        gap: '8px'
    },
    link: {
        padding: '8px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        color: '#555',
        fontWeight: '600',
        fontSize: '14px'
    },
    activeLink: {
        background: '#ede9fe',
        color: '#4f46e5'
    },
    logoutBtn: {
        padding: '8px 16px',
        background: 'transparent',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        color: '#555'
    }
};

export default Navbar;