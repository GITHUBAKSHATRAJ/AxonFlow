import axios from 'axios';

// Use Vite environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

let currentInterceptor = null;

/**
 * Setup Clerk authentication interceptor
 */
export const setupAxiosInterceptors = (getToken) => {
    if (currentInterceptor !== null) {
        api.interceptors.request.eject(currentInterceptor);
    }

    currentInterceptor = api.interceptors.request.use(async (config) => {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.error('Failed to get token', e);
        }
        return config;
    });
};
