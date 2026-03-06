import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import CandidateDashboard from "./candidate/Dashboard";
// import EmployerDashboard from "./employer/Dashboard";
// import AdminDashboard from "./admin/Dashboard";

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    if (user?.role_id === 1) return <AdminDashboard />;
    if (user?.role_id === 2) return <EmployerDashboard />;
    if (user?.role_id === 3) return <CandidateDashboard />;

    return (
        <div className="error-container">
            <h3>Unknown User Role</h3>
            <p>Please contact support if you believe this is an error.</p>
        </div>
    );
}
