import React from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";


function Header({ setSidebarOpen }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Mapping routes to titles
    const routeTitles = {
        "/dashboard": "Dashboard",
        "/school": "School Configuration",
        "/student": "Student Management",
        // Add more routes as needed
    };

    const currentTitle = routeTitles[location.pathname] || "Dashboard";

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            localStorage.removeItem("token");
            toast.info("Logout.");
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed.");
        }
    };

    return (
        <header className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
            {/* Sidebar Toggle (mobile only) */}
            <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="lg:hidden text-2xl text-gray-700"
            >
                ☰
            </button>

            <h1 className="text-xl font-semibold text-gray-700">
                {currentTitle}
            </h1>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-gray-700 transition"
                title="Logout"
            >
                <FiLogOut className="w-5 h-5" />
            </button>

        </header>
    );
}

export default Header;
