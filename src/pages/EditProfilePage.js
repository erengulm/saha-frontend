import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateProfile, changePassword, loading: authLoading, error: authError, isAuthenticated } = useAuth();

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        city: '',
        phone: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Turkish cities list (same as register page)
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

    // Check authentication and redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Populate form with user data when user is loaded
    useEffect(() => {
        if (user) {
            setProfileData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                city: user.city || '',
                phone: user.phone || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
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

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
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

    const validateProfileForm = () => {
        const newErrors = {};

        // First name validation (same as register)
        if (!profileData.first_name.trim()) {
            newErrors.first_name = 'Ad gereklidir';
        } else if (profileData.first_name.length < 2) {
            newErrors.first_name = 'Ad en az 2 karakter olmalıdır';
        }

        // Last name validation (same as register)
        if (!profileData.last_name.trim()) {
            newErrors.last_name = 'Soyad gereklidir';
        } else if (profileData.last_name.length < 2) {
            newErrors.last_name = 'Soyad en az 2 karakter olmalıdır';
        }

        // City validation (same as register)
        if (!profileData.city) {
            newErrors.city = 'Lütfen şehir seçiniz';
        }

        // Phone validation (same as register)
        if (!profileData.phone.trim()) {
            newErrors.phone = 'Telefon numarası gereklidir';
        } else {
            const phoneRegex = /^(\+90|0)?[5][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/;
            if (!phoneRegex.test(profileData.phone.replace(/[\s-]/g, ''))) {
                newErrors.phone = 'Lütfen geçerli bir Türk telefon numarası giriniz. (Örn: 05XXXXXXXXX)';
            }
        }

        // Email validation (same as register)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!profileData.email.trim()) {
            newErrors.email = 'E-posta gereklidir';
        } else if (!emailRegex.test(profileData.email)) {
            newErrors.email = 'Lütfen geçerli bir e-posta adresi giriniz';
        }

        return newErrors;
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        // Current password validation
        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Mevcut şifrenizi giriniz';
        }

        // New password validation (same as register)
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'Yeni şifre gereklidir';
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'Yeni şifre en az 8 karakter olmalıdır';
        }

        // Confirm password validation (same as register)
        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Yeni şifreyi tekrar giriniz';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        // Check if new password is different from current
        if (passwordData.currentPassword && passwordData.newPassword &&
            passwordData.currentPassword === passwordData.newPassword) {
            newErrors.newPassword = 'Yeni şifre mevcut şifreden farklı olmalıdır';
        }

        return newErrors;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        // Validate form
        const validationErrors = validateProfileForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const result = await updateProfile(profileData);

            if (result.success) {
                setSuccessMessage('Profil bilgileriniz başarıyla güncellendi! Ana sayfaya yönlendiriliyorsunuz...');
                // Clear any previous errors
                setErrors({});

                // Redirect to homepage after half a second
                setTimeout(() => {
                    navigate('/');
                }, 500);
            } else {
                // Handle errors from the updateProfile function
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    setErrors({ general: result.error || 'Profil güncellenirken bir hata oluştu' });
                }
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setErrors({ general: 'Beklenmeyen bir hata oluştu' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        // Validate form
        const validationErrors = validatePasswordForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            // Transform data to match backend expectations
            const passwordChangeData = {
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword,
                confirm_password: passwordData.confirmPassword
            };

            const result = await changePassword(passwordChangeData);

            if (result.success) {
                setSuccessMessage('Şifreniz başarıyla değiştirildi!');
                // Clear password form
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                // Clear any previous errors
                setErrors({});
            } else {
                // Handle errors from the changePassword function
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    setErrors({ general: result.error || 'Şifre değiştirilirken bir hata oluştu' });
                }
            }
        } catch (error) {
            console.error('Password change error:', error);
            setErrors({ general: 'Beklenmeyen bir hata oluştu' });
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking authentication or user data
    if (authLoading || !user) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                <div className="text-center mt-3">
                    <p>Profil bilgileriniz yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title mb-0">Profil Düzenle</h2>
                        </div>
                        <div className="card-body">
                            {/* Tab Navigation */}
                            <ul className="nav nav-tabs mb-4" id="profileTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveTab('profile');
                                            setErrors({});
                                            setSuccessMessage('');
                                        }}
                                        type="button"
                                    >
                                        Profil Bilgileri
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveTab('password');
                                            setErrors({});
                                            setSuccessMessage('');
                                        }}
                                        type="button"
                                    >
                                        Şifre Değiştir
                                    </button>
                                </li>
                            </ul>

                            {/* Success Message */}
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}

                            {/* General Error Message */}
                            {(errors.general || authError) && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.general || authError}
                                </div>
                            )}

                            {/* Profile Tab Content */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleProfileSubmit}>
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
                                            value={profileData.first_name}
                                            onChange={handleProfileInputChange}
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
                                            value={profileData.last_name}
                                            onChange={handleProfileInputChange}
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
                                            value={profileData.city}
                                            onChange={handleProfileInputChange}
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
                                            value={profileData.phone}
                                            onChange={handleProfileInputChange}
                                            disabled={loading}
                                            placeholder="05xx xxx xx xx"
                                        />
                                        {errors.phone && (
                                            <div className="invalid-feedback">
                                                {errors.phone}
                                            </div>
                                        )}
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
                                            value={profileData.email}
                                            onChange={handleProfileInputChange}
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

                                    <div className="d-flex justify-content-between">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/')}
                                            disabled={loading}
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Güncelleniyor...
                                                </>
                                            ) : (
                                                'Profili Güncelle'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Password Tab Content */}
                            {activeTab === 'password' && (
                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="row justify-content-center">
                                        <div className="col-md-8">
                                            {/* Current Password */}
                                            <div className="mb-3">
                                                <label htmlFor="currentPassword" className="form-label">
                                                    Mevcut Şifre <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    className={`form-control ${errors.currentPassword || errors.current_password ? 'is-invalid' : ''}`}
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordInputChange}
                                                    disabled={loading}
                                                />
                                                {(errors.currentPassword || errors.current_password) && (
                                                    <div className="invalid-feedback">
                                                        {errors.currentPassword || errors.current_password}
                                                    </div>
                                                )}
                                            </div>

                                            {/* New Password */}
                                            <div className="mb-3">
                                                <label htmlFor="newPassword" className="form-label">
                                                    Yeni Şifre <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    className={`form-control ${errors.newPassword || errors.new_password ? 'is-invalid' : ''}`}
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordInputChange}
                                                    disabled={loading}
                                                />
                                                {(errors.newPassword || errors.new_password) && (
                                                    <div className="invalid-feedback">
                                                        {errors.newPassword || errors.new_password}
                                                    </div>
                                                )}
                                                <div className="form-text">
                                                    Şifre en az 8 karakter uzunluğunda olmalıdır
                                                </div>
                                            </div>

                                            {/* Confirm New Password */}
                                            <div className="mb-4">
                                                <label htmlFor="confirmPassword" className="form-label">
                                                    Yeni Şifre Tekrar <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    className={`form-control ${errors.confirmPassword || errors.confirm_password ? 'is-invalid' : ''}`}
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordInputChange}
                                                    disabled={loading}
                                                />
                                                {(errors.confirmPassword || errors.confirm_password) && (
                                                    <div className="invalid-feedback">
                                                        {errors.confirmPassword || errors.confirm_password}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => {
                                                        setPasswordData({
                                                            currentPassword: '',
                                                            newPassword: '',
                                                            confirmPassword: ''
                                                        });
                                                        setErrors({});
                                                        setSuccessMessage('');
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Temizle
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-warning"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                            Değiştiriliyor...
                                                        </>
                                                    ) : (
                                                        'Şifreyi Değiştir'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;