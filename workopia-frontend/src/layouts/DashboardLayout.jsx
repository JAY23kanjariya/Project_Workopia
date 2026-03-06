import { useContext } from "react";
import { Navigate, Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <div className="dashboard-container-main">
                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li><Link to="/dashboard">Overview</Link></li>
                            {user?.role_id === 2 && (
                                <>
                                    <li><Link to="/employer/my-jobs">My Jobs</Link></li>
                                    <li><Link to="/employer/post-job">Post a Job</Link></li>
                                </>
                            )}
                            {user?.role_id === 3 && (
                                <li><Link to="/candidate/my-applications">My Applications</Link></li>
                            )}
                            {user?.role_id === 1 && (
                                <li><Link to="/admin/categories">Categories</Link></li>
                            )}
                        </ul>
                    </nav>
                </aside>
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
