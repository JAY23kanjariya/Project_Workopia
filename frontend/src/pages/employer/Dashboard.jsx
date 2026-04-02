import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/ui/DashboardLayout";

function EmployerDashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/employer/dashboard");
                setStats(res.data || {});
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <Loader text="Loading dashboard..." />;

    // 🔹 Cards (StatCards)
    const cards = [
        {
            title: "My Jobs",
            key: "totalJobPosts",
            link: "/employer/jobs",
            color: "blue",
        },
        {
            title: "Applications",
            key: "totalApplications",
            link: "/employer/applications",
            color: "green",
        },
    ];

    // 🔹 Quick Actions
    const actions = [
        { label: "Post New Job", link: "/employer/jobs/create" },
        { label: "Manage Jobs", link: "/employer/jobs" },
        { label: "View Applications", link: "/employer/applications" },
        { label: "Edit Profile", link: "/profile" },
    ];

    return (
        <DashboardLayout
            user={user}
            stats={stats}
            cards={cards}
            actions={actions}
        />
    );
}

export default EmployerDashboard;