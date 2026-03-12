import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../auth/AuthContext'

// Inline Icons
const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

function HomePage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 bg-gray-50">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-primary-dark uppercase bg-accent rounded-full border border-primary/10 shadow-sm">
                            Next Generation Job Platform
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tighter mb-8">
                            Empowering Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Future Career</span> Journey
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                            Connect with industry leaders and discover opportunities that align with your passion and expertise. Workopia is where talent meets purpose.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate("/register")}
                                className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all active:scale-95"
                            >
                                Get Started Now
                            </button>
                            <button
                                onClick={() => navigate("/jobs")}
                                className="w-full sm:w-auto px-10 py-4 bg-white text-gray-900 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                Browse Jobs
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-16 pt-12 border-t border-gray-100 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company) => (
                                <span key={company} className="text-xl font-bold text-gray-400 tracking-tighter uppercase">{company}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 hover:shadow-xl transition-all duration-500 group">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <span className="text-2xl text-white">🚀</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Fast Hiring</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our intelligent matching algorithm connects you with relevant opportunities in record time.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-secondary/5 border border-secondary/10 hover:shadow-xl transition-all duration-500 group">
                            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <span className="text-2xl text-white">💎</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Top Quality</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We curate high-impact roles from verified companies ranging from startups to global tech giants.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 hover:shadow-xl transition-all duration-500 group">
                            <div className="w-14 h-14 bg-primary-dark rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <span className="text-2xl text-white">🌍</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Global Reach</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Explore remote and on-site opportunities across the globe with transparent salary data.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Split CTA Section */}
            <section className="py-20 bg-gray-900 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                                Ready to build your <br /><span className="text-secondary">dream team?</span>
                            </h2>
                            <ul className="space-y-4 mb-10">
                                {['Post unlimited jobs', 'Access elite talent pool', 'Advanced screening tools'].map((item) => (
                                    <li key={item} className="flex items-center text-gray-400 font-medium">
                                        <div className="mr-3 bg-primary p-1 rounded-full"><IconCheck /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => navigate("/register")}
                                className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all active:scale-95 shadow-xl shadow-primary-dark/40"
                            >
                                For Employers
                            </button>
                        </div>
                        <div className="bg-primary rounded-3xl p-10 md:p-16 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 transition-transform duration-500 group-hover:scale-110">
                                <span className="text-9xl opacity-10">💼</span>
                            </div>
                            <h2 className="text-4xl font-black text-white mb-6 relative z-10">Looking for a new role?</h2>
                            <p className="text-white/80 text-lg mb-10 relative z-10">
                                Create your profile today and let companies find you. Thousands of active recruiters are waiting.
                            </p>
                            <button
                                onClick={() => navigate("/register")}
                                className="px-8 py-4 bg-accent text-primary-dark font-black rounded-2xl hover:bg-white transition-all active:scale-95 relative z-10"
                            >
                                Create Candidate Profile
                            </button>
                        </div>
                    </div>
                </div>
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/50 rounded-full blur-[160px]"></div>
                </div>
            </section>
        </div>
    );
}

export default HomePage




