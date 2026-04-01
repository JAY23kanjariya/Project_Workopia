import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

function EmployerDashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/employer/dashboard");
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <Loader text="Loading..." />;

    return (
        <div className="p-6 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Welcome, {user?.name}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your jobs and applications
                    </p>
                </div>

                <Link
                    to="/employer/jobs/create"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded"
                >
                    + Post Job
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Jobs</p>
                    <p className="text-xl font-semibold">
                        {stats?.totalJobPosts || 0}
                    </p>
                </div>

                <div className="border rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Applications</p>
                    <p className="text-xl font-semibold">
                        {stats?.totalApplications || 0}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="border rounded-lg p-4">
                <p className="text-gray-600 mb-3 text-sm">Quick Actions</p>

                <div className="flex gap-4">
                    <Link
                        to="/employer/jobs"
                        className="text-blue-600 text-sm hover:underline"
                    >
                        Manage Jobs
                    </Link>

                    <Link
                        to="/employer/applications"
                        className="text-blue-600 text-sm hover:underline"
                    >
                        View Applications
                    </Link>

                    <Link
                        to="/profile"
                        className="text-blue-600 text-sm hover:underline"
                    >
                        Edit Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EmployerDashboard;