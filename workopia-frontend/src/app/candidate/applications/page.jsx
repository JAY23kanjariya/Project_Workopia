"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyApplications } from "@/service/applicationService";
import Loader from "@/components/ui/Loader";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiFileText, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp, FiBriefcase, FiMapPin, FiCalendar, FiArrowUpRight, FiInbox } from "react-icons/fi";

export default function AppliedJobs() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await getMyApplications();
                if (res.data.success) setApplications(res.data.applications || []);
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Could not load your applications");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) return <Loader text="Retrieving your application history..." />;

    const approved = applications.filter((a) => a.status === "Approved").length;
    const pending = applications.filter((a) => !a.status || a.status === "Pending").length;
    const successRate = applications.length > 0 ? Math.round((approved / applications.length) * 100) : 0;

    const getStatusConfig = (status) => {
        switch (status) {
            case "Approved": return { variant: "success", icon: FiCheckCircle };
            case "Rejected": return { variant: "danger", icon: FiXCircle };
            default: return { variant: "info", icon: FiClock };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link href="/candidate/dashboard" className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors mb-4 inline-flex">
                        <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Applications</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Track every opportunity you've pursued.</p>
                </div>
                <Link href="/jobs" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
                    <FiBriefcase className="w-4 h-4" /> Browse More Jobs
                </Link>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-50"><FiFileText className="w-6 h-6 text-blue-600" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">{applications.length}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Applied</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-50"><FiClock className="w-6 h-6 text-amber-600" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">{pending}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Under Review</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-50"><FiTrendingUp className="w-6 h-6 text-emerald-600" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">{successRate}%</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Success Rate</p>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[300px] flex flex-col">
                {applications.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4"><FiInbox className="w-10 h-10" /></div>
                        <h3 className="text-lg font-bold text-gray-500">No Applications Yet</h3>
                        <p className="text-sm text-gray-400 mt-1 italic max-w-xs">Your journey starts with a single application. Explore open positions now.</p>
                        <Link href="/jobs" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all">Browse Jobs</Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {applications.map((app) => {
                            const sc = getStatusConfig(app.status);
                            const Icon = sc.icon;
                            return (
                                <div key={app.id} className="group flex flex-col sm:flex-row sm:items-center justify-between px-8 py-6 hover:bg-blue-50/30 transition-colors gap-4">
                                    {/* Left: Job Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                                            <FiBriefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{app.job_post?.title || "Job Position"}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1"><FiMapPin className="w-3 h-3" />{app.job_post?.location || "Remote"}</span>
                                                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1"><FiCalendar className="w-3 h-3" />{new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Status + Action */}
                                    <div className="flex items-center gap-3 sm:ml-auto">
                                        <Badge variant={sc.variant}><Icon className="w-3 h-3 mr-1" />{app.status || "Pending"}</Badge>
                                        <Link href={`/jobs/${app.job_post_id}`} className="px-4 py-2 text-[11px] font-extrabold rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all flex items-center gap-1">
                                            View <FiArrowUpRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}