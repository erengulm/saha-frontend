import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

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
                Home
            </NavLink>{" | "}

            {isAuthenticated ? (
                <>
                    <NavLink to="/map" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                        Map
                    </NavLink>{" | "}
                    <NavLink to="/edit-profile" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
                        Edit Profile
                    </NavLink>{" | "}
                    <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
                        Logout
                    </button>
                </>
            ) : (
                <button onClick={handleLogin} style={{ marginLeft: "1rem" }}>
                    Login
                </button>
            )}
        </nav>
    );
}
