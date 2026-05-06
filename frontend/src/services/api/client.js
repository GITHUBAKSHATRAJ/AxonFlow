import axios from 'axios';

// Use Vite environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Hardcoded user ID for development
const DEMO_USER_ID = 'user_demo_123';

/**
 * Static auth interceptor for demo/development
 */
api.interceptors.request.use((config) => {
    // Attach hardcoded user ID to headers
    config.headers['x-user-id'] = DEMO_USER_ID;
    
    // In a real app, you'd check for a token in localStorage here
    // For now, we just identify as the demo user
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Mock setup function to maintain compatibility with existing calls in App.jsx
export const setupAxiosInterceptors = () => {
    // No longer needed but kept to avoid breaking App.jsx temporarily
    console.log('Axios interceptors ready (Mock Mode)');
};
