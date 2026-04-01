import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as applicationApi from "../../api/applicationApi";
import * as jobApi from "../../api/jobApi";
import Loader from "../../components/common/Loader";

export default function EmployerApplications() {
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get("job_id");

    const [applications, setApplications] = useState([]);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchData = async () => {
        if (!jobId) {
            setError("Invalid job selection.");
            setApplications([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [jobRes, appRes] = await Promise.all([
                jobApi.getJobById(jobId),
                applicationApi.getJobApplications(jobId)
            ]);

            // Safe handling
            setJobTitle(jobRes?.data?.jobPost?.title || "Job");

            setApplications(
                Array.isArray(appRes?.data?.applications)
                    ? appRes.data.applications
                    : []
            );

        } catch (err) {
            console.error(err);
            setError("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [jobId]);

    const handleUpdateStatus = async (id, status) => {
        if (updatingId) return;

        try {
            setUpdatingId(id);

            const res = await applicationApi.updateApplicationStatus(id, status);

            if (res?.data?.success) {
                setApplications(prev =>
                    prev.map(app =>
                        app.id === id ? { ...app, status } : app
                    )
                );
            }
        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* Back */}
            <Link to="/employer/jobs" className="text-sm text-gray-500 hover:text-black">
                ← Back
            </Link>

            {/* Header */}
            <h1 className="text-2xl font-bold mt-4 mb-6">
                {jobTitle} Applications
            </h1>

            {/* States */}
            {loading ? (
                <Loader text="Loading..." />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : applications.length === 0 ? (
                <p className="text-gray-500">No applications found.</p>
            ) : (
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id} className="border-t">
                                    <td className="p-3">
                                        {app?.candidate?.name || "N/A"}
                                    </td>

                                    <td className="p-3 text-gray-500">
                                        {app?.candidate?.email || "N/A"}
                                    </td>

                                    <td className="p-3">
                                        {app.created_at
                                            ? new Date(app.created_at).toLocaleDateString()
                                            : "-"
                                        }
                                    </td>

                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium
                                            ${app.status === "Approved"
                                                ? "bg-green-100 text-green-600"
                                                : app.status === "Rejected"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                            }`}>
                                            {app.status || "Pending"}
                                        </span>
                                    </td>

                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            disabled={updatingId === app.id || app.status === "Approved"}
                                            onClick={() => handleUpdateStatus(app.id, "Approved")}
                                            className="px-3 py-1 text-xs bg-green-500 text-white rounded disabled:opacity-50"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            disabled={updatingId === app.id || app.status === "Rejected"}
                                            onClick={() => handleUpdateStatus(app.id, "Rejected")}
                                            className="px-3 py-1 text-xs bg-red-500 text-white rounded disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}