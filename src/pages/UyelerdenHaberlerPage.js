import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

export default function UyelerdenHaberlerPage() {
    const [news, setNews] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch current user profile
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('/api/user/profile/');
                setCurrentUser(response.data);
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
            }
        };
        fetchCurrentUser();
    }, []);

    // Fetch news feed
    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/news/');
            console.log('News fetched successfully:', response.data);
            setNews(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch news:', err);
            console.error('Error status:', err.response?.status);
            console.error('Error data:', err.response?.data);
            console.error('Error message:', err.message);
            const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Bilinmeyen hata';
            setError(`Haberler yüklenirken bir hata oluştu: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // Submit new post
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newPost.trim()) {
            alert('Lütfen bir içerik girin.');
            return;
        }

        try {
            setSubmitting(true);
            console.log('Submitting post:', { content: newPost });
            const response = await axios.post('/api/news/', {
                content: newPost
            });
            console.log('Post submitted successfully:', response.data);
            
            // Add new post to the beginning of the list
            setNews([response.data, ...news]);
            setNewPost('');
            setError(null);
        } catch (err) {
            console.error('Failed to submit post:', err);
            console.error('Error status:', err.response?.status);
            console.error('Error data:', err.response?.data);
            console.error('Error message:', err.message);
            const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Bilinmeyen hata';
            setError(`Haber gönderilirken bir hata oluştu: ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete a post
    const handleDelete = async (newsId) => {
        if (!window.confirm('Bu haberi silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            await axios.delete(`/api/news/${newsId}/`);
            setNews(news.filter(item => item.id !== newsId));
            setError(null);
        } catch (err) {
            console.error('Failed to delete post:', err);
            setError('Haber silinirken bir hata oluştu.');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Az önce';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} dakika önce`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} saat önce`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} gün önce`;
        } else {
            return date.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    return (
        <div className="uyelerden-haberler-page" style={{ 
            minHeight: '100vh',
            paddingTop: '80px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #475569 100%)'
        }}>
            <div className="page-container" style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                <h1 style={{
                    color: 'white',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}>
                    Üyelerden Haberler
                </h1>

                {error && (
                    <div style={{
                        background: '#fee',
                        color: '#c33',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* Post Form */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Ne paylaşmak istersiniz?"
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '1rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newPost.trim()}
                            style={{
                                marginTop: '1rem',
                                padding: '0.75rem 2rem',
                                background: submitting || !newPost.trim() ? '#ccc' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: submitting || !newPost.trim() ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                                width: '100%'
                            }}
                            onMouseEnter={(e) => {
                                if (!submitting && newPost.trim()) {
                                    e.target.style.background = '#2563eb';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!submitting && newPost.trim()) {
                                    e.target.style.background = '#3b82f6';
                                }
                            }}
                        >
                            {submitting ? 'Gönderiliyor...' : 'Paylaş'}
                        </button>
                    </form>
                </div>

                {/* News Feed */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        padding: '2rem'
                    }}>
                        Haberler yükleniyor...
                    </div>
                ) : news.length === 0 ? (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#666'
                    }}>
                        Henüz haber paylaşılmamış. İlk paylaşımı siz yapın!
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {news.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <h3 style={{
                                            margin: '0',
                                            color: '#3b82f6',
                                            fontSize: '1.1rem',
                                            fontWeight: '600'
                                        }}>
                                            {item.author_name}
                                        </h3>
                                        <p style={{
                                            margin: '0.25rem 0 0 0',
                                            color: '#999',
                                            fontSize: '0.875rem'
                                        }}>
                                            {formatDate(item.created_at)}
                                        </p>
                                    </div>
                                    {currentUser && (currentUser.id === item.author || currentUser.role !== 'member') && (
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#c33',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#fee'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                            title="Sil"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                                <p style={{
                                    margin: '0',
                                    color: '#333',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}