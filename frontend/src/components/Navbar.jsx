import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Inline Icons for Navbar
const IconBriefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }

    // Paths where navbar might want to look different or be hidden
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* Brand / Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                                <IconBriefcase />
                            </div>
                            <span className="ml-3 text-2xl font-black text-gray-900 tracking-tighter">
                                Work<span className="text-indigo-600">opia</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`text-sm font-bold ${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'} transition`}>
                            Home
                        </Link>
                        {user && (
                            <>
                                <Link to="/dashboard" className={`text-sm font-bold ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'} transition`}>
                                    Overview
                                </Link>
                                {user.role_id === 1 && (
                                    <>
                                        <Link to="/admin/categories" className={`text-sm font-bold ${location.pathname.startsWith('/admin/categories') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'} transition`}>
                                            Categories
                                        </Link>
                                        <Link to="/admin/users" className={`text-sm font-bold ${location.pathname.startsWith('/admin/users') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'} transition`}>
                                            Users
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-indigo-600 transition"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                                >
                                    Join for Free
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                {/* Profile Dropdown Placeholder */}
                                <div className="hidden sm:flex flex-col items-end mr-2">
                                    <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                                    <span className={`mt-1 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-black 
                                        ${user.role_id === 1 ? 'bg-red-100 text-red-600' :
                                            user.role_id === 2 ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'}`}>
                                        {user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'Employer' : 'Candidate'}
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all active:scale-95"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar

