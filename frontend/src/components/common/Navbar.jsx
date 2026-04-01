import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const linkClass = (path) =>
        `text-sm font-semibold transition ${location.pathname.startsWith(path)
            ? "text-primary"
            : "text-gray-500 hover:text-gray-900"
        }`;

    return (
        <nav className="sticky top-0 z-50 bg-blue-100 border-b border-blue-200 shadow-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold text-gray-900">
                        Work<span className="text-primary">opia</span>
                    </Link>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center gap-6">

                        {/* Admin */}
                        {user?.role_id === 1 && (
                            <>
                                <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                                    Dashboard
                                </Link>
                                <Link to="/admin/categories" className={linkClass("/admin/categories")}>
                                    Categories
                                </Link>
                                <Link to="/admin/users" className={linkClass("/admin/users")}>
                                    Users
                                </Link>
                                <Link to="/admin/jobs" className={linkClass("/admin/jobs")}>
                                    Jobs
                                </Link>
                            </>
                        )}

                        {/* Employer */}
                        {user?.role_id === 2 && (
                            <>
                                <Link to="/employer/dashboard" className={linkClass("/employer/dashboard")}>
                                    Dashboard
                                </Link>
                                <Link to="/employer/jobs" className={linkClass("/employer/jobs")}>
                                    Jobs
                                </Link>
                                <Link to="/employer/applications" className={linkClass("/employer/applications")}>
                                    Applications
                                </Link>
                            </>
                        )}

                        {/* Candidate */}
                        {user?.role_id === 3 && (
                            <>
                                <Link to="/candidate/dashboard" className={linkClass("/candidate/dashboard")}>
                                    Dashboard
                                </Link>
                                <Link to="/candidate/my-applications" className={linkClass("/candidate/my-applications")}>
                                    My Applications
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* User Info */}
                                <div className="hidden sm:flex flex-col items-end">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {user.name}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {user.role_id === 1
                                            ? "Admin"
                                            : user.role_id === 2
                                                ? "Employer"
                                                : "Candidate"}
                                    </span>
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;