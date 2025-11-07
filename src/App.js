import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import UyelerdenHaberlerPage from './pages/UyelerdenHaberlerPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import SahadanHaberlerPage from './pages/SahadanHaberlerPage';
import MakalelerPage from './pages/MakalelerPage';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import axios from 'axios';
import './App.css';

function App() {
    const { user, logout } = useContext(AuthContext);

    
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
        <div className="App">
            <Router>
                <Navbar user={user} logout={logout} />

                <main className="main-content" style={{ paddingTop: '12px', padding: '12px 1rem 0 1rem' }}>
                    <Routes>
                        <Route path="/" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />
                        <Route path="/uyelerden-haberler" element={<UyelerdenHaberlerPage />} />
                        <Route path="/sahadan-haberler" element={<SahadanHaberlerPage />} />
                        <Route path="/makaleler" element={<MakalelerPage />} />
                        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
                        <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" replace />} />
                        <Route path="*" element={
                            <div className="error-page">
                                <div className="content-section">
                                    <h2 className="section-title">404 - Sayfa Bulunamadı</h2>
                                    <p className="section-content">
                                        Aradığınız sayfa mevcut değil. Ana sayfaya dönmek için
                                        <Link to="/" className="btn-primary" style={{marginLeft: '3px'}}>
                                            buraya tıklayın
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        } />
                    </Routes>
                </main>

                <footer className="footer">
                    <div className="footer-content">
                        <p>&copy; 2025 HareketPlatform. Tüm hakları saklıdır.</p>
                    </div>
                </footer>
            </Router>
        </div>
    );
}

export default App;