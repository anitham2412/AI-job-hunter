import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        skills: '',
        resumeText: ''
    });

    // Update form field on change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await registerUser(form);

            // Save userId to localStorage
            localStorage.setItem('userId', response.data.id);

            // Go to dashboard
            navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.message
                     || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.logo}>🎯</div>
                    <h1 style={styles.title}>AI Job Hunter</h1>
                    <p style={styles.subtitle}>
                        Let AI find your dream job!
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div style={styles.error}>{error}</div>
                )}

                {/* Form */}
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        name="name"
                        placeholder="Ravi Kumar"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="ravi@gmail.com"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Your Skills</label>
                    <input
                        name="skills"
                        placeholder="Java, Spring Boot, React, PostgreSQL"
                        value={form.skills}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Paste Your Resume</label>
                    <textarea
                        name="resumeText"
                        rows={6}
                        placeholder="Paste your full resume text here..."
                        value={form.resumeText}
                        onChange={handleChange}
                    />
                </div>

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px' }}
                    onClick={handleSubmit}
                    disabled={loading}>
                    {loading ? '⏳ Creating Account...' : '🚀 Get Started'}
                </button>

            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ede9fe, #dbeafe)'
    },
    box: {
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
    },
    header: { textAlign: 'center', marginBottom: '32px' },
    logo: { fontSize: '48px', marginBottom: '8px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#1f2937' },
    subtitle: { color: '#6b7280', marginTop: '4px' },
    error: {
        background: '#fee2e2',
        color: '#991b1b',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    }
};

export default Register;