import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HakkimdaPage = () => {
    const navigate = useNavigate();
    const { user, updateProfile, isAuthenticated, loading: authLoading } = useAuth();

    const [activeTab, setActiveTab] = React.useState('about');
    const [isEditing, setIsEditing] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const [aboutData, setAboutData] = React.useState({
        meslegim: '',
        ilgi_alanlarim: '',
        yeteneklerim: '',
        hobilerim: ''
    });

    // Check authentication and redirect if not authenticated
    React.useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Load user's about data when user is loaded
    React.useEffect(() => {
        if (user) {
            setAboutData({
                meslegim: user.meslegim || '',
                ilgi_alanlarim: user.ilgi_alanlarim || '',
                yeteneklerim: user.yeteneklerim || '',
                hobilerim: user.hobilerim || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prev => ({
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

    const handleSave = async () => {
        setErrors({});
        setSuccessMessage('');
        setLoading(true);

        try {
            const result = await updateProfile(aboutData);

            if (result.success) {
                setSuccessMessage('Hakkımda bilgileriniz başarıyla güncellendi!');
                setIsEditing(false);
                setErrors({});

                // Refresh after a short delay
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    setErrors({ general: result.error || 'Bilgiler güncellenirken bir hata oluştu' });
                }
            }
        } catch (error) {
            console.error('About update error:', error);
            setErrors({ general: 'Beklenmeyen bir hata oluştu' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset to original user data
        if (user) {
            setAboutData({
                meslegim: user.meslegim || '',
                ilgi_alanlarim: user.ilgi_alanlarim || '',
                yeteneklerim: user.yeteneklerim || '',
                hobilerim: user.hobilerim || ''
            });
        }
        setIsEditing(false);
        setErrors({});
        setSuccessMessage('');
    };

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="hakkimda-page">
                <div className="hakkimda-container">
                    <div className="hakkimda-card">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Yükleniyor...</p>
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

                    .hakkimda-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem 1rem;
                        background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
                    }

                    .hakkimda-container {
                        width: 100%;
                        max-width: 800px;
                    }

                    .hakkimda-card {
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
        <div className="hakkimda-page">
            <div className="hakkimda-container">
                <div className="hakkimda-card">
                    <div className="hakkimda-header">
                        <h2 className="hakkimda-title">Hakkımda</h2>
                        <p className="hakkimda-subtitle">
                            Kişisel bilgilerim ve deneyimlerim
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="tab-navigation">
                        <button
                            className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('about');
                                setIsEditing(false);
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
                            Ben Kimim?
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('edit');
                                setIsEditing(true);
                                setErrors({});
                                setSuccessMessage('');
                            }}
                            type="button"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Düzenle
                        </button>
                    </div>

                    {/* General Error Message */}
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

                    <div className="hakkimda-content">
                        {/* Ben Kimim Tab Content */}
                        {activeTab === 'about' && (
                            <div className="about-tab-content">
                                <div className="about-sections">
                                    <div className="about-section">
                                        <div className="section-header">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <h3>Mesleğim</h3>
                                        </div>
                                        <div className="section-content">
                                            {aboutData.meslegim || 'Henüz belirtilmemiş'}
                                        </div>
                                    </div>

                                    <div className="about-section">
                                        <div className="section-header">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <h3>İlgi Alanlarım</h3>
                                        </div>
                                        <div className="section-content">
                                            {aboutData.ilgi_alanlarim || 'Henüz belirtilmemiş'}
                                        </div>
                                    </div>

                                    <div className="about-section">
                                        <div className="section-header">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <polygon points="12,2 15.09,8.26 22,9 17,14 18.18,21 12,17.77 5.82,21 7,14 2,9 8.91,8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <h3>Yeteneklerim</h3>
                                        </div>
                                        <div className="section-content">
                                            {aboutData.yeteneklerim || 'Henüz belirtilmemiş'}
                                        </div>
                                    </div>

                                    <div className="about-section">
                                        <div className="section-header">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 11H1L4 9L1 7H9L12 1L15 7H23L20 9L23 11H15L12 17L9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <h3>Hobilerim</h3>
                                        </div>
                                        <div className="section-content">
                                            {aboutData.hobilerim || 'Henüz belirtilmemiş'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Düzenle Tab Content */}
                        {activeTab === 'edit' && (
                            <div className="edit-tab-content">
                                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                    <div className="form-group">
                                        <label htmlFor="meslegim" className="form-label">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Mesleğim
                                        </label>
                                        <textarea
                                            id="meslegim"
                                            name="meslegim"
                                            className={`form-textarea ${errors.meslegim ? 'error' : ''}`}
                                            value={aboutData.meslegim}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="Mesleğinizi yazın..."
                                            rows="3"
                                        />
                                        <div className="field-error">
                                            {errors.meslegim || ''}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="ilgi_alanlarim" className="form-label">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            İlgi Alanlarım
                                        </label>
                                        <textarea
                                            id="ilgi_alanlarim"
                                            name="ilgi_alanlarim"
                                            className={`form-textarea ${errors.ilgi_alanlarim ? 'error' : ''}`}
                                            value={aboutData.ilgi_alanlarim}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="İlgi alanlarınızı yazın..."
                                            rows="3"
                                        />
                                        <div className="field-error">
                                            {errors.ilgi_alanlarim || ''}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="yeteneklerim" className="form-label">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <polygon points="12,2 15.09,8.26 22,9 17,14 18.18,21 12,17.77 5.82,21 7,14 2,9 8.91,8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Yeteneklerim
                                        </label>
                                        <textarea
                                            id="yeteneklerim"
                                            name="yeteneklerim"
                                            className={`form-textarea ${errors.yeteneklerim ? 'error' : ''}`}
                                            value={aboutData.yeteneklerim}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="Yeteneklerinizi yazın..."
                                            rows="3"
                                        />
                                        <div className="field-error">
                                            {errors.yeteneklerim || ''}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="hobilerim" className="form-label">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 11H1L4 9L1 7H9L12 1L15 7H23L20 9L23 11H15L12 17L9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Hobilerim
                                        </label>
                                        <textarea
                                            id="hobilerim"
                                            name="hobilerim"
                                            className={`form-textarea ${errors.hobilerim ? 'error' : ''}`}
                                            value={aboutData.hobilerim}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="Hobilerinizi yazın..."
                                            rows="3"
                                        />
                                        <div className="field-error">
                                            {errors.hobilerim || ''}
                                        </div>
                                    </div>

                                    <div className="action-buttons">
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={handleCancel}
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
                                            className="save-button"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="loading-spinner"></div>
                                                    Kaydediliyor...
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    Kaydet
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
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

                .hakkimda-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    padding-top: 120px;
                    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%);
                }

                .hakkimda-container {
                    width: 100%;
                    max-width: 900px;
                }

                .hakkimda-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-lg);
                    padding: 0;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                }

                .hakkimda-header {
                    text-align: center;
                    padding: 3rem 3rem 1rem;
                }

                .hakkimda-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-accent) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hakkimda-subtitle {
                    color: var(--text-muted);
                    font-size: 1.1rem;
                    margin: 0;
                }

                /* Tab Navigation */
                .tab-navigation {
                    display: flex;
                    background: rgba(255, 255, 255, 0.03);
                    border-bottom: 1px solid var(--border-primary);
                }

                .tab-button {
                    flex: 1;
                    padding: 1.5rem;
                    background: none;
                    border: none;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    position: relative;
                }

                .tab-button:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                }

                .tab-button.active {
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--primary-blue);
                }

                .tab-button.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: var(--primary-blue);
                }

                .hakkimda-content {
                    padding: 2rem 3rem 3rem;
                }

                /* Messages */
                .error-message,
                .success-message {
                    padding: 1rem 1.5rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                }

                .success-message {
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                /* About Tab Styles */
                .about-sections {
                    display: grid;
                    gap: 2rem;
                }

                .about-section {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-sm);
                    padding: 2rem;
                    border-left: 4px solid var(--primary-blue);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 1rem;
                }

                .section-header svg {
                    color: var(--primary-blue);
                    flex-shrink: 0;
                }

                .section-header h3 {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .section-content {
                    color: var(--text-muted);
                    font-size: 1rem;
                    line-height: 1.6;
                    padding-left: 36px;
                    white-space: pre-wrap;
                }

                /* Edit Tab Styles */
                .edit-tab-content {
                    max-width: 700px;
                    margin: 0 auto;
                }

                .form-group {
                    margin-bottom: 2rem;
                }

                .form-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                    font-size: 1rem;
                }

                .form-label svg {
                    color: var(--primary-blue);
                    flex-shrink: 0;
                }

                .form-textarea {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid var(--border-primary);
                    border-radius: var(--radius-sm);
                    font-size: 1rem;
                    line-height: 1.5;
                    resize: vertical;
                    min-height: 100px;
                    transition: all var(--transition-normal);
                    font-family: inherit;
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-primary);
                }

                .form-textarea::placeholder {
                    color: var(--text-muted);
                }

                .form-textarea:focus {
                    outline: none;
                    border-color: var(--primary-blue);
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .form-textarea.error {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
                }

                .form-textarea:disabled {
                    background-color: rgba(255, 255, 255, 0.01);
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                .field-error {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 5px;
                    min-height: 20px;
                }

                /* Action Buttons */
                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-primary);
                }

                .back-button,
                .edit-button,
                .cancel-button,
                .save-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 1rem 1.5rem;
                    border: none;
                    border-radius: var(--radius-sm);
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    text-decoration: none;
                    min-width: 150px;
                    justify-content: center;
                }

                .back-button,
                .cancel-button {
                    background: rgba(148, 163, 184, 0.1);
                    color: var(--text-muted);
                    border: 1px solid var(--border-primary);
                }

                .back-button:hover,
                .cancel-button:hover {
                    background: rgba(148, 163, 184, 0.2);
                    color: var(--text-primary);
                    transform: translateY(-1px);
                }

                .edit-button,
                .save-button {
                    background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
                    color: white;
                }

                .edit-button:hover,
                .save-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px var(--shadow-blue);
                }

                .save-button:disabled,
                .cancel-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .hakkimda-page {
                        padding: 1rem;
                        padding-top: 100px;
                    }

                    .hakkimda-header {
                        padding: 2rem 2rem 1rem;
                    }

                    .hakkimda-title {
                        font-size: 2rem;
                    }

                    .hakkimda-content {
                        padding: 2rem;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .back-button,
                    .edit-button,
                    .cancel-button,
                    .save-button {
                        justify-content: center;
                    }

                    .section-content {
                        padding-left: 0;
                    }
                    
                    .section-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                }

                @media (max-width: 480px) {
                    .hakkimda-header {
                        padding: 1.5rem 1rem 1rem;
                    }

                    .hakkimda-content {
                        padding: 1.5rem 1rem 2rem;
                    }

                    .hakkimda-title {
                        font-size: 1.75rem;
                    }
                    
                    .tab-button {
                        padding: 1rem 0.5rem;
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default HakkimdaPage;