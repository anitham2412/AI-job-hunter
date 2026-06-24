import axios from 'axios';

// Base URL of our Spring Boot backend
const BASE_URL = 'http://localhost:8080/api';

// Create axios instance with base config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ─── USER APIs ────────────────────────────────────────
export const registerUser = (userData) =>
    api.post('/users/register', userData);

export const getUser = (userId) =>
    api.get(`/users/${userId}`);

export const updateResume = (userId, resumeText) =>
    api.put(`/users/${userId}/resume`, resumeText);

// ─── JOB APIs ─────────────────────────────────────────
export const fetchJobs = (keyword, location) =>
    api.post(`/jobs/fetch?keyword=${keyword}&location=${location}`);

export const getAllJobs = () =>
    api.get('/jobs');

export const getJobById = (jobId) =>
    api.get(`/jobs/${jobId}`);

export const getHighMatchJobs = (minScore) =>
    api.get(`/jobs/matches?minScore=${minScore}`);

// ─── MATCHING APIs ────────────────────────────────────
export const matchJob = (userId, jobId) =>
    api.post(`/match?userId=${userId}&jobId=${jobId}`);

export const matchAllJobs = (userId) =>
    api.post(`/match/all?userId=${userId}`);

// ─── GENERATE APIs ────────────────────────────────────
export const generateContent = (userId, jobId, tone) =>
    api.post('/generate', { userId, jobId, tone });

export const getGeneratedContent = (userId, jobId) =>
    api.get(`/generate?userId=${userId}&jobId=${jobId}`);

// ─── APPLICATION APIs ─────────────────────────────────
export const applyToJob = (userId, jobId, notes) =>
    api.post('/applications', { userId, jobId, notes });

export const getApplications = (userId) =>
    api.get(`/applications?userId=${userId}`);

// ─── APPLICATION APIs ─────────────────────────────────

export const updateStatus = (appId, status) =>
    api.put(`/applications/${appId}/status?status=${status}`);

export const updateNotes = (appId, notes) =>
    api.put(`/applications/${appId}/notes`, notes);

export const deleteApplication = (appId) =>
    api.delete(`/applications/${appId}`);

export const getByStatus = (userId, status) =>
    api.get(`/applications/status?userId=${userId}&status=${status}`);

export default api;

export const getDashboardStats = (userId) =>
    api.get(`/dashboard/stats?userId=${userId}`);

export const getTopJobs = (minScore = 70) =>
    api.get(`/dashboard/top-jobs?minScore=${minScore}`);

export const triggerScheduler = () =>
    api.post('/dashboard/trigger');