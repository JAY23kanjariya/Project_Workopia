import { axiosServer } from "@/lib/axiosServer";
import EmployerDashboardClient from "@/components/dashboard/EmployerDashboardClient";

export default async function EmployerDashboard() {
    let stats = {};

    try {
        const api = await axiosServer();
        const res = await api.get("/employer/dashboard");
        stats = res.data || {};
    } catch (err) {
        console.error("Employer Dashboard Error:", err);
    }

    return <EmployerDashboardClient stats={stats} />;
}