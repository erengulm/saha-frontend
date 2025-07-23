import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import EditProfilePage from './pages/EditProfilePage';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';

function App() {
    const { user, logout } = useContext(AuthContext);
    // In your main App.js or index.js

// Function to get CSRF token
    const getCSRFToken = () => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 10) === ('csrftoken=')) {
                    cookieValue = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }
        return cookieValue;
    };

// Set default headers for all requests
    axios.defaults.headers.common['X-CSRFToken'] = getCSRFToken();
    axios.defaults.withCredentials = true;

// Or use an interceptor to get fresh token for each request
    axios.interceptors.request.use(
        (config) => {
            const token = getCSRFToken();
            if (token) {
                config.headers['X-CSRFToken'] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return (
        <Router>
            <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <Link to="/" style={{ marginRight: '10px' }}>Ana Sayfa</Link>

                {!user ? (
                    <>
                        <Link to="/login" style={{ marginRight: '10px' }}>Giriş Yap</Link>
                        <Link to="/register" style={{ marginRight: '10px' }}>Kayıt Ol</Link>
                    </>
                ) : (
                    <>
                        <Link to="/map" style={{ marginRight: '10px' }}>Harita</Link>
                        <Link to="/edit-profile" style={{ marginRight: '10px' }}>Profili Düzenle</Link>
                        <button onClick={logout}>Çıkış Yap</button>
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
                <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
                <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" replace />} />
                <Route path="/edit-profile" element={user ? <EditProfilePage /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<h2>404 - Sayfa bulunamadı</h2>} />
            </Routes>
        </Router>
    );
}

export default App;