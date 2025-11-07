import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ user, logout }) {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
                <div className="navbar-content">
                    {/* Logo */}
                    <NavLink to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        <span className="logo-text">HareketPlatform</span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    {user && (
                        <ul className="nav-links desktop-nav">
                            <li>
                                <NavLink
                                    to="/sahadan-haberler"
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                                    }
                                >
                                    SaHa'dan Haberler
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/uyelerden-haberler"
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                                    }
                                >
                                    Üyelerden Haberler
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/makaleler"
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                                    }
                                >
                                    Makaleler
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/map"
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                                    }
                                >
                                    Harita
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? 'nav-link-active' : ''}`
                                    }
                                >
                                    Profilim
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="nav-button nav-button-secondary"
                                >
                                    Çıkış Yap
                                </button>
                            </li>
                        </ul>
                    )}

                    {/* Mobile Menu Toggle */}
                    {user && (
                        <button
                            className="mobile-menu-toggle"
                            onClick={toggleMobileMenu}
                            aria-label="Menüyü aç/kapat"
                        >
                            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                        </button>
                    )}
                </div>

                {/* Mobile Navigation */}
                {user && (
                    <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
                        <ul className="mobile-nav-links">
                            <li>
                                <NavLink
                                    to="/sahadan-haberler"
                                    className={({ isActive }) =>
                                        `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    SaHa'dan Haberler
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/uyelerden-haberler"
                                    className={({ isActive }) =>
                                        `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    Üyelerden Haberler
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/makaleler"
                                    className={({ isActive }) =>
                                        `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    Makaleler
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/map"
                                    className={({ isActive }) =>
                                        `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    Harita
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    Profilim
                                </NavLink>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="mobile-nav-button mobile-nav-button-secondary"
                                >
                                    Çıkış Yap
                                </button>
                            </li>
                        </ul>
                    </div>
                )}

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="mobile-menu-overlay"
                        onClick={closeMobileMenu}
                    ></div>
                )}
            </nav>

            <style jsx>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: rgba(15, 20, 25, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--border-primary, rgba(255, 255, 255, 0.1));
                    z-index: 1000;
                    transition: all 0.3s ease;
                    height: 80px;
                    min-height: 80px;
                    max-height: 80px;
                    display: flex;
                    align-items: center;
                }

                .navbar-scrolled {
                    background: rgba(15, 20, 25, 0.98);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }

                .navbar-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 80px;
                    min-height: 80px;
                }

                .navbar-logo {
                    text-decoration: none;
                    color: #ffffff;
                    font-size: 1.5rem;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    height: 80px;
                    line-height: 80px;
                }

                .navbar-logo:hover {
                    color: #60a5fa;
                    text-decoration: none;
                }

                .logo-text {
                    background: linear-gradient(135deg, #ffffff 0%, #60a5fa 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .desktop-nav {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    height: 80px;
                }

                .desktop-nav > li {
                    display: flex;
                    align-items: center;
                }

                .nav-link {
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    min-height: 40px;
                }

                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-1px);
                    text-decoration: none;
                    color: #ffffff;
                }

                .nav-link-active {
                    background: rgba(37, 99, 235, 0.2);
                    color: #60a5fa;
                }

                .nav-link-active::after {
                    content: '';
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60%;
                    height: 2px;
                    background: #2563eb;
                    border-radius: 1px;
                }

                .nav-button {
                    padding: 0.5rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    min-height: 40px;
                }

                .nav-button-primary {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                }

                .nav-button-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
                }

                .nav-button-secondary {
                    background: transparent;
                    color: #ffffff;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }

                .nav-button-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }

                /* Mobile Menu Styles */
                .mobile-menu-toggle {
                    display: none;
                    flex-direction: column;
                    justify-content: space-around;
                    width: 24px;
                    height: 20px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                }

                .hamburger-line {
                    width: 100%;
                    height: 2px;
                    background: #ffffff;
                    transition: all 0.3s ease;
                    transform-origin: center;
                }

                .hamburger-line.open:nth-child(1) {
                    transform: rotate(45deg) translateY(6px);
                }

                .hamburger-line.open:nth-child(2) {
                    opacity: 0;
                }

                .hamburger-line.open:nth-child(3) {
                    transform: rotate(-45deg) translateY(-6px);
                }

                .mobile-nav {
                    position: fixed;
                    top: 80px;
                    left: 0;
                    right: 0;
                    background: rgba(15, 20, 25, 0.98);
                    backdrop-filter: blur(10px);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    z-index: 999;
                }

                .mobile-nav-open {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }

                .mobile-nav-links {
                    list-style: none;
                    margin: 0;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .mobile-nav-link {
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 1rem;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .mobile-nav-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                    text-decoration: none;
                    color: #ffffff;
                }

                .mobile-nav-link-active {
                    background: rgba(37, 99, 235, 0.2);
                    color: #60a5fa;
                }

                .mobile-nav-button {
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    width: 100%;
                }

                .mobile-nav-button-primary {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                }

                .mobile-nav-button-secondary {
                    background: transparent;
                    color: #ffffff;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }

                .mobile-menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 998;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .navbar-content {
                        padding: 0 1rem;
                    }

                    .desktop-nav {
                        display: none;
                    }

                    .mobile-menu-toggle {
                        display: flex;
                    }
                }

                @media (max-width: 480px) {
                    .navbar-logo {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </>
    );
}