import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5000
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    error => {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Connection timeout - Please check if the server is running'));
        }
        
        if (!error.response) {
            return Promise.reject(new Error('Network error - Please check if the server is running'));
        }

        switch (error.response.status) {
            case 401:
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(new Error('Authentication expired'));
                
            case 404:
                return Promise.reject(new Error('Resource not found'));
                
            case 500:
                return Promise.reject(new Error('Server error - Please try again later'));
                
            default:
                return Promise.reject(new Error(errorMessage));
        }
    }
);

export default api;