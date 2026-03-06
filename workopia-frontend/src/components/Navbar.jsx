import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Work<span>opia</span>
                </Link>

                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/job-posts">Browse Jobs</Link></li>
                    {user ? (
                        <>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li className="user-info">
                                <span>Welcome, <strong>{user.name}</strong></span>
                                <button onClick={handleLogout} className="logout-btn">Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register" className="nav-register-btn">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
