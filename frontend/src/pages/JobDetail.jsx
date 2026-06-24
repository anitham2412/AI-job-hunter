import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import { getJobById, matchJob, generateContent } from '../services/api';
import { getJobById, matchJob, generateContent,applyToJob } from '../services/api';

function JobDetail() {
    const { id }      = useParams();   // gets job id from URL
    const navigate    = useNavigate();
    const userId      = localStorage.getItem('userId');

    const [job, setJob]                 = useState(null);
    const [matchResult, setMatchResult] = useState(null);
    const [generated, setGenerated]     = useState(null);
    const [loading, setLoading]         = useState(true);
    const [matchLoading, setMatchLoading]   = useState(false);
    const [genLoading, setGenLoading]       = useState(false);
    const [activeTab, setActiveTab]         = useState('details');
    const [applied, setApplied] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);

    useEffect(() => {
        loadJob();
    }, [id]);

    const loadJob = async () => {
        try {
            const res = await getJobById(id);
            setJob(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMatch = async () => {
        setMatchLoading(true);
        try {
            const res = await matchJob(userId, id);
            setMatchResult(res.data);
            setActiveTab('match');
        } catch (err) {
            alert('Matching failed!');
        } finally {
            setMatchLoading(false);
        }
    };

    const handleApply = async () => {
        setApplyLoading(true);
        try {
            await applyToJob(userId, id, '');
            setApplied(true);
            alert('✅ Application tracked successfully!');
        } catch (err) {
            alert(err.response?.data?.message
                  || 'Already applied or error occurred!');
        } finally {
            setApplyLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenLoading(true);
        try {
            const res = await generateContent(userId, id, 'professional');
            setGenerated(res.data);
            setActiveTab('resume');
        } catch (err) {
            alert('Generation failed!');
        } finally {
            setGenLoading(false);
        }
    };

    if (loading) return <div className="loader">⏳ Loading...</div>;
    if (!job)    return <div className="loader">Job not found!</div>;
    // Add this right after: if (!job) return ...
    if (matchLoading || genLoading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                gap: '16px'
            }}>
                <div style={{ fontSize: '48px' }}>🤖</div>
                <p style={{ fontSize: '16px', color: '#4f46e5',
                            fontWeight: '600' }}>
                    {matchLoading
                        ? 'AI is analyzing your resume...'
                        : 'Generating tailored resume...'}
                </p>
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                    This takes 10-30 seconds. Please wait!
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Back button */}
            <button
                className="btn btn-outline"
                style={{ marginBottom: '16px' }}
                onClick={() => navigate(-1)}>
                ← Back
            </button>

            {/* Job Header Card */}
            <div className="card">
                <div style={styles.jobHeader}>
                    <div>
                        <h1 style={styles.jobTitle}>{job.title}</h1>
                        <p style={styles.company}>🏢 {job.company}</p>
                        <p style={styles.location}>📍 {job.location}</p>
                    </div>
                    {job.matchScore > 0 && (
                        <div style={styles.scoreBig}>
                            {job.matchScore}%
                            <div style={styles.scoreLabel}>Match</div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={styles.actions}>
                    <button
                        className="btn btn-primary"
                        onClick={handleMatch}
                        disabled={matchLoading}>
                        {matchLoading ? '⏳ Analyzing...' : '🤖 AI Match'}
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={handleGenerate}
                        disabled={genLoading}>
                        {genLoading ? '⏳ Generating...' : '📄 Generate Resume'}
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={handleApply}
                        disabled={applyLoading || applied}
                        style={{ background: applied ? '#10b981' : '' }}>
                        {applied
                            ? '✅ Applied!'
                            : applyLoading
                            ? '⏳ Saving...'
                            : '📤 Mark as Applied'}
                    </button>

                    <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline">
                        🔗 Apply Now
                    </a>
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
                {['details', 'match', 'resume'].map(tab => (
                    <button
                        key={tab}
                        style={{
                            ...styles.tab,
                            ...(activeTab === tab ? styles.activeTab : {})
                        }}
                        onClick={() => setActiveTab(tab)}>
                        {tab === 'details' && '📋 Job Details'}
                        {tab === 'match'   && '🎯 Match Analysis'}
                        {tab === 'resume'  && '📄 Generated Resume'}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="card">

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div>
                        <h3 style={styles.sectionHead}>
                            Required Skills
                        </h3>
                        <p style={styles.text}>
                            {job.skillsRequired || 'Not specified'}
                        </p>
                        <h3 style={{ ...styles.sectionHead,
                                     marginTop: '20px' }}>
                            Job Description
                        </h3>
                        <p style={styles.text}>{job.description}</p>
                    </div>
                )}

                {/* Match Tab */}
                {activeTab === 'match' && (
                    <div>
                        {!matchResult ? (
                            <p style={styles.empty}>
                                Click "AI Match" to analyze this job
                                against your resume.
                            </p>
                        ) : (
                            <div>
                                <div style={styles.scoreRow}>
                                    <h2>Match Score</h2>
                                    <span style={styles.scoreNum}>
                                        {matchResult.matchScore}%
                                    </span>
                                </div>

                                <div className="progress-bar"
                                     style={{ margin: '12px 0 20px' }}>
                                    <div className="progress-fill"
                                         style={{ width:
                                            `${matchResult.matchScore}%` }}
                                    />
                                </div>

                                <div className="grid-2">
                                    <div style={styles.skillBox}>
                                        <h4 style={{ color: '#065f46' }}>
                                            ✅ Matched Skills
                                        </h4>
                                        {matchResult.matchedSkills
                                            ?.map((s, i) => (
                                            <span key={i}
                                                  style={styles.skillTag}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={styles.skillBox}>
                                        <h4 style={{ color: '#991b1b' }}>
                                            ❌ Missing Skills
                                        </h4>
                                        {matchResult.missingSkills
                                            ?.map((s, i) => (
                                            <span key={i}
                                                  style={{
                                                    ...styles.skillTag,
                                                    background: '#fee2e2'
                                                  }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <h4>AI Summary</h4>
                                    <p style={styles.text}>
                                        {matchResult.summary}
                                    </p>
                                    <p style={{ marginTop: '12px',
                                                fontWeight: '700',
                                                color: '#4f46e5' }}>
                                        Recommendation:&nbsp;
                                        {matchResult.recommendation}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Resume Tab */}
                {activeTab === 'resume' && (
                    <div>
                        {!generated ? (
                            <p style={styles.empty}>
                                Click "Generate Resume" to create a
                                tailored resume + cover letter.
                            </p>
                        ) : (
                            <div>
                                <h3 style={styles.sectionHead}>
                                    📄 Tailored Resume
                                </h3>
                                <pre style={styles.resumeBox}>
                                    {generated.tailoredResume}
                                </pre>

                                <h3 style={{ ...styles.sectionHead,
                                             marginTop: '24px' }}>
                                    ✉️ Cover Letter
                                </h3>
                                <pre style={styles.resumeBox}>
                                    {generated.coverLetter}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    jobHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
    },
    jobTitle:  { fontSize: '24px', fontWeight: '800', color: '#1f2937' },
    company:   { fontSize: '16px', color: '#4f46e5', marginTop: '6px' },
    location:  { fontSize: '14px', color: '#6b7280', marginTop: '4px' },
    scoreBig: {
        fontSize: '36px',
        fontWeight: '900',
        color: '#4f46e5',
        textAlign: 'center'
    },
    scoreLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '400' },
    actions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    tabs: { display: 'flex', gap: '8px', margin: '16px 0' },
    tab: {
        padding: '10px 20px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        background: 'white',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        color: '#555'
    },
    activeTab: {
        background: '#4f46e5',
        color: 'white',
        border: '2px solid #4f46e5'
    },
    sectionHead: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '8px'
    },
    text: { color: '#4b5563', lineHeight: '1.7', fontSize: '14px' },
    empty: { color: '#9ca3af', textAlign: 'center', padding: '40px 0' },
    scoreRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    scoreNum: {
        fontSize: '32px',
        fontWeight: '900',
        color: '#4f46e5'
    },
    skillBox: {
        background: '#f9fafb',
        borderRadius: '8px',
        padding: '16px'
    },
    skillTag: {
        display: 'inline-block',
        background: '#d1fae5',
        color: '#065f46',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        margin: '4px'
    },
    resumeBox: {
        background: '#f9fafb',
        borderRadius: '8px',
        padding: '20px',
        fontSize: '13px',
        lineHeight: '1.7',
        whiteSpace: 'pre-wrap',
        color: '#374151'
    }
};

export default JobDetail;