"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJobs } from "@/service/jobService";
import { getCategories } from "@/service/categoriesService";
import { applyForJob } from "@/service/applicationService";
import Loader from "@/components/ui/Loader";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { toast } from "react-hot-toast";
import { FiSearch, FiFilter, FiBriefcase, FiMapPin, FiClock, FiUser, FiArrowLeft, FiSend, FiLayers, FiX, FiInbox, FiCheckCircle } from "react-icons/fi";

export default function BrowseJobs() {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [applyingId, setApplyingId] = useState(null);

    // Debounce search
    useEffect(() => {
        const delay = setTimeout(() => setSearch(searchInput), 600);
        return () => clearTimeout(delay);
    }, [searchInput]);

    useEffect(() => setPage(1), [search, selectedCategory]);

    // Fetch categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getCategories({ all: "true" });
                if (res.data.success) {
                    const cats = res.data.categories;
                    setCategories(Array.isArray(cats) ? cats.filter(c => c.status === 1) : (cats.data || []).filter(c => c.status === 1));
                }
            } catch (err) {
                console.error("Categories Error:", err);
            }
        };
        loadCategories();
    }, []);

    // Fetch jobs
    const fetchJobs = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const params = { page: pageNumber, title: search };
            if (selectedCategory) params.category_id = selectedCategory;

            const res = await getJobs(params);
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
            toast.error("Could not load job listings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(page);
    }, [page, search, selectedCategory]);

    // Apply for job
    const handleApply = async (jobId, title) => {
        if (applyingId) return;
        const t = toast.loading("Submitting application...");
        try {
            setApplyingId(jobId);
            await applyForJob(jobId);
            toast.success(`Applied to "${title}" successfully!`, { id: t });
            
            // ✅ Update local state to show "Applied" immediately
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, has_applied: true } : j));
        } catch (err) {
            const msg = err.response?.data?.message || "Application failed";
            toast.error(msg, { id: t });
        } finally {
            setApplyingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <Link href="/candidate/dashboard" className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors mb-4 inline-flex">
                    <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Browse Opportunities</h1>
                <p className="text-gray-500 mt-1 font-medium italic">Find your next career move from {pagination.total || 0} open positions.</p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by job title..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none shadow-sm"
                    />
                </div>
                <div className="relative sm:w-60 group">
                    <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none shadow-sm appearance-none cursor-pointer font-semibold"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                {(search || selectedCategory) && (
                    <button onClick={() => { setSearchInput(""); setSelectedCategory(""); }} className="px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all flex items-center gap-2">
                        <FiX className="w-4 h-4" /> Clear
                    </button>
                )}
            </div>

            {/* Job Cards */}
            {loading && jobs.length === 0 ? (
                <Loader text="Scanning job listings..." />
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center p-20 text-center">
                    <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4"><FiInbox className="w-10 h-10" /></div>
                    <h3 className="text-lg font-bold text-gray-500">No Jobs Found</h3>
                    <p className="text-sm text-gray-400 mt-1 italic max-w-xs">Try adjusting your search or filters to discover more opportunities.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm p-7 hover:shadow-md hover:border-blue-100 transition-all flex flex-col">
                            {/* Top Row */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform">
                                        <FiBriefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                        <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                            <FiUser className="w-3 h-3" /> {job.employer?.name || "Company"}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant={job.status ? "success" : "disabled"}>{job.status ? "Open" : "Closed"}</Badge>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">{job.description || "No description available."}</p>

                            {/* Meta Tags */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-xl text-[11px] font-bold flex items-center gap-1"><FiMapPin className="w-3 h-3" />{job.location || "Remote"}</span>
                                {job.category && (
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-bold flex items-center gap-1"><FiLayers className="w-3 h-3" />{job.category.name}</span>
                                )}
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-xl text-[11px] font-bold flex items-center gap-1"><FiClock className="w-3 h-3" />{new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link href={`/candidate/bowserjobs/${job.id}`} className="flex-1 text-center py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-extrabold hover:bg-slate-100 transition-all active:scale-95">
                                    View Details
                                </Link>
                                {job.status ? (
                                    <button
                                        onClick={() => handleApply(job.id, job.title)}
                                        disabled={applyingId === job.id || job.has_applied}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold transition-all active:scale-95 disabled:opacity-50 ${
                                            job.has_applied 
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default" 
                                            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
                                        }`}
                                    >
                                        {job.has_applied ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiSend className="w-3.5 h-3.5" />}
                                        {applyingId === job.id ? "Applying..." : job.has_applied ? "Applied" : "Quick Apply"}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && pagination.last_page > 1 && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm py-4">
                    <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
                </div>
            )}
        </div>
    );
}
