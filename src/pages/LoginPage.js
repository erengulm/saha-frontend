import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, loading: authLoading, error: authError, clearError } = useContext(AuthContext);

    useEffect(() => {
        // Clear any previous auth errors when component mounts
        if (clearError) {
            clearError();
        }
    }, [clearError]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'E-posta adresi gereklidir';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi girin';
        }

        if (!formData.password) {
            newErrors.password = 'Şifre gereklidir';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Şifre en az 8 karakter olmalıdır';
        }

        return newErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        // Clear any previous auth errors
        if (clearError) {
            clearError();
        }

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const loginData = {
                email: formData.email.trim(),
                password: formData.password
            };

            const result = await login(loginData);

            if (result?.success) {
                setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
                // Navigate to map page after successful login
                setTimeout(() => {
                    window.location.href = '/map'; // Simple redirect - replace with your router navigation
                }, 1000);
            } else {
                // Handle errors from the login result
                if (result?.errors && Object.keys(result.errors).length > 0) {
                    setErrors(result.errors);
                } else {
                    setErrors({
                        general: result?.error || 'Giriş başarısız. E-posta veya şifre hatalı.'
                    });
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                general: 'Giriş başarısız. Lütfen tekrar deneyin.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2 className="login-title">Giriş Yap</h2>
                        <p className="login-subtitle">
                            Hesabınıza giriş yaparak harekete katılın
                        </p>
                    </div>

                    {(errors.general || authError) && (
                        <div className="error-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {errors.general || authError}
                        </div>
                    )}

                    {successMessage && (
                        <div className="success-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    <div onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                E-posta Adresi
                                <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="E-posta adresinizi girin"
                                />
                            </div>
                            <div className="field-error">
                                {errors.email || ''}
                            </div>
                            <div className="field-help">
                                Kayıt olurken kullandığınız e-posta adresini girin
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Şifre
                                <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Şifrenizi girin"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 4.028 7.66032 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1749 15.0074 10.8016 14.8565C10.4283 14.7056 10.0887 14.481 9.80385 14.1962C9.51900 13.9113 9.29439 13.5717 9.14351 13.1984C8.99262 12.8251 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4858 9.58525 10.1546 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="field-error">
                                {errors.password || ''}
                            </div>
                            <div className="field-help">
                                En az 8 karakter uzunluğunda olmalıdır
                            </div>
                        </div>

                        <button
                            type="button"
                            className="login-button"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                <>
                                    <span>Giriş Yap</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>
                            Hesabınız yok mu?
                            <a href="/register" className="register-link">
                                Buradan kayıt olun
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --bg-primary: #0f172a;
                    --bg-secondary: #1e293b;
                    --bg-tertiary: #334155;
                    --text-primary: #f8fafc;
                    --text-muted: #94a3b8;
                    --text-accent: #60a5fa;
                    --primary-blue: #3b82f6;
                    --primary-blue-light: #60a5fa;
                    --primary-blue-dark: #2563eb;
                    --border-primary: rgba(148, 163, 184, 0.2);
                    --border-accent: rgba(59, 130, 246, 0.2);
                    --shadow-blue: rgba(59, 130, 246, 0.3);
                    --radius-sm: 8px;
                    --radius-lg: 16px;
                    --transition-fast: 150ms ease;
                    --transition-normal: 300ms ease;
                }

                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
                }

                .login-container {
                    width: 100%;
                    max-width: 480px;
                }

                .login-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-lg);
                    padding: 3rem;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .login-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-accent) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .login-subtitle {
                    color: var(--text-muted);
                    font-size: 1rem;
                    margin: 0;
                }

                .error-message, .success-message {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #fca5a5;
                }

                .success-message {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    color: #86efac;
                }

                .login-form {
                    margin-bottom: 2rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group:last-of-type {
                    margin-bottom: 2rem;
                }

                .form-label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--text-primary);
                }

                .required {
                    color: #f87171;
                    margin-left: 0.25rem;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    pointer-events: none;
                }

                .form-input {
                    width: 100%;
                    padding: 1rem 3rem 1rem 3rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-sm);
                    color: var(--text-primary);
                    font-size: 1rem;
                    transition: all var(--transition-normal);
                    box-sizing: border-box;
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--primary-blue);
                    box-shadow: 0 0 0 3px var(--border-accent);
                    background: rgba(255, 255, 255, 0.08);
                }

                .form-input.error {
                    border-color: #f87171;
                    box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
                }

                .form-input::placeholder {
                    color: var(--text-muted);
                }

                .password-toggle {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: all var(--transition-fast);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .password-toggle:hover {
                    color: var(--text-primary);
                    background: rgba(255, 255, 255, 0.1);
                }

                .field-error {
                    color: #f87171;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    min-height: 1.25rem;
                    display: block;
                }

                .field-help {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    min-height: 1.25rem;
                    display: block;
                }

                .login-button {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
                    color: white;
                    border: none;
                    border-radius: var(--radius-sm);
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .login-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px var(--shadow-blue);
                }

                .login-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .login-footer {
                    text-align: center;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--border-primary);
                }

                .login-footer p {
                    color: var(--text-muted);
                    margin: 0;
                }

                .register-link {
                    color: var(--primary-blue-light);
                    text-decoration: none;
                    font-weight: 600;
                    margin-left: 0.5rem;
                    transition: color var(--transition-fast);
                }

                .register-link:hover {
                    color: var(--primary-blue);
                    text-decoration: underline;
                }

                @media (max-width: 640px) {
                    .login-card {
                        padding: 2rem 1.5rem;
                    }

                    .login-title {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;