import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Fallback cities list in case API fails
const fallbackCities = [
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

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateProfile, changePassword, loading: authLoading, error: authError, isAuthenticated } = useAuth();

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        city: '',
        ilce: '',
        mahalle: ''
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
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Location data - loaded from API
    const [cities, setCities] = useState([]);
    const [districtsByCity, setDistrictsByCity] = useState({});
    const [neighborhoodsByDistrict, setNeighborhoodsByDistrict] = useState({});

    // API functions for location data
    const fetchCities = async () => {
        try {
            console.log('Fetching cities from API...');
            const response = await fetch('http://localhost:8000/api/locations/cities/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Cities API response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Cities API response data:', data);
            if (data.success && data.cities) {
                console.log('Setting cities:', data.cities.length, 'cities');
                setCities(data.cities);
                return true; // Success
            } else {
                console.error('Cities API returned success: false or no cities');
                return false; // Failed
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            return false; // Failed
        }
    };

    const fetchDistricts = useCallback(async (cityName) => {
        try {
            // Set an empty list immediately so UI updates while fetching
            setDistrictsByCity(prev => ({ ...prev, [cityName]: [] }));

            const response = await fetch(`http://localhost:8000/api/locations/districts/${encodeURIComponent(cityName)}/`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (data.success) {
                setDistrictsByCity(prev => ({
                    ...prev,
                    [cityName]: data.districts
                }));
            } else {
                console.error('Error fetching districts: success false', data);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
            // keep empty array (no districts)
            setDistrictsByCity(prev => ({ ...prev, [cityName]: [] }));
        }
    }, []);

    const fetchNeighborhoods = useCallback(async (cityName, districtName) => {
        try {
            // Initialize empty list for district while fetching
            setNeighborhoodsByDistrict(prev => ({ ...prev, [districtName]: [] }));

            const response = await fetch(`http://localhost:8000/api/locations/neighborhoods/${encodeURIComponent(cityName)}/${encodeURIComponent(districtName)}/`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (data.success) {
                setNeighborhoodsByDistrict(prev => ({
                    ...prev,
                    [districtName]: data.neighborhoods
                }));
            } else {
                console.error('Error fetching neighborhoods: success false', data);
            }
        } catch (error) {
            console.error('Error fetching neighborhoods:', error);
            setNeighborhoodsByDistrict(prev => ({ ...prev, [districtName]: [] }));
        }
    }, []);



    // Load cities on component mount
    useEffect(() => {
        const loadCities = async () => {
            const success = await fetchCities();
            // If API failed, use fallback
            if (!success) {
                console.log('Using fallback cities list');
                setCities(fallbackCities);
            }
        };
        loadCities();
    }, []);

    // Check authentication and redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Populate form with user data when user is loaded (only when user changes)
    useEffect(() => {
        if (user) {
            setProfileData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                ilce: user.ilce || '',
                mahalle: user.mahalle || ''
            });
        }
    }, [user]);

    // Load initial location data separately (only when user changes)
    useEffect(() => {
        if (user && user.city) {
            // Load districts for user's city if not already loaded
            if (!districtsByCity[user.city]) {
                fetchDistricts(user.city);
            }
            // Load neighborhoods for user's district if not already loaded
            if (user.ilce && !neighborhoodsByDistrict[user.ilce]) {
                fetchNeighborhoods(user.city, user.ilce);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        console.log('handleProfileInputChange:', name, '=', value);
        
        // Handle cascading dropdown logic
        if (name === 'city') {
            setProfileData(prev => ({
                ...prev,
                [name]: value,
                ilce: '',  // Reset district when city changes
                mahalle: ''  // Reset neighborhood when city changes
            }));
            // Fetch districts for the selected city
            if (value && !districtsByCity[value]) {
                fetchDistricts(value);
            }
        } else if (name === 'ilce') {
            console.log('Setting ilce to:', value, 'previous data:', profileData);
            setProfileData(prev => {
                const newData = {
                    ...prev,
                    [name]: value,
                    mahalle: ''  // Reset neighborhood when district changes
                };
                console.log('New profile data after ilce change:', newData);
                return newData;
            });
            // Fetch neighborhoods for the selected district
            // Determine current city value (in case city was changed just before selecting ilce)
            const currentCity = document.getElementById('city')?.value || profileData.city || '';
            console.log('Fetching neighborhoods for city:', currentCity, 'district:', value);
            if (value && currentCity && !neighborhoodsByDistrict[value]) {
                fetchNeighborhoods(currentCity, value);
            }
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }

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
                newErrors.phone = 'Lütfen geçerli bir Türk telefon numarası giriniz';
            }
        }

        // Email validation (same as register)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!profileData.email.trim()) {
            newErrors.email = 'E-posta gereklidir';
        } else if (!emailRegex.test(profileData.email)) {
            newErrors.email = 'Lütfen geçerli bir e-posta adresi giriniz';
        }

        // İlçe validation
        if (!profileData.ilce) {
            newErrors.ilce = 'Lütfen ilçe seçiniz';
        }

        // Mahalle validation
        if (!profileData.mahalle) {
            newErrors.mahalle = 'Lütfen mahalle seçiniz';
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
                setSuccessMessage('Profil bilgileriniz başarıyla güncellendi!');
                // Clear any previous errors
                setErrors({});

                // Refresh the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
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

                // Refresh the page after a short delay (same as profile update)
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
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
            <div className="edit-profile-page">
                <div className="edit-profile-container">
                    <div className="edit-profile-card">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Profil bilgileriniz yükleniyor...</p>
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

                    .edit-profile-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem 1rem;
                        background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
                    }

                    .edit-profile-container {
                        width: 100%;
                        max-width: 800px;
                    }

                    .edit-profile-card {
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid var(--border-primary);
                        border-radius: var(--radius-lg);
                        padding: 3rem;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    }

                    .loading-container {
                        text-align: center;
                        color: var(--text-primary);
                    }

                    .loading-spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        border-top-color: var(--primary-blue);
                        animation: spin 1s linear infinite;
                        margin: 0 auto 1rem;
                    }

                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-container">
                <div className="edit-profile-card">
                    <div className="edit-profile-header">
                        <h2 className="edit-profile-title">Profilim</h2>
                        <p className="edit-profile-subtitle">
                            Bilgilerinizi görüntüleyin
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="tab-navigation">
                        <button
                            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('profile');
                                setErrors({});
                                setSuccessMessage('');
                            }}
                            type="button"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Kişisel Bilgiler
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('about');
                                setErrors({});
                                setSuccessMessage('');
                            }}
                            type="button"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Hakkımda
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('password');
                                setErrors({});
                                setSuccessMessage('');
                            }}
                            type="button"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Şifre Değiştir
                        </button>
                    </div>

                    {/* General Error Message */}
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

                    {/* Success Message */}
                    {successMessage && (
                        <div className="success-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {successMessage}
                        </div>
                    )}

                    {/* Profile Tab Content */}
                    {activeTab === 'profile' && (
                        <div className="edit-profile-form">
                            <form onSubmit={handleProfileSubmit}>
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
                                                value={profileData.first_name}
                                                onChange={handleProfileInputChange}
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
                                                value={profileData.last_name}
                                                onChange={handleProfileInputChange}
                                                disabled={loading}
                                                placeholder="Soyadınızı giriniz"
                                            />
                                        </div>
                                        <div className="field-error">
                                            {errors.last_name || ''}
                                        </div>
                                    </div>
                                </div>

                                {/* Email and Phone Row */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            E-posta
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
                                                value={profileData.email}
                                                onChange={handleProfileInputChange}
                                                disabled={loading}
                                                placeholder="E-posta adresinizi giriniz"
                                            />
                                        </div>
                                        <div className="field-error">
                                            {errors.email || ''}
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
                                                value={profileData.phone}
                                                onChange={handleProfileInputChange}
                                                disabled={loading}
                                                placeholder="05xx xxx xx xx"
                                            />
                                        </div>
                                        <div className="field-error">
                                            {errors.phone || ''}
                                        </div>
                                    </div>
                                </div>

                                {/* City and İlçe Row */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city" className="form-label">
                                            Şehir
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
                                                value={profileData.city}
                                                onChange={handleProfileInputChange}
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
                                        <label htmlFor="ilce" className="form-label">
                                            İlçe
                                            <span className="required">*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <select
                                                id="ilce"
                                                name="ilce"
                                                className={`form-select ${errors.ilce ? 'error' : ''}`}
                                                value={profileData.ilce}
                                                onChange={handleProfileInputChange}
                                                disabled={loading || !profileData.city}
                                            >
                                                <option value="">İlçe seçiniz</option>
                                                {profileData.city && districtsByCity[profileData.city] && 
                                                    districtsByCity[profileData.city].map(district => (
                                                        <option key={district} value={district}>{district}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="field-error">
                                            {errors.ilce || ''}
                                        </div>
                                    </div>
                                </div>

                                {/* Mahalle */}
                                <div className="form-group">
                                    <label htmlFor="mahalle" className="form-label">
                                        Mahalle
                                        <span className="required">*</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <select
                                            id="mahalle"
                                            name="mahalle"
                                            className={`form-select ${errors.mahalle ? 'error' : ''}`}
                                            value={profileData.mahalle}
                                            onChange={handleProfileInputChange}
                                            disabled={loading || !profileData.ilce}
                                        >
                                            <option value="">Mahalle seçiniz</option>
                                            {profileData.ilce && neighborhoodsByDistrict[profileData.ilce] && 
                                                neighborhoodsByDistrict[profileData.ilce].map(neighborhood => (
                                                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="field-error">
                                        {errors.mahalle || ''}
                                    </div>
                                </div>

                                <div className="button-row">
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => navigate('/')}
                                        disabled={loading}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="loading-spinner"></div>
                                                Güncelleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <span>Profili Güncelle</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* About Tab Content */}
                    {activeTab === 'about' && (
                        <div className="edit-profile-form">
                            <div className="about-content">
                                <div className="about-section">
                                    <h3 className="about-title">Hakkımda</h3>
                                    <p className="about-description">
                                        Bu bölüm geliştirilme aşamasındadır. Yakında kişisel bilgilerinizi ve 
                                        deneyimlerinizi paylaşabileceğiniz bir alan burada yer alacaktır.
                                    </p>
                                </div>
                                
                                <div className="about-features">
                                    <div className="feature-item">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <h4>Kişisel Hikaye</h4>
                                            <p>Kendi hikayenizi ve deneyimlerinizi paylaşın</p>
                                        </div>
                                    </div>
                                    
                                    <div className="feature-item">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.7006C21.7033 16.047 20.9999 15.5904 20.2 15.405" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M16 3.13C16.8003 3.31462 17.5037 3.77096 18.0098 4.42459C18.5159 5.07823 18.8002 5.88868 18.8002 6.725C18.8002 7.56132 18.5159 8.37177 18.0098 9.02541C17.5037 9.67904 16.8003 10.1354 16 10.32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <h4>Sosyal Bağlantılar</h4>
                                            <p>Diğer üyelerle bağlantı kurun ve ağınızı genişletin</p>
                                        </div>
                                    </div>
                                    
                                    <div className="feature-item">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M21 21V19C21 16.7909 19.2091 15 17 15H1V19C1 21.2091 2.79086 23 5 23H17C19.2091 23 21 21.2091 21 19V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M16 3.13C16.8003 3.31462 17.5037 3.77096 18.0098 4.42459C18.5159 5.07823 18.8002 5.88868 18.8002 6.725C18.8002 7.56132 18.5159 8.37177 18.0098 9.02541C17.5037 9.67904 16.8003 10.1354 16 10.32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <h4>İlgi Alanları</h4>
                                            <p>İlgi alanlarınızı ve uzmanlık konularınızı belirtin</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Password Tab Content */}
                    {activeTab === 'password' && (
                        <div className="edit-profile-form">
                            <form onSubmit={handlePasswordSubmit}>
                                {/* Current Password */}
                                <div className="form-group">
                                    <label htmlFor="currentPassword" className="form-label">
                                        Mevcut Şifre
                                        <span className="required">*</span>
                                    </label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                            <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            id="currentPassword"
                                            name="currentPassword"
                                            className={`form-input ${errors.currentPassword || errors.current_password ? 'error' : ''}`}
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordInputChange}
                                            disabled={loading}
                                            placeholder="Mevcut şifrenizi giriniz"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? (
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
                                        {errors.currentPassword || errors.current_password || ''}
                                    </div>
                                </div>

                                {/* New Password Fields Row */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="newPassword" className="form-label">
                                            Yeni Şifre
                                            <span className="required">*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                id="newPassword"
                                                name="newPassword"
                                                className={`form-input ${errors.newPassword || errors.new_password ? 'error' : ''}`}
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordInputChange}
                                                disabled={loading}
                                                placeholder="Yeni şifrenizi giriniz"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? (
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
                                            {errors.newPassword || errors.new_password || ''}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword" className="form-label">
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
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                className={`form-input ${errors.confirmPassword || errors.confirm_password ? 'error' : ''}`}
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordInputChange}
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
                                            {errors.confirmPassword || errors.confirm_password || ''}
                                        </div>
                                    </div>
                                </div>

                                <div className="button-row">
                                    <button
                                        type="button"
                                        className="cancel-button"
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
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Temizle
                                    </button>
                                    <button
                                        type="submit"
                                        className="submit-button warning"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="loading-spinner"></div>
                                                Değiştiriliyor...
                                            </>
                                        ) : (
                                            <>
                                                <span>Şifreyi Değiştir</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
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
                    --warning-color: #f59e0b;
                    --warning-hover: #d97706;
                    --radius-sm: 8px;
                    --radius-lg: 16px;
                    --transition-fast: 150ms ease;
                    --transition-normal: 300ms ease;
                }

                .edit-profile-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
                }

                .edit-profile-container {
                    width: 100%;
                    max-width: 800px;
                }

                .edit-profile-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-lg);
                    padding: 3rem;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .edit-profile-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .edit-profile-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-accent) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .edit-profile-subtitle {
                    color: var(--text-muted);
                    font-size: 1rem;
                    margin: 0;
                }

                .tab-navigation {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--border-primary);
                }

                .tab-button {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    padding: 1rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    border-bottom: 2px solid transparent;
                    transition: all var(--transition-normal);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .tab-button:hover {
                    color: var(--text-primary);
                }

                .tab-button.active {
                    color: var(--primary-blue);
                    border-bottom-color: var(--primary-blue);
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

                .edit-profile-form {
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

                .button-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 2rem;
                    gap: 1rem;
                }

                .cancel-button, .submit-button {
                    padding: 1rem 1.5rem;
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
                    min-width: 150px;
                }

                .cancel-button {
                    background: rgba(148, 163, 184, 0.1);
                    color: var(--text-muted);
                    border: 1px solid var(--border-primary);
                }

                .cancel-button:hover:not(:disabled) {
                    background: rgba(148, 163, 184, 0.2);
                    color: var(--text-primary);
                }

                .submit-button {
                    background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
                    color: white;
                }

                .submit-button.warning {
                    background: linear-gradient(135deg, var(--warning-color) 0%, var(--warning-hover) 100%);
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px var(--shadow-blue);
                }

                .submit-button.warning:hover:not(:disabled) {
                    box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
                }

                .submit-button:disabled, .cancel-button:disabled {
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

                /* About Tab Styles */
                .about-content {
                    padding: 1rem 0;
                }

                .about-section {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .about-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                }

                .about-description {
                    color: var(--text-muted);
                    font-size: 1rem;
                    line-height: 1.6;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .about-features {
                    display: grid;
                    gap: 2rem;
                }

                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-sm);
                    transition: all var(--transition-normal);
                }

                .feature-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--border-accent);
                    transform: translateY(-2px);
                }

                .feature-item svg {
                    color: var(--primary-blue);
                    flex-shrink: 0;
                    margin-top: 0.25rem;
                }

                .feature-item h4 {
                    color: var(--text-primary);
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                }

                .feature-item p {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    line-height: 1.5;
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .edit-profile-card {
                        padding: 2rem 1.5rem;
                    }

                    .edit-profile-title {
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

                    .tab-navigation {
                        flex-direction: column;
                        gap: 0;
                    }

                    .tab-button {
                        padding: 0.75rem 1rem;
                        border-bottom: 1px solid var(--border-primary);
                        border-radius: 0;
                    }

                    .tab-button.active {
                        border-bottom-color: var(--primary-blue);
                        background: rgba(59, 130, 246, 0.1);
                    }

                    .button-row {
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .cancel-button, .submit-button {
                        width: 100%;
                    }
                }

                @media (max-width: 480px) {
                    .edit-profile-page {
                        padding: 1rem 0.5rem;
                    }

                    .edit-profile-card {
                        padding: 1.5rem 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;