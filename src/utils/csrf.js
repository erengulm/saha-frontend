import axios from 'axios';

export const getCSRFToken = async () => {
    try {
        await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
        console.log('CSRF token retrieved');
    } catch (err) {
        console.error('Failed to get CSRF token', err);
    }
};
