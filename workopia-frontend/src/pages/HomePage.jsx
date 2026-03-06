import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Find Your <span>Dream Job</span> Today
                    </h1>
                    <p className="hero-subtitle">
                        Connecting the best talent with top companies. Explore thousands of opportunities catering to your expertise.
                    </p>
                    <div className="hero-actions">
                        <button onClick={() => navigate("/job-posts")} className="btn-primary-large">
                            Browse Jobs
                        </button>
                        {!user && (
                            <button onClick={() => navigate("/register")} className="btn-secondary-large">
                                Post a Job
                            </button>
                        )}
                    </div>
                </div>
                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-value">12k+</span>
                        <span className="stat-label">Active Jobs</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">450+</span>
                        <span className="stat-label">Companies</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">8k+</span>
                        <span className="stat-label">Hired</span>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon candidate-icon">👨‍💻</div>
                    <h3>For Candidates</h3>
                    <p>Build your profile, upload your resume, and apply to jobs with a single click. Track your applications in real-time.</p>
                    <button onClick={() => navigate("/register")} className="btn-text">Start Applying →</button>
                </div>
                <div className="feature-card">
                    <div className="feature-icon employer-icon">🏢</div>
                    <h3>For Employers</h3>
                    <p>Reach qualified talent easily. Post job openings, manage applications, and hire the best fit for your team.</p>
                    <button onClick={() => navigate("/register")} className="btn-text">Hire Talent →</button>
                </div>
            </section>

            {/* Call to Action */}
            {!user && (
                <section className="cta-banner">
                    <h2>Ready to take the next step?</h2>
                    <p>Join thousands of professionals and companies on Workopia.</p>
                    <div className="cta-btns">
                        <button onClick={() => navigate("/register")} className="btn-white">Create Account</button>
                    </div>
                </section>
            )}
        </div>
    );
}
