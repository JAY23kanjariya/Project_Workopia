import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import * as applicationApi from "../../api/applicationApi";
import api from "../../api/axios"; // For dashboard stats
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

// Inline Icons for Candidate Dashboard
const IconFileText = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const IconBriefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

const IconCheckCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

export default function CandidateDashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, appsRes] = await Promise.all([
                    api.get("/candidate/dashboard"),
                    applicationApi.getMyApplications()
                ]);
                
                if (statsRes.data.success) {
                    setStats(statsRes.data);
                }
                
                if (appsRes.data.success) {
                    setRecentApplications(appsRes.data.applications.slice(0, 5) || []);
                }
            } catch (error) {
                console.error("Error fetching candidate dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <Loader text="Preparing your workspace..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Welcome Header */}
                <div className="mb-12">
                    <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                        Candidate Portal
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
                        Welcome back, {user?.name.split(' ')[0]}!
                    </h2>
                    <p className="text-gray-500 font-medium italic">
                        Track your applications and explore new opportunities.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    
                    {/* Stats Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-primary/30 border border-primary/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 transition-transform group-hover:scale-110">
                            <IconBriefcase />
                        </div>
                        <h3 className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                            Active Applications
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-6xl font-black text-gray-900 tracking-tighter">
                                {stats?.totalApplications || 0}
                            </p>
                            <span className="text-primary font-bold text-sm">Submitted</span>
                        </div>
                        <Link to="/candidate/my-applications" className="mt-8 inline-flex items-center text-primary font-black text-xs uppercase tracking-widest hover:gap-2 transition-all">
                            View All History →
                        </Link>
                    </div>

                    {/* Quick Profile Status */}
                    <div className="lg:col-span-2 bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden text-white flex flex-col md:flex-row items-center gap-8">
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 text-center md:text-left">
                            <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                                Career Progress
                            </h3>
                            <p className="text-2xl font-black mb-2 leading-tight">Your profile is getting noticed!</p>
                            <p className="text-white/70 font-medium text-sm mb-6 max-w-sm">
                                Keep your resume updated and apply to jobs that match your skills for better outcomes.
                            </p>
                            <Link to="/jobs" className="px-6 py-3 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all inline-block">
                                Explore Open Jobs
                            </Link>
                        </div>
                        <div className="hidden md:flex flex-1 justify-end text-white/20">
                           <div className="scale-[3]">
                                <IconCheckCircle />
                           </div>
                        </div>
                    </div>
                </div>

                {/* Recent Applications Section */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Recent Applications</h3>
                        <Link to="/candidate/my-applications" className="text-xs font-bold text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                        {recentApplications.length > 0 ? (
                            recentApplications.map((app) => (
                                <div key={app.id} className="p-8 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                            <IconFileText />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 tracking-tight">{app.job_post?.title}</h4>
                                            <p className="text-sm text-gray-500 font-medium">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none
                                                ${app.status === 'Approved' ? 'bg-green-100 text-green-600' : 
                                                  app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                                                  'bg-yellow-100 text-yellow-600'}`}>
                                                {app.status}
                                            </span>
                                            <div className="flex items-center gap-1 mt-2 text-gray-400 italic text-[10px] font-bold">
                                                <IconClock /> 
                                                <span>Under Review</span>
                                            </div>
                                        </div>
                                        <Link 
                                            to={`/jobs/${app.job_post_id}`}
                                            className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all active:scale-95"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center">
                                <IconFileText />
                                <p className="mt-4 text-gray-500 font-medium italic">You haven't applied for any jobs yet.</p>
                                <Link to="/jobs" className="mt-4 text-primary font-black text-xs uppercase tracking-widest inline-block border-b-2 border-primary pb-1">
                                    Find Your Next Role Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}


