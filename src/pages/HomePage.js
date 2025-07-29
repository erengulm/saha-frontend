import React from 'react';

export default function HomePage() {
    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero-section" style={{
                alignItems: 'center',
                paddingBottom: '80px'
            }}>
                <div className="hero-content">
                    <h1 className="hero-title animate-fade-in">
                        Sa-Ha
                    </h1>
                    <p className="hero-subtitle animate-fade-in">
                        İnternet sayfamıza hoşgeldiniz!
                    </p>
                    <div className="hero-description animate-fade-in">
                        <p>
                            Türkiye'nin geleceği için bir araya geliyoruz. Değişimin öncüsü olmaya hazır mısınız?
                        </p>
                    </div>
                    <div className="hero-buttons animate-fade-in">
                        <button className="btn-primary">
                            Hemen Katıl
                        </button>
                        <button className="btn-secondary">
                            Daha Fazla Bilgi
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="content-section">
                <h2 className="section-title">Platformumuz</h2>
                <div className="card-grid">
                    <div className="card animate-fade-in">
                        <div className="card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Üye Ağı</h3>
                        <p className="card-content">
                            Bu siteden profilinize giriş yapabilir ve Türkiye'nin farklı noktalarındaki
                            üyelerimizi görüntüleyebilirsiniz.
                        </p>
                    </div>

                    <div className="card animate-fade-in">
                        <div className="card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Vizyonumuz</h3>
                        <p className="card-content">
                            Türkiye'nin demokratik geleceğini şekillendirmek ve her vatandaşın
                            sesinin duyulduğu bir toplum inşa etmek.
                        </p>
                    </div>

                    <div className="card animate-fade-in">
                        <div className="card-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 14C19.5523 14 20 13.5523 20 13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13C18 13.5523 18.4477 14 19 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 14C5.55228 14 6 13.5523 6 13C6 12.4477 5.55228 12 5 12C4.44772 12 4 12.4477 4 13C4 13.5523 4.44772 14 5 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 14C5 14 9 16 12 16S19 14 19 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 16V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="card-title">Misyonumuz</h3>
                        <p className="card-content">
                            Teknoloji ve katılımcı demokrasiyi birleştirerek şeffaf, hesap verebilir
                            ve adil bir yönetim anlayışı geliştirmek.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="quote-section animate-fade-in">
                <blockquote className="quote-text">
                    "Demokrasi, halkın halk tarafından halk için yönetimi demektir.
                    Bu platformda her ses değerlidir, her görüş saygıyla karşılanır."
                </blockquote>
                <cite className="quote-author">- Sa-Ha Hareketi</cite>
            </section>

            {/* Call to Action Section */}
            <section className="content-section">
                <h2 className="section-title">Harekete Geç</h2>
                <div className="section-content">
                    <p>
                        Değişimin bir parçası ol. Türkiye'nin geleceğini birlikte şekillendirelim.
                        Bugün aramıza katıl ve sesini duyur.
                    </p>
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button className="btn-primary" style={{ marginRight: '1rem' }}>
                            Üye Ol
                        </button>
                        <button className="btn-secondary">
                            İletişime Geç
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}