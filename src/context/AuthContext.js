import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', credentials, {
                withCredentials: true,
            });

            // Set user data from response
            setUser({
                username: response.data.username,
                email: response.data.email,
                city: response.data.city,
                role: response.data.role
            });

            setLoading(false);
            return { success: true };
        } catch (err) {
            console.error('Login failed', err);
            setLoading(false);
            return {
                success: false,
                error: err.response?.data?.error || 'Login failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/logout/', {}, {
                withCredentials: true
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};