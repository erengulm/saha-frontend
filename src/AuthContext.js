import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, try to get user info if session exists
    useEffect(() => {
        axios.get('/api/user/')
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials) => {
        try {
            await axios.get('/api/csrf/');  // get CSRF cookie first
            const response = await axios.post('/api/login/', credentials);
            // After login success, fetch user info
            const userInfo = await axios.get('/api/user/');
            setUser(userInfo.data);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const logout = async () => {
        await axios.post('/api/logout/');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
