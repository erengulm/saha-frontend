import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCSRFToken } from '../utils/csrf';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    useEffect(() => {
        getCSRFToken();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8000/api/login/',
                { username, password },
                { withCredentials: true }
            );
            setLoginStatus(`Success! Logged in as ${response.data.username}`);
        } catch (error) {
            console.error(error);
            setLoginStatus('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            {loginStatus && <p className="mt-3">{loginStatus}</p>}
        </div>
    );
};

export default LoginPage;
