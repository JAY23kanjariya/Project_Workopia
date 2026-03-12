import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../auth/AuthContext"
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

// Inline Icons for Employer Dashboard
const IconBriefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

const IconFileText = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

function EmployerDashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployerStats = async () => {
            try {
                const response = await api.get("/employer/dashboard");
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching employer dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployerStats();
    }, []);

    if (loading) {
        return <Loader text="Loading Portfolio..." />;
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                            Employer Portal
                        </span>
                        <h2 className="text-4xl font-black text-gray-900 leading-tight">
                            Dashboard Overview
                        </h2>
                        <p className="text-gray-500 font-medium mt-1">
                            Welcome back, <span className="text-gray-900">{user?.name}</span>. Manage your listings and applicants.
                        </p>
                    </div>

                    <Link
                        to="/employer/jobs/create"
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 group"
                    >
                        <IconPlus />
                        Post a New Job
                    </Link>
                </div>

                {/* Main Stats Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">

                    {/* Active Job Posts */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 relative overflow-hidden group hover:border-primary/10 transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform group-hover:scale-110">
                            <IconBriefcase />
                        </div>
                        <h3 className="text-gray-400 font-black text-xs uppercase tracking-widest mb-4">
                            Active Postings
                        </h3>
                        <div className="flex items-end gap-3">
                            <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                {stats?.totalJobPosts || 0}
                            </p>
                            <span className="mb-2 text-green-500 font-bold text-sm">+2 this week</span>
                        </div>
                        <Link to="/employer/jobs" className="mt-6 inline-flex text-primary font-black text-sm hover:underline items-center gap-1 group">
                            Manage Jobs
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Total Applications Received */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 relative overflow-hidden group hover:border-blue-100 transition-all">
                        <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform group-hover:scale-110">
                            <IconFileText />
                        </div>
                        <h3 className="text-gray-400 font-black text-xs uppercase tracking-widest mb-4">
                            Total Applications
                        </h3>
                        <div className="flex items-end gap-3">
                            <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                {stats?.totalApplications || 0}
                            </p>
                            <span className="mb-2 text-secondary font-bold text-sm">Reviewing 12</span>
                        </div>
                        <Link to='/employer/applications' className="mt-6 inline-flex text-secondary font-black text-sm hover:underline items-center gap-1 group">
                            View Applicants
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Quick Profile Card */}
                    <div className="bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-900/20 relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                        <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-4">
                            Hiring Status
                        </h3>
                        <p className="text-white text-2xl font-black mb-1">Actively Hiring</p>
                        <p className="text-gray-400 text-sm mb-6">Your company profile is 85% complete.</p>
                        <Link to="/profile" className="px-6 py-3 bg-white/10 text-white rounded-xl text-xs font-black hover:bg-white/20 transition-all inline-block border border-white/10 backdrop-blur-sm">
                            Edit Profile
                        </Link>
                    </div>

                </div>

                {/* Action Section */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-10 border border-gray-100 flex flex-col justify-center min-h-[300px]">
                        <div className="max-w-md">
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Need help finding talent?</h3>
                            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                                Our recruitment tools allow you to filter candidates by skill, experience, and location. Let us help you find the perfect match.
                            </p>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-white text-gray-900 font-black rounded-xl border border-gray-200 hover:shadow-lg transition-all text-sm">
                                    Recruitment Guide
                                </button>
                                <button className="px-6 py-3 text-primary font-black rounded-xl hover:bg-primary/5 transition-all text-sm">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-10 text-white relative overflow-hidden flex flex-col justify-between">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-4">Workopia Pro</h3>
                            <p className="text-white/80 font-medium text-sm leading-relaxed mb-8">
                                Get featured job listings and priority access to top-tier candidates.
                            </p>
                            <button className="w-full py-4 bg-white text-primary font-black rounded-2xl hover:shadow-2xl transition-all">
                                Upgrade to Pro
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default EmployerDashboard;



