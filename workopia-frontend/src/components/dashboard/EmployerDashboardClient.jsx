"use client";

import React from "react";
import Link from "next/link";
import { FiBriefcase, FiFileText, FiPlus, FiArrowUpRight, FiTrendingUp, FiUsers, FiClock, FiCheckCircle, FiEye, FiEdit3 } from "react-icons/fi";

export default function EmployerDashboardClient({ stats }) {
    const totalJobs = stats?.totalJobPosts || 0;
    const totalApps = stats?.totalApplications || 0;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Employer Hub</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage your listings and track candidate interest.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/employer/jobs/create"
                        className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                    >
                        <FiPlus className="w-4 h-4" />
                        Post New Job
                    </Link>
                    {[
                        { label: "Manage Jobs", link: "/employer/jobs" },
                        { label: "Applications", link: "/employer/applications" },
                    ].map((a, i) => (
                        <Link
                            key={i}
                            href={a.link}
                            className="group px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all flex items-center gap-2"
                        >
                            {a.label}
                            <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Jobs Posted */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-blue-50 group-hover:scale-110 transition-transform">
                            <FiBriefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500">
                            <FiTrendingUp className="w-3 h-3" />
                            <span className="text-[10px] font-bold">Active</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{totalJobs}</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">Jobs Posted</p>
                </div>

                {/* Applications Received */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-50 group-hover:scale-110 transition-transform">
                            <FiFileText className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500">
                            <FiTrendingUp className="w-3 h-3" />
                            <span className="text-[10px] font-bold">+12%</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{totalApps}</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">Applications Received</p>
                </div>

                {/* Avg per Job */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-indigo-50 group-hover:scale-110 transition-transform">
                            <FiUsers className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">
                        {totalJobs > 0 ? Math.round(totalApps / totalJobs) : 0}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">Avg. Applicants / Job</p>
                </div>

                {/* Response Rate */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-amber-50 group-hover:scale-110 transition-transform">
                            <FiCheckCircle className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">98%</h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">Profile Completeness</p>
                </div>
            </div>

            {/* Chart + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Application Trend Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg tracking-tight">Application Trends</h3>
                            <p className="text-sm text-gray-400 font-medium">Candidate interest over the last 12 periods</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-extrabold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Live
                        </div>
                    </div>

                    <div className="h-56 flex items-end justify-between gap-3 px-2 relative z-10">
                        {[30, 55, 40, 70, 50, 85, 60, 95, 75, 80, 65, 90].map((h, i) => (
                            <div key={i} className="group/bar relative flex flex-1 flex-col items-center h-full justify-end">
                                <div
                                    style={{ height: `${h}%` }}
                                    className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 ease-out cursor-pointer ${
                                        i >= 10
                                            ? "bg-gradient-to-t from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20"
                                            : "bg-slate-100 group-hover/bar:bg-blue-100"
                                    }`}
                                >
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl opacity-0 scale-90 group-hover/bar:opacity-100 group-hover/bar:scale-100 transition-all z-20 whitespace-nowrap">
                                        {h} Applications
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-20 py-2">
                            {[1, 2, 3, 4].map((l) => (
                                <div key={l} className="w-full border-t border-dashed border-slate-300"></div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between text-[11px] text-gray-400 font-bold px-4 uppercase tracking-widest">
                        <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg tracking-tight mb-8">Quick Actions</h3>

                    <div className="space-y-4 flex-1">
                        {[
                            { icon: FiPlus, label: "Post a New Job", desc: "Create a new listing", link: "/employer/jobs/create", color: "bg-blue-50 text-blue-600" },
                            { icon: FiEye, label: "View Applications", desc: "Review candidates", link: "/employer/applications", color: "bg-emerald-50 text-emerald-600" },
                            { icon: FiEdit3, label: "Edit Profile", desc: "Update company info", link: "/profile", color: "bg-indigo-50 text-indigo-600" },
                            { icon: FiBriefcase, label: "Manage Jobs", desc: "Edit or archive listings", link: "/employer/jobs", color: "bg-amber-50 text-amber-600" },
                        ].map((action, i) => (
                            <Link
                                key={i}
                                href={action.link}
                                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all"
                            >
                                <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.color}`}>
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-extrabold text-gray-900 leading-tight">{action.label}</p>
                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{action.desc}</p>
                                </div>
                                <FiArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
