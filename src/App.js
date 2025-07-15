import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import EditProfilePage from "./pages/EditProfilePage";
import { useAuth } from "./AuthContext";

export default function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                {isAuthenticated && <Route path="/map" element={<MapPage />} />}
                {isAuthenticated && <Route path="/edit-profile" element={<EditProfilePage />} />}
                {/* fallback to HomePage if not found */}
                <Route path="*" element={<HomePage />} />
            </Routes>
        </Router>
    );
}
