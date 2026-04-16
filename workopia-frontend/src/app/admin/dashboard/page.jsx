import { axiosServer } from "@/lib/axiosServer";
import DashboardLayout from "@/components/ui/DashboardLayout";

export default async function AdminDashboard() {
    const api = await axiosServer();

    let stats = null;

    try {
        const res = await api.get("/admin/dashboard");
        stats = res.data;
    } catch (err) {
        console.error(err);
    }

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
            stats={stats}
            cards={adminCards}
            actions={adminActions}
        />
    );
}