import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getCSRFToken } from "../utils/csrf";

export const AuthContext = createContext();

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Add axios interceptor for automatic CSRF handling
axios.interceptors.request.use(
    async (config) => {
        // For POST, PUT, PATCH, DELETE requests, add CSRF token
        if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
            const csrfToken = getCSRFToken();
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            } else {
                // If no CSRF token in cookies, fetch it first
                try {
                    await axios.get('/api/csrf/');
                    const newCsrfToken = getCSRFToken();
                    if (newCsrfToken) {
                        config.headers['X-CSRFToken'] = newCsrfToken;
                    }
                } catch (error) {
                    console.warn('Failed to fetch CSRF token:', error);
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Clear any previous errors
    const clearError = () => setError(null);

    // On mount, try to get user info if session exists
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Use the correct endpoint from your Django views
                const response = await axios.get('/api/user/profile/');
                setUser(response.data);
                setError(null);
            } catch (err) {
                // Only log if it's not a 401/403 (which is expected for unauthenticated users)
                if (err.response?.status !== 401 && err.response?.status !== 403) {
                    console.warn('Error checking auth status:', err);
                    setError('Failed to check authentication status');
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            clearError();

            console.log('Login attempt with credentials:', {
                email: credentials.email,
                passwordProvided: !!credentials.password
            });

            // Login request - make sure to send email, not username
            const loginData = {
                email: credentials.email,
                password: credentials.password
            };

            const response = await axios.post('/api/login/', loginData);
            console.log('Login response:', response.data);

            // After login success, fetch user info using the correct endpoint
            const userResponse = await axios.get('/api/user/profile/');
            console.log('User profile response:', userResponse.data);

            setUser(userResponse.data);

            return { success: true, data: userResponse.data };
        } catch (err) {
            console.error('Login error:', err);
            console.error('Error response:', err.response?.data);

            const errorMessage = err.response?.data?.error ||
                err.response?.data?.message ||
                'Login failed';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
                errors: err.response?.data?.errors || {}
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            clearError();

            await axios.post('/api/logout/', {});

            // Clear user state regardless of server response
            setUser(null);

            return { success: true };
        } catch (error) {
            console.error('Logout request failed:', error);

            // Still clear user state even if server request fails
            // This handles cases where the server is down but we want to clear local state
            setUser(null);

            const errorMessage = error.response?.data?.error || 'Logout failed';
            setError(errorMessage);

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            clearError();

            // Use the correct endpoint from your Django views
            const response = await axios.put('/api/user/profile/update/', profileData);

            // Update user state with new data
            setUser(response.data.user || response.data);

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.error ||
                err.response?.data?.message ||
                'Profile update failed';
            setError(errorMessage);

            return {
                success: false,
                error: errorMessage,
                errors: err.response?.data?.errors || {}
            };
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (passwordData) => {
        try {
            setLoading(true);
            clearError();

            // Use the correct endpoint from your Django views
            await axios.put('/api/user/change-password/', passwordData);

            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.error ||
                err.response?.data?.message ||
                'Password change failed';
            setError(errorMessage);

            return {
                success: false,
                error: errorMessage,
                errors: err.response?.data?.errors || {}
            };
        } finally {
            setLoading(false);
        }
    };

    // Refresh user data
    const refreshUser = async () => {
        try {
            const response = await axios.get('/api/user/profile/');
            setUser(response.data);
            setError(null);
            return { success: true, data: response.data };
        } catch (err) {
            setUser(null);
            const errorMessage = 'Failed to refresh user data';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const contextValue = {
        user,
        login,
        logout,
        loading,
        error,
        updateProfile,
        changePassword,
        refreshUser,
        clearError
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return {
        ...context,
        isAuthenticated: !!context.user,
        isLoading: context.loading,
        hasError: !!context.error
    };
};