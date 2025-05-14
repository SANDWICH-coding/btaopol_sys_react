import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden flex bg-gray-100">
            {/* Sidebar remains fixed */}
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            {/* Main area scrolls including header */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <Header setSidebarOpen={setSidebarOpen} />
                    <main className="p-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}



export default DashboardLayout;
