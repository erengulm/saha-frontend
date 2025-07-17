import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapPage from './pages/MapPage';
import EditProfilePage from './pages/EditProfilePage';
import { AuthContext } from './context/AuthContext';

function App() {
    const { user, logout } = useContext(AuthContext);

    return (
        <Router>
            <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <Link to="/" style={{ marginRight: '10px' }}>Home</Link>

                {!user ? (
                    <>
                        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                        <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/map" style={{ marginRight: '10px' }}>Map</Link>
                        <Link to="/edit-profile" style={{ marginRight: '10px' }}>Edit Profile</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
                <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
                <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" replace />} />
                <Route path="/edit-profile" element={user ? <EditProfilePage /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<h2>404 - Page not found</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
