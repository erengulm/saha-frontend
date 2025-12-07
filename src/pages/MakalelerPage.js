import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

export default function MakalelerPage() {
    const [articles, setArticles] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [expandedArticle, setExpandedArticle] = useState(null);

    // Fetch current user profile
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('/api/user/profile/');
                setCurrentUser(response.data);
                setIsAdmin(response.data.role === 'admin' || response.data.role === 'superadmin');
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
            }
        };
        fetchCurrentUser();
    }, []);

    // Fetch articles
    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/articles/');
            setArticles(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch articles:', err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Bilinmeyen hata';
            setError(`Makaleler yüklenirken bir hata oluştu: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    // Submit new article (admin only)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newTitle.trim() || !newContent.trim()) {
            alert('Lütfen başlık ve içerik girin.');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.post('/api/articles/', {
                title: newTitle,
                content: newContent
            });
            
            setArticles([response.data, ...articles]);
            setNewTitle('');
            setNewContent('');
            setError(null);
        } catch (err) {
            console.error('Failed to submit article:', err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Bilinmeyen hata';
            setError(`Makale gönderilirken bir hata oluştu: ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete an article (admin only)
    const handleDelete = async (articleId) => {
        if (!window.confirm('Bu makaleyi silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            await axios.delete(`/api/articles/${articleId}/`);
            setArticles(articles.filter(item => item.id !== articleId));
            setError(null);
        } catch (err) {
            console.error('Failed to delete article:', err);
            setError('Makale silinirken bir hata oluştu.');
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Toggle article expansion
    const toggleArticle = (articleId) => {
        setExpandedArticle(expandedArticle === articleId ? null : articleId);
    };

    return (
        <div className="makaleler-page" style={{ 
            minHeight: '100vh',
            paddingTop: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
                    Makaleler
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

                {/* Article Form - Only for admins */}
                {isAdmin && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Makale başlığı..."
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box',
                                    marginBottom: '1rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#764ba2'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Makale içeriği..."
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
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
                                onFocus={(e) => e.target.style.borderColor = '#764ba2'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !newTitle.trim() || !newContent.trim()}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.75rem 2rem',
                                    background: submitting || !newTitle.trim() || !newContent.trim() ? '#ccc' : '#764ba2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: submitting || !newTitle.trim() || !newContent.trim() ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s',
                                    width: '100%'
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting && newTitle.trim() && newContent.trim()) {
                                        e.target.style.background = '#5f3d8a';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!submitting && newTitle.trim() && newContent.trim()) {
                                        e.target.style.background = '#764ba2';
                                    }
                                }}
                            >
                                {submitting ? 'Gönderiliyor...' : 'Yayınla'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Articles List */}
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        padding: '2rem'
                    }}>
                        Makaleler yükleniyor...
                    </div>
                ) : articles.length === 0 ? (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#666'
                    }}>
                        Henüz makale yayınlanmamış.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {articles.map((item) => (
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
                                    <div style={{ flex: 1 }}>
                                        <h2 
                                            onClick={() => toggleArticle(item.id)}
                                            style={{
                                                margin: '0',
                                                color: '#764ba2',
                                                fontSize: '1.5rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = '#5f3d8a'}
                                            onMouseLeave={(e) => e.target.style.color = '#764ba2'}
                                        >
                                            {item.title}
                                        </h2>
                                        <p style={{
                                            margin: '0.5rem 0 0 0',
                                            color: '#999',
                                            fontSize: '0.875rem'
                                        }}>
                                            {item.author_name} • {formatDate(item.created_at)}
                                        </p>
                                    </div>
                                    {isAdmin && (
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
                                    wordBreak: 'break-word',
                                    maxHeight: expandedArticle === item.id ? 'none' : '100px',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    {item.content}
                                </p>
                                {item.content.length > 200 && (
                                    <button
                                        onClick={() => toggleArticle(item.id)}
                                        style={{
                                            marginTop: '1rem',
                                            padding: '0.5rem 1rem',
                                            background: 'transparent',
                                            color: '#764ba2',
                                            border: '2px solid #764ba2',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#764ba2';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#764ba2';
                                        }}
                                    >
                                        {expandedArticle === item.id ? 'Daha Az Göster' : 'Devamını Oku'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}