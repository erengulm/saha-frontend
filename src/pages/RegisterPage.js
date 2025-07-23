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
    const navigate = useNavigate();

    // Turkish cities list
    const cities = [
        'Adana',
        'Adıyaman',
        'Afyonkarahisar',
        'Ağrı',
        'Aksaray',
        'Amasya',
        'Ankara',
        'Antalya',
        'Ardahan',
        'Artvin',
        'Aydın',
        'Balıkesir',
        'Bartın',
        'Batman',
        'Bayburt',
        'Bilecik',
        'Bingöl',
        'Bitlis',
        'Bolu',
        'Burdur',
        'Bursa',
        'Çanakkale',
        'Çankırı',
        'Çorum',
        'Denizli',
        'Diyarbakır',
        'Düzce',
        'Edirne',
        'Elazığ',
        'Erzincan',
        'Erzurum',
        'Eskişehir',
        'Gaziantep',
        'Giresun',
        'Gümüşhane',
        'Hakkâri',
        'Hatay',
        'Iğdır',
        'Isparta',
        'İstanbul',
        'İzmir',
        'Kahramanmaraş',
        'Karabük',
        'Karaman',
        'Kars',
        'Kastamonu',
        'Kayseri',
        'Kilis',
        'Kırıkkale',
        'Kırklareli',
        'Kırşehir',
        'Kocaeli',
        'Konya',
        'Kütahya',
        'Malatya',
        'Manisa',
        'Mardin',
        'Mersin',
        'Muğla',
        'Muş',
        'Nevşehir',
        'Niğde',
        'Ordu',
        'Osmaniye',
        'Rize',
        'Sakarya',
        'Samsun',
        'Siirt',
        'Sinop',
        'Sivas',
        'Şanlıurfa',
        'Şırnak',
        'Tekirdağ',
        'Tokat',
        'Trabzon',
        'Tunceli',
        'Uşak',
        'Van',
        'Yalova',
        'Yozgat',
        'Zonguldak',
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

        // Phone validation (now mandatory)
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Üye Kayıt</h2>

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
                                {/* First Name */}
                                <div className="mb-3">
                                    <label htmlFor="first_name" className="form-label">
                                        Adınız <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Adınızı giriniz"
                                    />
                                    {errors.first_name && (
                                        <div className="invalid-feedback">
                                            {errors.first_name}
                                        </div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="mb-3">
                                    <label htmlFor="last_name" className="form-label">
                                        Soyadınız <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Soyadınızı giriniz"
                                    />
                                    {errors.last_name && (
                                        <div className="invalid-feedback">
                                            {errors.last_name}
                                        </div>
                                    )}
                                </div>

                                {/* City */}
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">
                                        Yaşadığınız Şehir <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option value="">Şehir seçiniz</option>
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

                                {/* Phone Number */}
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">
                                        Telefon <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="05xx xxx xx xx"
                                    />
                                    {errors.phone && (
                                        <div className="invalid-feedback">
                                            {errors.phone}
                                        </div>
                                    )}
                                    <div className="form-text">
                                        Telefon numaranızı giriniz (örn: 05xx xxx xx xx)
                                    </div>
                                </div>

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
                                        placeholder="E-posta adresinizi giriniz"
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                    <div className="form-text">
                                        E-posta adresiniz giriş yaparken kullanılacaktır
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
                                        placeholder="Şifrenizi giriniz"
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                    <div className="form-text">
                                        Şifre en az 8 karakter uzunluğunda olmalıdır
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3">
                                    <label htmlFor="confirm_password" className="form-label">
                                        Şifre Tekrar <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm_password"
                                        name="confirm_password"
                                        className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                                        value={formData.confirm_password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Şifrenizi tekrar giriniz"
                                    />
                                    {errors.confirm_password && (
                                        <div className="invalid-feedback">
                                            {errors.confirm_password}
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
                                            Hesap Oluşturuluyor...
                                        </>
                                    ) : (
                                        'Hesap Oluştur'
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <p className="mb-0">
                                    Zaten hesabınız var mı?
                                    <a href="/login" className="text-decoration-none ms-1">Buradan giriş yapın</a>
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