"use client";

import { use, useEffect, useState } from "react";
import { getJobs, adminDeleteJob } from "@/service/jobService";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import { FiSearch, FiTrash2, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiEye, FiUser } from "react-icons/fi";

export default function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

     // 📡 Fetch jobs
    const fetchAllJobs = async (pageNumber = 1) => {
        try {
            setLoading(true);
            setError(null);

            const res = await getJobs({
                page: pageNumber,
                title: search,
            });

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
            setError("Could not load job listings. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    // 🔍 Debounce search
    useEffect(() => {
        const delay = setTimeout(() => setSearch(searchInput), 600);
        return () => clearTimeout(delay);
    }, [searchInput]);

    // Reset page on search
    useEffect(() => setPage(1), [search]);

    useEffect(() => {
        fetchAllJobs(page);
    }, [page, search]);

   

    

    // ❌ Delete job
    const handleDelete = async (id, title) => {
        if (!confirm(`Permanently delete "${title}"? This action cannot be undone.`)) return;

        try {
            setDeletingId(id);
            await adminDeleteJob(id);
            toast.success("Job listing removed");
            fetchAllJobs(page);
        } catch (err) {
            console.error("Delete Error:", err);
            toast.error("Could not delete this job listing");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Job Listings</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Monitor and moderate all postings across the platform.</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by job title..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none shadow-sm"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                {loading && jobs.length === 0 ? (
                    <Loader text="Scanning job database..." />
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
                            <FiBriefcase className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{error}</h3>
                        <button onClick={() => fetchAllJobs(page)} className="mt-4 text-indigo-600 font-bold hover:underline">Retry</button>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4">
                            <FiBriefcase className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-500">No Job Listings Found</h3>
                        <p className="text-sm text-gray-400 mt-1 italic">Adjust your search or wait for employers to post new opportunities.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className=" ">
                                    <th className="px-8 py-5">Position</th>
                                    <th className="px-8 py-5">Employer</th>
                                    <th className="px-8 py-5">Category</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="group hover:bg-blue-50/30 transition-colors">
                                        {/* Position */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                                                    <FiBriefcase className="w-5 h-5" />
                                                </div>
                                                <div className="max-w-[200px]">
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

                                        {/* Employer */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-black">
                                                    {job.employer?.name?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">
                                                    {job.employer?.name || "Unknown"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Details */}
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                                    {job.category?.name || "Not disclosed"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-6">
                                            <Badge variant={job.status ? "success" : "danger"}>
                                                {job.status ? "Active" : "Closed"}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 transition-all">
                                                <button
                                                    onClick={() => handleDelete(job.id, job.title)}
                                                    disabled={deletingId === job.id}
                                                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all disabled:opacity-20"
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
                        <Pagination
                            pagination={pagination}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}