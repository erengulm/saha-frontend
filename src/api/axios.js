import axios from 'axios';

// Helper function to get CSRF token from cookies
const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    withCredentials: true, // enable cookie/session support
});

// Add request interceptor to include CSRF token
axiosInstance.interceptors.request.use(
    async (config) => {
        // For POST, PUT, PATCH, DELETE requests, add CSRF token
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
            let csrfToken = getCSRFToken();
            
            // If no CSRF token, try to fetch it first
            if (!csrfToken) {
                try {
                    await axios.get('http://127.0.0.1:8000/api/csrf/', { withCredentials: true });
                    csrfToken = getCSRFToken();
                } catch (error) {
                    console.warn('Failed to fetch CSRF token:', error);
                }
            }
            
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
