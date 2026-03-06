import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
    return (
        <div className="public-layout">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Workopia. All rights reserved.</p>
            </footer>
        </div>
    );
}
