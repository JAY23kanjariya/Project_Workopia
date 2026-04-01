import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as applicationApi from "../../api/applicationApi";
import Loader from "../../components/common/Loader";

// Icons
const IconFileText = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export default function AppliedJobs() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await applicationApi.getMyApplications();
                if (response.data.success) setApplications(response.data.applications || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load your applications.");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) return <Loader text="Loading your applications..." />;

    return (
        <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <Link to="/candidate/dashboard" className="text-sm font-bold text-gray-500 hover:text-primary mb-6 inline-block">
                ← Back to Portal
            </Link>

            <h2 className="text-3xl font-black text-gray-900 mb-2">Your Applications</h2>
            <p className="text-gray-500 mb-6">Track all the opportunities you've applied for.</p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm font-bold text-gray-400 mb-1">Total Applied</p>
                    <p className="text-2xl font-black">{applications.length}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm font-bold text-gray-400 mb-1">Under Review</p>
                    <p className="text-2xl font-black">{applications.filter(a => a.status === 'Pending').length}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm font-bold text-gray-400 mb-1">Success Rate</p>
                    <p className="text-2xl font-black">
                        {applications.length > 0 ? Math.round((applications.filter(a => a.status === 'Approved').length / applications.length) * 100) : 0}%
                    </p>
                </div>
            </div>

            {error && <p className="text-red-500 font-bold mb-6">{error}</p>}

            {/* Applications List */}
            {applications.length > 0 ? (
                <div className="space-y-4">
                    {applications.map(app => (
                        <div key={app.id} className="flex flex-col sm:flex-row sm:justify-between items-start p-4 border rounded-lg hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-primary">
                                    <IconFileText />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{app.job_post?.title}</h3>
                                    <p className="text-xs text-gray-500">{app.job_post?.location || 'Remote'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    app.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                    app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                    'bg-yellow-100 text-yellow-600'}`}>
                                    {app.status}
                                </span>
                                <Link to={`/jobs/${app.job_post_id}`} className="text-xs font-bold px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-primary transition">
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto flex items-center justify-center mb-4">
                        <IconFileText />
                    </div>
                    <p className="font-bold text-gray-900 mb-2">No applications yet</p>
                    <p className="text-gray-500 mb-6">Your application history is empty. Explore new opportunities.</p>
                    <Link to="/jobs" className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:shadow-md transition">Browse Jobs</Link>
                </div>
            )}
        </div>
    );
}