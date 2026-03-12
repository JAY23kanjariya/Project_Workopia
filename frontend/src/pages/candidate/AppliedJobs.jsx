import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as applicationApi from "../../api/applicationApi";
import Loader from "../../components/common/Loader";

// Icons
const IconFileText = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

export default function AppliedJobs() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const response = await applicationApi.getMyApplications();
                if (response.data.success) {
                    setApplications(response.data.applications || []);
                }
            } catch (err) {
                console.error("Fetch applications error:", err);
                setError("Failed to synchronize your application history.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return <Loader text="Syncing your application history..." />;
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <Link to="/candidate/dashboard" className="inline-flex items-center text-sm font-black text-gray-400 hover:text-primary mb-10 transition-all">
                    <span className="mr-2"><IconArrowLeft /></span> Back to Portal
                </Link>

                <div className="mb-12">
                    <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                        Mission Log
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                        Your Journey
                    </h2>
                    <p className="mt-2 text-gray-500 font-medium">
                        Track every opportunity you've explored on Workopia.
                    </p>
                </div>

                {/* Candidate Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-100 border border-gray-50 hover:border-primary/20 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Missions Launched</h3>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter relative z-10">{applications.length}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-100 border border-gray-50 hover:border-primary/20 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-yellow-500/10 transition-colors"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Under Review</h3>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter relative z-10">
                            {applications.filter(a => a.status === 'Pending').length}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-100 border border-gray-50 hover:border-primary/20 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-green-500/10 transition-colors"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Success Rate</h3>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter relative z-10">
                            {applications.length > 0 ? Math.round((applications.filter(a => a.status === 'Approved').length / applications.length) * 100) : 0}%
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold rounded-xl mb-10 shadow-sm shadow-red-100">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-100 border border-gray-100 overflow-hidden">
                    {applications.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {applications.map((app) => (
                                <div key={app.id} className="p-10 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-primary/5 rounded-[1.25rem] flex items-center justify-center text-primary shrink-0 border border-primary/10 shadow-sm">
                                            <IconFileText />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-xl tracking-tight leading-tight mb-1">{app.job_post?.title}</h4>
                                            <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <span>{app.job_post?.location || 'Global Remote'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-8 md:gap-12">
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Applied on</p>
                                            <p className="text-sm font-black text-gray-900 tracking-tight">
                                                {new Date(app.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        <div className="text-left md:text-right shrink-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Current Status</p>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none
                                                ${app.status === 'Approved' ? 'bg-green-100 text-green-600' : 
                                                  app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                                                  'bg-yellow-100 text-yellow-600'}`}>
                                                {app.status}
                                            </span>
                                        </div>

                                        <Link 
                                            to={`/jobs/${app.job_post_id}`}
                                            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:shadow-2xl hover:shadow-primary/10 transition-all active:scale-95 text-center w-full md:w-auto"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-8 border border-gray-100">
                                <IconFileText />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No missions launched yet</h3>
                            <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto">Your application history is currently empty. Discovery awaits in the marketplace.</p>
                            <Link to="/jobs" className="inline-flex px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95">
                                Browse Open Roles
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

