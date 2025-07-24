import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getCSRFToken } from '../utils/csrf';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '', // Changed from username to email
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        getCSRFToken();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'E-posta adresi gereklidir';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi girin';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Şifre gereklidir';
        } else if (formData.password.length < 8) { // Match your backend validation
            newErrors.password = 'Şifre en az 8 karakter olmalıdır';
        }

        return newErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const loginData = {
                email: formData.email.trim(), // Send email instead of username
                password: formData.password
            };

            const result = await login(loginData);

            if (result?.success) {
                setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');

                // Redirect to map page after 1 second
                setTimeout(() => {
                    navigate('/map');
                }, 1000);
            } else {
                setErrors({
                    general: result?.error || 'Giriş başarısız. E-posta veya şifre hatalı.'
                });
            }
        } catch (error) {
            console.error('Login error:', error);

            if (error.response?.data) {
                // Handle specific field errors from backend
                const backendErrors = error.response.data;
                setErrors(backendErrors);
            } else {
                setErrors({
                    general: 'Giriş başarısız. Lütfen tekrar deneyin.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Giriş Yap</h2>

                            {errors.general && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.general}
                                </div>
                            )}

                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                {/* Email */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        E-posta <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="E-posta adresinizi girin"
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                    <div className="form-text">
                                        Kayıt olurken kullandığınız e-posta adresini girin
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Şifre <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Şifrenizi girin"
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}

                                    {/*<div className="form-text">*/}
                                    {/*    Şifreniz en az 8 karakter uzunluğunda olmalıdır*/}
                                    {/*</div>*/}

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Giriş yapılıyor...
                                        </>
                                    ) : (
                                        'Giriş Yap'
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <p className="mb-0">
                                    Hesabınız yok mu?
                                    <a href="/register" className="text-decoration-none ms-1">Buradan kayıt olun</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;