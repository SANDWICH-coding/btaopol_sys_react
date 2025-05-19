import { Link, useLocation } from "react-router-dom";
import { FiBook, FiUsers } from "react-icons/fi";

function Sidebar({ open, setOpen }) {
    const location = useLocation();

    const navItems = [
        { path: "/school", label: "School", icon: <FiBook /> },
        { path: "/student", label: "Student", icon: <FiUsers /> },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 z-10 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed overflow-y-auto lg:static top-0 left-0 h-full lg:h-auto lg:min-h-screen w-64 z-20 transform ${open ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white border-r shadow-lg`}
            >
                {/* Branding */}
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">BTA of Opol</h2>
                </div>

                {/* Nav */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition 
                  ${isActive
                                        ? "bg-blue-600 text-white shadow"
                                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;
