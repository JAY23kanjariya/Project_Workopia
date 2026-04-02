import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/ui/DashboardLayout";

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

    if (loading) return <Loader />;

    const adminCards = [
        { title: "Categories", key: "totalCategories", link: "/admin/categories", color: "blue" },
        { title: "Users", key: "totalUsers", link: "/admin/users", color: "green" },
        { title: "Jobs", key: "totalJobPosts", link: "/admin/jobs", color: "red" },
        { title: "Applications", key: "totalApplications", color: "yellow" },
    ];

    const adminActions = [
        { label: "Manage Categories", link: "/admin/categories" },
        { label: "Manage Users", link: "/admin/users" },
        { label: "Manage Jobs", link: "/admin/jobs" },
    ];

    return (
        <DashboardLayout
            user={user}
            stats={stats}
            cards={adminCards}
            actions={adminActions}
        />
    )
}

export default AdminDashboard;