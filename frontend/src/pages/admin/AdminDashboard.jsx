import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import api from "../../api/axios";
import { Link } from "react-router-dom";

// Inline Icons for Dashboard
const IconUsers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const IconBriefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

const IconGrid = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);

const IconFileText = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/admin/dashboard");
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-500 font-medium">Loading Overview...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Admin Overview
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Hello, {user?.name || "Admin"}. Here's what's happening on Workopia today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                    <StatCard
                        title="Platform Categories"
                        value={stats?.totalCategories}
                        icon={<IconGrid />}
                        color="bg-blue-500"
                        link="/admin/categories"
                    />
                    <StatCard
                        title="Registered Users"
                        value={stats?.totalUsers}
                        icon={<IconUsers />}
                        color="bg-purple-500"
                        link="/admin/users"
                    />
                    <StatCard
                        title="Job Postings"
                        value={stats?.totalJobPosts}
                        icon={<IconBriefcase />}
                        color="bg-indigo-500"
                        link="/admin/jobs"
                    />
                    <StatCard
                        title="Applications"
                        value={stats?.totalApplications}
                        icon={<IconFileText />}
                        color="bg-teal-500"
                    />
                </div>

                {/* Secondary Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <QuickAction
                                title="Add Category"
                                link="/admin/categories/create"
                                color="text-blue-600 bg-blue-50"
                            />
                            <QuickAction
                                title="Manage Users"
                                link="/admin/users"
                                color="text-purple-600 bg-purple-50"
                            />
                            <QuickAction
                                title="Active Jobs"
                                link="/admin/jobs"
                                color="text-indigo-600 bg-indigo-50"
                            />
                            <QuickAction
                                title="System Logs"
                                link="/admin/logs"
                                color="text-gray-600 bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* System Summary (Placeholder) */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col justify-center items-center text-center">
                        <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 mb-4 font-bold text-lg">
                            System Health: 100%
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Tracking</h3>
                        <p className="text-gray-500 text-sm max-w-xs">
                            Server response times and platform activity are within normal parameters. No issues detected.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components for cleaner code
function StatCard({ title, value, icon, color, link }) {
    const CardContent = (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl text-white ${color}`}>
                    {icon}
                </div>
                <div className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                    +12% vs last month
                </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {title}
            </h3>
            <p className="mt-2 text-4xl font-black text-gray-900 tracking-tight">
                {value ?? 0}
            </p>
        </div>
    );

    return link ? <Link to={link}>{CardContent}</Link> : CardContent;
}

function QuickAction({ title, link, color }) {
    return (
        <Link
            to={link}
            className={`flex items-center justify-center p-4 rounded-xl font-bold text-sm transition-all hover:opacity-80 ${color}`}
        >
            {title}
        </Link>
    );
}

export default AdminDashboard;
