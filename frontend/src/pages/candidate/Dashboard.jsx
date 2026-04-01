import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import * as applicationApi from "../../api/applicationApi";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

export default function CandidateDashboard() {
    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState(null);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [statsRes, appsRes] = await Promise.all([
                    api.get("/candidate/dashboard"),
                    applicationApi.getMyApplications()
                ]);

                if (statsRes?.data?.success) {
                    setStats(statsRes.data);
                }

                const apps = appsRes?.data?.applications || [];
                setRecentApplications(apps.slice(0, 5));

            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Loader text="Loading dashboard..." />;

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            
            {/* Header */}
            <h1 className="text-2xl font-bold mb-6">
                Welcome, {user?.name ? user.name.split(" ")[0] : "User"}
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                    <p className="text-gray-500 text-sm">Total Applications</p>
                    <p className="text-xl font-semibold">
                        {stats?.totalApplications || 0}
                    </p>
                </div>

                <div className="p-4 border rounded-lg">
                    <p className="text-gray-500 text-sm">Approved</p>
                    <p className="text-xl font-semibold">
                        {recentApplications.filter(a => a.status === "Approved").length}
                    </p>
                </div>

                <div className="p-4 border rounded-lg">
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-xl font-semibold">
                        {recentApplications.filter(a => a.status === "Pending").length}
                    </p>
                </div>
            </div>

            {/* Recent Applications */}
            <div className="border rounded-lg">
                <div className="p-4 border-b flex justify-between">
                    <h2 className="font-semibold">Recent Applications</h2>
                    <Link to="/candidate/my-applications" className="text-blue-600 text-sm">
                        View All
                    </Link>
                </div>

                {recentApplications.length > 0 ? (
                    recentApplications.map(app => (
                        <div
                            key={app.id}
                            className="p-4 border-b flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">
                                    {app.job_post?.title || "Job Title"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span
                                    className={`text-xs px-2 py-1 rounded
                                        ${app.status === "Approved" && "bg-green-100 text-green-600"}
                                        ${app.status === "Rejected" && "bg-red-100 text-red-600"}
                                        ${app.status === "Pending" && "bg-yellow-100 text-yellow-600"}
                                    `}
                                >
                                    {app.status}
                                </span>

                                <Link
                                    to={`/jobs/${app.job_post_id}`}
                                    className="text-blue-600 text-sm"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        No applications yet.
                    </div>
                )}
            </div>
        </div>
    );
}