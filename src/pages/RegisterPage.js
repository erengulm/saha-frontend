import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCSRFToken } from '../utils/csrf';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        city: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    // Turkish cities list
    const cities = [
        'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
        'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
        'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
        'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
        'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
        'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis',
        'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
        'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize',
        'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ',
        'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
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

        // First name validation
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'Ad gereklidir';
        } else if (formData.first_name.length < 2) {
            newErrors.first_name = 'Ad en az 2 karakter olmalıdır';
        }

        // Last name validation
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Soyad gereklidir';
        } else if (formData.last_name.length < 2) {
            newErrors.last_name = 'Soyad en az 2 karakter olmalıdır';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'E-posta gereklidir';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Lütfen geçerli bir e-posta adresi giriniz';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefon numarası gereklidir';
        } else {
            const phoneRegex = /^(\+90|0)?[5][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/;
            if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
                newErrors.phone = 'Lütfen geçerli bir Türk telefon numarası giriniz. (Örn: 05XXXXXXXXX)';
            }
        }

        // City validation
        if (!formData.city) {
            newErrors.city = 'Lütfen şehir seçiniz';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Şifre gereklidir';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Şifre en az 8 karakter olmalıdır';
        }

        // Confirm password validation
        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Lütfen şifrenizi tekrar giriniz';
        } else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Şifreler eşleşmiyor';
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
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                city: formData.city,
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                password: formData.password,
                confirm_password: formData.confirm_password,
                role: 'member'
            };

            await axios.post('http://127.0.0.1:8000/api/register/', registrationData, {
                withCredentials: true,
            });

            setSuccessMessage('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');

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
                    general: 'Kayıt işlemi başarısız. Lütfen tekrar deneyiniz.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h2 className="register-title">Harekete Katıl</h2>
                        <p className="register-subtitle">
                            Türkiye'nin geleceği için bir araya geliyoruz
                        </p>
                    </div>

                    {errors.general && (
                        <div className="error-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {errors.general}
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

                    <form onSubmit={handleRegister} className="register-form">
                        {/* Name Fields Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="first_name" className="form-label">
                                    Adınız
                                    <span className="required">*</span>
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        className={`form-input ${errors.first_name ? 'error' : ''}`}
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Adınızı giriniz"
                                    />
                                </div>
                                <div className="field-error">
                                    {errors.first_name || ''}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="last_name" className="form-label">
                                    Soyadınız
                                    <span className="required">*</span>
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        className={`form-input ${errors.last_name ? 'error' : ''}`}
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Soyadınızı giriniz"
                                    />
                                </div>
                                <div className="field-error">
                                    {errors.last_name || ''}
                                </div>
                            </div>
                        </div>

                        {/* City and Phone Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city" className="form-label">
                                    Yaşadığınız Şehir
                                    <span className="required">*</span>
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <select
                                        id="city"
                                        name="city"
                                        className={`form-select ${errors.city ? 'error' : ''}`}
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="">Şehir seçiniz</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field-error">
                                    {errors.city || ''}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">
                                    Telefon
                                    <span className="required">*</span>
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59344 1.99522 8.06456 2.16708 8.43415 2.48353C8.80373 2.79999 9.04344 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className={`form-input ${errors.phone ? 'error' : ''}`}
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="05xx xxx xx xx"
                                    />
                                </div>
                                <div className="field-error">
                                    {errors.phone || ''}
                                </div>
                            </div>
                        </div>

                        {/* Email */}
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
                                    placeholder="E-posta adresinizi giriniz"
                                />
                            </div>
                            <div className="field-error">
                                {errors.email || ''}
                            </div>
                            <div className="form-text">
                                E-posta adresiniz oturum açarken kullanılacaktır
                            </div>
                        </div>

                        {/* Password Fields Row */}
                        <div className="form-row">
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
                                        placeholder="Şifrenizi giriniz"
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
                                <div className="form-text">
                                    Şifre en az 8 karakter uzunluğunda olmalıdır
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm_password" className="form-label">
                                    Şifre Tekrar
                                    <span className="required">*</span>
                                </label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirm_password"
                                        name="confirm_password"
                                        className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                                        value={formData.confirm_password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Şifrenizi tekrar giriniz"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
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
                                    {errors.confirm_password || ''}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Hesap Oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    <span>Hesap Oluştur</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            Zaten hesabınız var mı?
                            <span
                                onClick={() => navigate('/login')}
                                className="login-link"
                            >
                                Buradan giriş yapın
                            </span>
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

                .register-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
                }

                .register-container {
                    width: 100%;
                    max-width: 800px;
                }

                .register-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-lg);
                    padding: 3rem;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .register-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .register-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-accent) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .register-subtitle {
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

                .register-form {
                    margin-bottom: 2rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-row .form-group {
                    margin-bottom: 0;
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
                    z-index: 2;
                }

                .form-input, .form-select {
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

                .form-select {
                    cursor: pointer;
                }

                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: var(--primary-blue);
                    box-shadow: 0 0 0 3px var(--border-accent);
                    background: rgba(255, 255, 255, 0.08);
                }

                .form-input.error, .form-select.error {
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
                    z-index: 2;
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

                .form-text {
                    color: var(--text-muted);
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }

                .register-button {
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
                    margin-top: 1rem;
                }

                .register-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px var(--shadow-blue);
                }

                .register-button:disabled {
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

                .register-footer {
                    text-align: center;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--border-primary);
                }

                .register-footer p {
                    color: var(--text-muted);
                    margin: 0;
                }

                .login-link {
                    color: var(--primary-blue-light);
                    font-weight: 600;
                    margin-left: 0.5rem;
                    transition: color var(--transition-fast);
                    cursor: pointer;
                }

                .login-link:hover {
                    color: var(--primary-blue);
                    text-decoration: underline;
                }

                @media (max-width: 768px) {
                    .register-card {
                        padding: 2rem 1.5rem;
                    }

                    .register-title {
                        font-size: 1.75rem;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 0;
                        margin-bottom: 0;
                    }

                    .form-row .form-group {
                        margin-bottom: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .register-page {
                        padding: 1rem 0.5rem;
                    }

                    .register-card {
                        padding: 1.5rem 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;