import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/dashboard");
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader text="Loading dashboard..." />;

    return (
        <div className="p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">
                    Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                    Welcome, {user?.name}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Categories" value={stats?.totalCategories} link="/admin/categories" />
                <StatCard title="Users" value={stats?.totalUsers} link="/admin/users" />
                <StatCard title="Jobs" value={stats?.totalJobPosts} link="/admin/jobs" />
                <StatCard title="Applications" value={stats?.totalApplications} />
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                    Quick Actions
                </h2>

                <div className="flex flex-wrap gap-3">
                    <Link to="/admin/categories" className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50">
                        Manage Categories
                    </Link>
                    <Link to="/admin/users" className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50">
                        Manage Users
                    </Link>
                    <Link to="/admin/jobs" className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50">
                        Manage Jobs
                    </Link>
                </div>
            </div>

        </div>
    );
}

function StatCard({ title, value, link }) {
    const content = (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-semibold text-gray-900">
                {value ?? 0}
            </p>
        </div>
    );

    return link ? <Link to={link}>{content}</Link> : content;
}

export default AdminDashboard;