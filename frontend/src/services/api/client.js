//NOTE : Reviewed on 24th may, 2026
import axios from 'axios';

// Use Vite environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * [AXIOS CLIENT INSTANCE]
 * Creates a centralized instance of Axios configured with a base URL path.
 * This ensures we don't have to write 'http://localhost:5000/api' in every single file.
 */
export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Hardcoded user ID for development
const DEMO_USER_ID = 'user_demo_123';

/**
 * [AXIOS INTERCEPTOR]
 * Intercepts every outgoing request sent through this client instance.
 * It automatically injects the demo user identifier ('x-user-id') into the HTTP headers
 * so the backend server knows who is making the request.
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

/**
 * [NAMED FUNCTION]
 * Mock setup function to maintain compatibility with existing calls in App.jsx.
 */
export function setupAxiosInterceptors() {
    // No longer needed but kept to avoid breaking App.jsx temporarily
    console.log('Axios interceptors ready (Mock Mode)');
}
