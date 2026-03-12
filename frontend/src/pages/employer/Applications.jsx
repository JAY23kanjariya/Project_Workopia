import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as applicationApi from "../../api/applicationApi";
import * as jobApi from "../../api/jobApi";
import Loader from "../../components/common/Loader";

// Icons 
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

export default function EmployerApplications() {
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get("job_id");
    const [applications, setApplications] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchData = async () => {
        if (!jobId) {
            setError("No Job ID provided. Please select a job to view applications.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // Get job title and applications in parallel
            const [jobRes, appRes] = await Promise.all([
                jobApi.getJobById(jobId),
                applicationApi.getJobApplications(jobId)
            ]);
            
            if (jobRes.data.success) {
                setJobDetails(jobRes.data.jobPost);
            }

            if (appRes.data.success) {
                setApplications(appRes.data.applications || []);
            }
        } catch (err) {
            console.error("Fetch Data error:", err);
            setError("Synchronization failure. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [jobId]);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            setUpdatingId(appId);
            const res = await applicationApi.updateApplicationStatus(appId, newStatus);
            if (res.data.success) {
                // Update local list
                setApplications(apps => apps.map(app => 
                    app.id === appId ? { ...app, status: newStatus } : app
                ));
            }
        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to modify candidate status.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/employer/jobs" className="inline-flex items-center text-sm font-black text-gray-400 hover:text-primary mb-10 transition-all">
                    <span className="mr-2"><IconArrowLeft /></span> Back to Listings
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                        Talent Pipeline
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                        {jobDetails ? `Applicants for ${jobDetails.title}` : 'Review Applications'}
                    </h2>
                    <p className="mt-2 text-gray-500 font-medium">
                        Evaluate candidates and manage your recruitment workflow.
                    </p>
                </div>

                {/* Pipeline Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-100 border border-gray-50 hover:border-primary/20 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Total Intake</h3>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter relative z-10">{applications.length}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-100 border border-gray-50 hover:border-primary/20 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-green-500/10 transition-colors"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Shortlisted</h3>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter relative z-10">
                            {applications.filter(a => a.status === 'Approved').length}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-100 border border-gray-50 hover:border-primary/20 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-yellow-500/10 transition-colors"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Under Review</h3>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter relative z-10">
                            {applications.filter(a => a.status === 'Pending').length}
                        </p>
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-white shadow-2xl shadow-gray-100 rounded-[2.5rem] overflow-hidden border border-gray-100">
                    {loading ? (
                        <Loader text="Screening candidates..." />
                    ) : error ? (
                        <div className="py-24 text-center">
                            <p className="text-red-500 font-black mb-6">{error}</p>
                            {!jobId && (
                                <Link to="/employer/jobs" className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10">
                                    Browse Jobs
                                </Link>
                            )}
                            {jobId && <button onClick={fetchData} className="text-primary font-black hover:underline uppercase tracking-widest text-xs">Reconnect</button>}
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                                <IconUser />
                            </div>
                            <p className="text-gray-500 text-xl font-black tracking-tight mb-2">No applications yet.</p>
                            <p className="text-sm text-gray-400 font-medium">Your next top talent is just around the corner.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate Profile</th>
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Submission Date</th>
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-10 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {applications.map(app => (
                                        <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mr-4 shrink-0 shadow-sm border border-primary/10">
                                                        <IconUser />
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-black text-gray-900 tracking-tight leading-none mb-1">{app.candidate?.name}</div>
                                                        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            <span className="mr-1.5"><IconMail /></span>
                                                            {app.candidate?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 whitespace-nowrap text-sm font-bold text-gray-900">
                                                {new Date(app.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-10 py-6 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none
                                                    ${app.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                                      app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                                      'bg-yellow-100 text-yellow-600'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-3">
                                                    {updatingId === app.id ? (
                                                        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mr-4"></div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(app.id, 'Approved')}
                                                                className={`p-3 rounded-xl transition-all shadow-sm ${app.status === 'Approved' ? 'bg-green-600 text-white cursor-default' : 'text-green-600 bg-green-50 border border-green-100 hover:bg-green-600 hover:text-white'}`}
                                                                title="Approve Talent"
                                                                disabled={app.status === 'Approved'}
                                                            >
                                                                <IconCheck />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                                                                className={`p-3 rounded-xl transition-all shadow-sm ${app.status === 'Rejected' ? 'bg-red-600 text-white cursor-default' : 'text-red-600 bg-red-50 border border-red-100 hover:bg-red-600 hover:text-white'}`}
                                                                title="Reject Talent"
                                                                disabled={app.status === 'Rejected'}
                                                            >
                                                                <IconX />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

