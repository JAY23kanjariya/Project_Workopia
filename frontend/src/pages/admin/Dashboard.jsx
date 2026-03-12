import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../auth/AuthContext"
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

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
        return <Loader text="Assembling workspace intelligence..." />;
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                        Platform Control Center
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                        System Overview
                    </h2>
                    <p className="mt-2 text-gray-500 font-medium">
                        Welcome back, <span className="text-gray-900 font-black">{user?.name}</span>. Real-time platform metrics and diagnostics.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
                    <StatCard
                        title="Active Categories"
                        value={stats?.totalCategories}
                        icon={<IconGrid />}
                        color="bg-primary"
                        link="/admin/categories"
                        trend="+4 New"
                    />
                    <StatCard
                        title="Platform Talent"
                        value={stats?.totalUsers}
                        icon={<IconUsers />}
                        color="bg-gray-900"
                        link="/admin/users"
                        trend="Growing"
                    />
                    <StatCard
                        title="Job Inventory"
                        value={stats?.totalJobPosts}
                        icon={<IconBriefcase />}
                        color="bg-primary"
                        link="/admin/jobs"
                        trend="Market High"
                    />
                    <StatCard
                        title="Application Volume"
                        value={stats?.totalApplications}
                        icon={<IconFileText />}
                        color="bg-gray-900"
                        trend="Active"
                    />
                </div>

                {/* Action Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Access */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                        <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Platform Management</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <QuickAction
                                title="Define New Category"
                                description="Expand the marketplace horizons."
                                link="/admin/categories/create"
                                icon={<IconGrid />}
                            />
                            <QuickAction
                                title="Regulatory User Review"
                                description="Audit registered platform entities."
                                link="/admin/users"
                                icon={<IconUsers />}
                            />
                            <QuickAction
                                title="Job Quality Control"
                                description="Oversee active marketplace listings."
                                link="/admin/jobs"
                                icon={<IconBriefcase />}
                            />
                            <QuickAction
                                title="Platform Diagnostics"
                                description="Review system logs and performance."
                                link="/admin/dashboard"
                                icon={<IconFileText />}
                            />
                        </div>
                    </div>

                    {/* System Integrity */}
                    <div className="bg-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-center text-center">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <IconGrid />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-block px-4 py-2 bg-white/10 rounded-full font-black text-[10px] uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-white/10">
                                Status: Operational
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight leading-tight">System Integrity 100%</h3>
                            <p className="text-white/70 font-medium text-sm leading-relaxed max-w-xs mx-auto mb-8">
                                All primary services, data gateways, and API endpoints are performing at peak efficiency.
                            </p>
                            <button className="px-8 py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary-dark/20 hover:scale-105 transition-all">
                                Efficiency Report
                            </button>
                        </div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, link, trend }) {
    const CardContent = (
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
            <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl text-white shadow-xl ${color} shadow-primary/10 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                    {trend}
                </div>
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">
                {title}
            </h3>
            <p className="text-5xl font-black text-gray-900 tracking-tighter">
                {value ?? 0}
            </p>
        </div>
    );

    return link ? <Link to={link}>{CardContent}</Link> : CardContent;
}

function QuickAction({ title, description, link, icon }) {
    return (
        <Link
            to={link}
            className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group"
        >
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                {icon}
            </div>
            <div>
                <h4 className="font-black text-gray-900 tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-xs text-gray-500 font-medium">{description}</p>
            </div>
        </Link>
    );
}

export default AdminDashboard;


