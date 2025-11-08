import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HakkimdaPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // Check authentication and redirect if not authenticated
    React.useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, authLoading, navigate]);

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

                    <div className="hakkimda-content">
                        <div className="about-section">
                            <h3 className="about-title">Kişisel Bilgiler</h3>
                            <div className="user-info">
                                <div className="info-item">
                                    <span className="info-label">Ad Soyad:</span>
                                    <span className="info-value">{user?.first_name} {user?.last_name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">E-posta:</span>
                                    <span className="info-value">{user?.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Telefon:</span>
                                    <span className="info-value">{user?.phone || 'Belirtilmemiş'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Şehir:</span>
                                    <span className="info-value">{user?.city || 'Belirtilmemiş'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">İlçe:</span>
                                    <span className="info-value">{user?.ilce || 'Belirtilmemiş'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Mahalle:</span>
                                    <span className="info-value">{user?.mahalle || 'Belirtilmemiş'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Finansal Kod:</span>
                                    <span className="info-value">{user?.finansal_kod_numarasi || 'Belirtilmemiş'}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Rol:</span>
                                    <span className="info-value">{user?.role_display || user?.role}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="about-features">
                            <div className="feature-item">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <div>
                                    <h4>Kişisel Hikaye</h4>
                                    <p>Bu bölüm geliştirilme aşamasındadır. Yakında kendi hikayenizi ve deneyimlerinizi paylaşabileceğiniz bir alan burada yer alacaktır.</p>
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
                                    <p>Diğer üyelerle bağlantı kurun ve ağınızı genişletin. Ortak ilgi alanlarınızı keşfedin.</p>
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
                                    <p>İlgi alanlarınızı ve uzmanlık konularınızı belirtin. Benzer ilgi alanlarına sahip kişileri bulun.</p>
                                </div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button
                                className="back-button"
                                onClick={() => navigate(-1)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Geri Dön
                            </button>
                            <button
                                className="edit-button"
                                onClick={() => navigate('/')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Profili Düzenle
                            </button>
                        </div>
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
                    padding: 3rem;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }

                .hakkimda-header {
                    text-align: center;
                    margin-bottom: 3rem;
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

                .hakkimda-content {
                    display: grid;
                    gap: 3rem;
                }

                .about-section {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-sm);
                    padding: 2rem;
                }

                .about-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 1.5rem;
                    text-align: center;
                }

                .user-info {
                    display: grid;
                    gap: 1rem;
                }

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--border-primary);
                    border-radius: var(--radius-sm);
                    transition: all var(--transition-normal);
                }

                .info-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--border-accent);
                    transform: translateY(-1px);
                }

                .info-label {
                    font-weight: 600;
                    color: var(--text-muted);
                    min-width: 120px;
                }

                .info-value {
                    color: var(--text-primary);
                    font-weight: 500;
                    text-align: right;
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

                .action-buttons {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-primary);
                }

                .back-button, .edit-button {
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

                .back-button {
                    background: rgba(148, 163, 184, 0.1);
                    color: var(--text-muted);
                    border: 1px solid var(--border-primary);
                }

                .back-button:hover {
                    background: rgba(148, 163, 184, 0.2);
                    color: var(--text-primary);
                    transform: translateY(-1px);
                }

                .edit-button {
                    background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
                    color: white;
                }

                .edit-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px var(--shadow-blue);
                }

                @media (max-width: 768px) {
                    .hakkimda-page {
                        padding: 1rem;
                        padding-top: 100px;
                    }

                    .hakkimda-card {
                        padding: 2rem 1.5rem;
                    }

                    .hakkimda-title {
                        font-size: 2rem;
                    }

                    .info-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }

                    .info-label {
                        min-width: auto;
                    }

                    .info-value {
                        text-align: left;
                    }

                    .action-buttons {
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .back-button, .edit-button {
                        width: 100%;
                    }
                }

                @media (max-width: 480px) {
                    .hakkimda-card {
                        padding: 1.5rem 1rem;
                    }

                    .hakkimda-title {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default HakkimdaPage;