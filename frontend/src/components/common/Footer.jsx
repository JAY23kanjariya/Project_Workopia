import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Logo */}
                <Link to="/" className="text-lg font-semibold text-white">
                    Workopia
                </Link>

                {/* Links */}
                <div className="flex gap-6 text-sm">
                    <Link to="/privacy" className="hover:text-white transition">
                        Privacy
                    </Link>
                    <Link to="/terms" className="hover:text-white transition">
                        Terms
                    </Link>
                </div>

                {/* Copyright */}
                <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Workopia
                </p>
            </div>
        </footer>
    );
}