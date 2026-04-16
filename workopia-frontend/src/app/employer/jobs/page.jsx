"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJobs, deleteJob } from "@/service/jobService";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import { FiPlus, FiSearch, FiTrash2, FiEdit3, FiBriefcase, FiMapPin, FiUsers, FiDollarSign, FiClock, FiX, FiAlertTriangle } from "react-icons/fi";

export default function EmployerJobs() {
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [deleteTitle, setDeleteTitle] = useState("");
    const [deleting, setDeleting] = useState(false);

    // 🔍 Debounce search
    useEffect(() => {
        const delay = setTimeout(() => setSearch(searchInput), 600);
        return () => clearTimeout(delay);
    }, [searchInput]);

    useEffect(() => setPage(1), [search]);

    // 📡 Fetch jobs
    const fetchJobs = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await getJobs({ page: pageNumber, title: search });

            if (res.data.success) {
                const data = res.data.jobPosts;
                setJobs(data?.data || []);
                setPagination({
                    current_page: data?.current_page || 1,
                    last_page: data?.last_page || 1,
                    total: data?.total || 0,
                });
            }
        } catch (err) {
            console.error("Fetch Jobs Error:", err);
            toast.error("Failed to load your job listings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(page);
    }, [page, search]);

    // ❌ Delete
    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteJob(deleteId);
            toast.success("Job listing deleted");
            setDeleteId(null);
            fetchJobs(page);
        } catch (err) {
            console.error("Delete Error:", err);
            toast.error("Could not delete this job");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Job Listings</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Create, manage, and track your open positions.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative w-full sm:w-72 group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your jobs..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none shadow-sm"
                        />
                    </div>
                    <Link
                        href="/employer/jobs/create"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                    >
                        <FiPlus className="w-5 h-5" />
                        Post New Job
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                {loading && jobs.length === 0 ? (
                    <Loader text="Loading your job listings..." />
                ) : jobs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4">
                            <FiBriefcase className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-500">No Jobs Posted Yet</h3>
                        <p className="text-sm text-gray-400 mt-1 italic max-w-xs">Start attracting talent by posting your first job listing.</p>
                        <Link href="/employer/jobs/create" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all">
                            Post Your First Job
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 uppercase tracking-widest text-[10px] font-black text-gray-400">
                                    <th className="px-8 py-5">Position</th>
                                    <th className="px-8 py-5">Details</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                                                    <FiBriefcase className="w-5 h-5" />
                                                </div>
                                                <div className="max-w-[220px]">
                                                    <p className="text-sm font-extrabold text-gray-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
                                                        {job.title}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                                        <FiMapPin className="w-3 h-3 shrink-0" />
                                                        {job.location || "Remote"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                                    <FiDollarSign className="w-3 h-3" />
                                                    {job.salary || "Not disclosed"}
                                                </span>
                                                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                                    <FiClock className="w-3 h-3" />
                                                    {job.job_type || "Full-time"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={job.status ? "success" : "danger"}>
                                                {job.status ? "Active" : "Closed"}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                                                <Link
                                                    href={`/employer/applications?job_id=${job.id}`}
                                                    className="px-3 py-2 text-[11px] font-extrabold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-1"
                                                >
                                                    <FiUsers className="w-3.5 h-3.5" />
                                                    Applicants
                                                </Link>
                                                <Link
                                                    href={`/employer/jobs/${job.id}`}
                                                    className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Job"
                                                >
                                                    <FiEdit3 className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => { setDeleteId(job.id); setDeleteTitle(job.title); }}
                                                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Job"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && pagination.last_page > 1 && (
                    <div className="border-t border-gray-50 bg-slate-50/20 py-4">
                        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={() => setDeleteId(null)}>
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mx-auto mb-6">
                            <FiAlertTriangle className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Job Listing?</h3>
                        <p className="text-sm text-gray-400 text-center mb-8">
                            Permanently remove <span className="font-bold text-gray-700">"{deleteTitle}"</span>? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-2xl text-sm font-extrabold hover:bg-slate-100 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-sm font-extrabold hover:bg-red-700 hover:shadow-xl hover:shadow-red-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}