import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import * as applicationApi from "../../api/applicationApi";
import api from "../../api/axios";

import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/ui/DashboardLayout";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import { Link } from "react-router-dom";

export default function CandidateDashboard() {
    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState({});
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
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    // 🔹 Cards
    const cards = [
        {
            title: "Total Applications",
            key: "totalApplications",
            color: "blue",
        },
        {
            title: "Approved",
            key: "approvedCount",
            color: "green",
        },
        {
            title: "Pending",
            key: "pendingCount",
            color: "yellow",
        },
    ];

    // 🔹 Prepare stats manually (since backend may not give approved/pending)
    const enhancedStats = {
        ...stats,
        approvedCount: recentApplications.filter(a => a.status === "Approved").length,
        pendingCount: recentApplications.filter(a => a.status === "Pending").length,
    };

    // 🔹 Quick Actions
    const actions = [
        { label: "Browse Jobs", link: "/jobs" },
        { label: "My Applications", link: "/candidate/my-applications" },
        { label: "Edit Profile", link: "/profile" },
    ];

    // 🔹 Table Columns
    const columns = [
        {
            header: "Job",
            render: (app) => app.job_post?.title || "Job Title",
        },
        {
            header: "Applied Date",
            render: (app) =>
                new Date(app.created_at).toLocaleDateString(),
        },
        {
            header: "Status",
            render: (app) => (
                <Badge
                    label={app.status}
                    variant={
                        app.status === "Approved"
                            ? "success"
                            : app.status === "Rejected"
                            ? "danger"
                            : "warning"
                    }
                />
            ),
        },
        {
            header: "Action",
            align: "right",
            render: (app) => (
                <Link
                    to={`/jobs/${app.job_post_id}`}
                    className="text-blue-600 text-sm"
                >
                    View
                </Link>
            ),
        },
    ];

    return (
        <div className="space-y-6">

            {/* Dashboard Layout */}
            <DashboardLayout
                user={user}
                stats={enhancedStats}
                cards={cards}
                actions={actions}
            />

            {/* Recent Applications */}
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        Recent Applications
                    </h2>
                    <Link
                        to="/candidate/my-applications"
                        className="text-blue-600 text-sm"
                    >
                        View All
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={recentApplications}
                    loading={false}
                    emptyText="No applications yet"
                />
            </div>
        </div>
    );
}