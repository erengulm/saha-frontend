import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { isAuthenticated, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate("/map");
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const activeStyle = {
        fontWeight: "bold",
        color: "darkblue",
    };

    return (
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
            <NavLink to="/" end style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                Ana Sayfa
            </NavLink>{" | "}

            {isAuthenticated ? (
                <>
                    <NavLink to="/map" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                        Harita
                    </NavLink>{" | "}
                    <NavLink to="/edit-profile" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                        Profili Düzenle
                    </NavLink>{" | "}
                    <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
                        Çıkış Yap
                    </button>
                </>
            ) : (
                <button onClick={handleLogin} style={{ marginLeft: "1rem" }}>
                    Giriş Yap
                </button>
            )}
        </nav>
    );
}