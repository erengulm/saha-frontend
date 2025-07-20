import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCSRFToken } from '../utils/csrf';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        city: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    // List of cities (you can expand this or fetch from API)
    const cities = [
        'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
        'Gaziantep', 'Mersin', 'Diyarbakir', 'Kayseri', 'Eskisehir', 'Other'
    ];

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

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // City validation
        if (!formData.city) {
            newErrors.city = 'Please select a city';
        }

        return newErrors;
    };

    const handleRegister = async (e) => {
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
            const registrationData = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                city: formData.city,
                role: 'member' // Default role for new registrations
            };

            await axios.post('http://127.0.0.1:8000/api/register/', registrationData, {
                withCredentials: true,
            });

            setSuccessMessage('Registration successful! Redirecting to login...');

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);

            if (error.response?.data) {
                // Handle specific field errors from backend
                const backendErrors = error.response.data;
                setErrors(backendErrors);
            } else {
                setErrors({
                    general: 'Registration failed. Please try again.'
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
                            <h2 className="card-title text-center mb-4">Register</h2>

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

                            <form onSubmit={handleRegister}>
                                {/* Username */}
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        Username <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Enter your username"
                                    />
                                    {errors.username && (
                                        <div className="invalid-feedback">
                                            {errors.username}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                {/* City */}
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">
                                        City <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select your city</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    {errors.city && (
                                        <div className="invalid-feedback">
                                            {errors.city}
                                        </div>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Enter your password"
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                    <div className="form-text">
                                        Password must be at least 6 characters long.
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirm Password <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Confirm your password"
                                    />
                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback">
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <p className="mb-0">
                                    Already have an account?
                                    <a href="/login" className="text-decoration-none ms-1">Login here</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;