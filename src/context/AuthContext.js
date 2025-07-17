// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (credentials) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/login/', credentials, {
                withCredentials: true,
            });
            setUser(credentials.username);
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    const logout = async () => {
        await axios.post('http://127.0.0.1:8000/api/logout/', {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
