import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

// Request interceptor to attach the Bearer token
api.interceptors.request.use((config) => {
    if (typeof document !== 'undefined') {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (token) {
            config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle global auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthenticated errors
        if (error.response?.status === 401) {
            // Prevent infinite redirect loops if error occurs on sign-in
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/sign-in')) {
                window.location.href = '/sign-in';
            }
        }
        return Promise.reject(error);
    }
);

export default api;