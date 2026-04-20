"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axiosClient";
import { getMyApplications } from "@/service/applicationService";
import Loader from "@/components/ui/Loader";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import { FiFileText, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp, FiArrowUpRight, FiSearch, FiBriefcase, FiMapPin, FiCalendar, FiUser, FiEdit3, FiInbox } from "react-icons/fi";

export default function CandidateDashboard() {
    const [stats, setStats] = useState({});
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, appsRes] = await Promise.all([
                    api.get("/candidate/dashboard"),
                    getMyApplications(),
                ]);
                if (statsRes?.data?.success) setStats(statsRes.data);
                setApplications(appsRes?.data?.applications || []);
            } catch (err) {
                console.error("Dashboard Error:", err);
                toast.error("Could not load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader text="Preparing your dashboard..." />;

    const totalApps = stats.totalApplications || applications.length || 0;
    const approved = applications.filter((a) => a.status === "Approved").length;
    const pending = applications.filter((a) => !a.status || a.status === "Pending").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    const recentApps = applications.slice(0, 5);

    const getStatusConfig = (status) => {
        switch (status) {
            case "Approved": return { variant: "success", icon: FiCheckCircle };
            case "Rejected": return { variant: "danger", icon: FiXCircle };
            default: return { variant: "info", icon: FiClock };
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Candidate Portal</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Track your applications and discover new opportunities.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/jobs" className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
                        <FiSearch className="w-4 h-4" /> Browse Jobs
                    </Link>
                    {[
                        { label: "My Applications", link: "/candidate/applications" },
                        { label: "Settings", link: "/candidate/settings" },
                    ].map((a, i) => (
                        <Link key={i} href={a.link} className="group px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all flex items-center gap-2">
                            {a.label} <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-blue-50 group-hover:scale-110 transition-transform"><FiFileText className="w-6 h-6 text-blue-600" /></div>
                        <div className="flex items-center gap-1 text-blue-500"><FiTrendingUp className="w-3 h-3" /><span className="text-[10px] font-bold">Total</span></div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{totalApps}</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">Applications Sent</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-50 group-hover:scale-110 transition-transform"><FiCheckCircle className="w-6 h-6 text-emerald-600" /></div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{approved}</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">Approved</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-amber-50 group-hover:scale-110 transition-transform"><FiClock className="w-6 h-6 text-amber-600" /></div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{pending}</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">Pending Review</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-red-50 group-hover:scale-110 transition-transform"><FiXCircle className="w-6 h-6 text-red-600" /></div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{rejected}</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">Not Selected</p>
                </div>
            </div>

            {/* Recent Applications Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden pb-4">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900 text-lg tracking-tight">Recent Applications</h3>
                    <Link href="/candidate/applications" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                        View All <FiArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {recentApps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4"><FiInbox className="w-10 h-10" /></div>
                        <h3 className="text-lg font-bold text-gray-500">No Applications Yet</h3>
                        <p className="text-sm text-gray-400 mt-1 italic max-w-xs">Start exploring jobs and submit your first application.</p>
                        <Link href="/jobs" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all">Browse Jobs</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 uppercase tracking-widest text-[10px] font-black text-gray-400">
                                    <th className="px-8 py-4">Position</th>
                                    <th className="px-8 py-4">Applied On</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentApps.map((app) => {
                                    const sc = getStatusConfig(app.status);
                                    const Icon = sc.icon;
                                    return (
                                        <tr key={app.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                                                        <FiBriefcase className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-extrabold text-gray-900 leading-tight truncate max-w-[200px] group-hover:text-blue-600 transition-colors">{app.job_post?.title || "Job"}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5"><FiMapPin className="w-3 h-3" />{app.job_post?.location || "Remote"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-bold text-gray-400 flex items-center gap-1.5">
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant={sc.variant}><Icon className="w-3 h-3 mr-1" />{app.status || "Pending"}</Badge>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link href={`/jobs/${app.job_post_id}`} className="px-3 py-2 text-[11px] font-extrabold rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all">
                                                    View Job
                                                </Link>
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