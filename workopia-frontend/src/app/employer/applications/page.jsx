"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getJobApplications, updateApplicationStatus } from "@/service/applicationService";
import { getJobById } from "@/service/jobService";
import Loader from "@/components/ui/Loader";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiFileText, FiInbox } from "react-icons/fi";

function ApplicationsContent() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get("job_id");

    const [applications, setApplications] = useState([]);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchData = async () => {
        if (!jobId) {
            setError("No job selected. Please select a job from your listings.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [jobRes, appRes] = await Promise.all([
                getJobById(jobId),
                getJobApplications(jobId),
            ]);

            setJobTitle(jobRes?.data?.jobPost?.title || "Job");
            setApplications(
                Array.isArray(appRes?.data?.applications) ? appRes.data.applications : []
            );
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Could not load applications. Please try again.");
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
            const res = await updateApplicationStatus(id, status);
            if (res?.data?.success) {
                setApplications((prev) =>
                    prev.map((app) => (app.id === id ? { ...app, status } : app))
                );
                toast.success(`Application ${status.toLowerCase()}`);
            }
        } catch (err) {
            console.error("Update Error:", err);
            toast.error("Status update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "Approved": return { variant: "success", icon: FiCheckCircle, label: "Approved" };
            case "Rejected": return { variant: "danger", icon: FiXCircle, label: "Rejected" };
            default: return { variant: "info", icon: FiClock, label: "Pending" };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link
                        href="/employer/jobs"
                        className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors mb-4 inline-flex"
                    >
                        <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Jobs
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {loading ? "Loading..." : `${jobTitle}`}
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">
                        {applications.length} candidate{applications.length !== 1 ? "s" : ""} have applied for this position.
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-extrabold flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4" />
                        {applications.filter((a) => a.status === "Approved").length} Approved
                    </div>
                    <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl text-xs font-extrabold flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        {applications.filter((a) => !a.status || a.status === "Pending").length} Pending
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                {loading ? (
                    <Loader text="Retrieving applicant profiles..." />
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
                            <FiFileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{error}</h3>
                        <button onClick={fetchData} className="mt-4 text-indigo-600 font-bold hover:underline">Retry</button>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4">
                            <FiInbox className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-500">No Applications Yet</h3>
                        <p className="text-sm text-gray-400 mt-1 italic max-w-xs">Candidates haven't applied yet. Share your listing to attract talent.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 uppercase tracking-widest text-[10px] font-black text-gray-400">
                                    <th className="px-8 py-5">Candidate</th>
                                    <th className="px-8 py-5">Applied On</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {applications.map((app) => {
                                    const statusConfig = getStatusConfig(app.status);
                                    const StatusIcon = statusConfig.icon;

                                    return (
                                        <tr key={app.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-50 to-blue-50 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
                                                        {app.candidate?.name?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-gray-900 leading-none mb-1">
                                                            {app.candidate?.name || "Unknown"}
                                                        </p>
                                                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                                                            <FiMail className="w-3 h-3 shrink-0" />
                                                            {app.candidate?.email || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-gray-400 flex items-center gap-1.5">
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    {app.created_at
                                                        ? new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                        : "—"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant={statusConfig.variant}>
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {statusConfig.label}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        disabled={updatingId === app.id || app.status === "Approved"}
                                                        onClick={() => handleUpdateStatus(app.id, "Approved")}
                                                        className="px-4 py-2 text-xs font-extrabold rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-100"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        disabled={updatingId === app.id || app.status === "Rejected"}
                                                        onClick={() => handleUpdateStatus(app.id, "Rejected")}
                                                        className="px-4 py-2 text-xs font-extrabold rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-md hover:shadow-red-100"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EmployerApplications() {
    return (
        <Suspense fallback={<Loader text="Preparing applications view..." />}>
            <ApplicationsContent />
        </Suspense>
    );
}