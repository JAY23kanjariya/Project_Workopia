import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="text-center max-w-xl">

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Welcome to <span className="text-primary">Workopia</span>
                </h1>

                {/* Subtitle */}
                <p className="text-gray-600 mb-8">
                    A simple platform to manage jobs, applications, and hiring.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition"
                    >
                        Sign Up
                    </button>
                </div>

            </div>
        </div>
    );
}

export default HomePage;