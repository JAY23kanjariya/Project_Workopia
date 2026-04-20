"use client";

import { useEffect, useState } from "react";
import { getJobById, applyToJob } from "@/service/jobService";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import { 
    FiArrowLeft, FiBriefcase, FiMapPin, FiCalendar, FiCheckCircle, 
    FiUsers, FiLayers, FiDollarSign, FiClock, FiSend, FiFlag, 
    FiShield, FiInfo, FiExternalLink 
} from "react-icons/fi";

export default function CandidateViewJob() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await getJobById(id);
                if (res.data.success) {
                    setJob(res.data.jobPost);
                } else {
                    router.push("/candidate/bowserjobs");
                }
            } catch (err) {
                console.error("Fetch Job Error:", err);
                router.push("/candidate/bowserjobs");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (job.has_applied) return;

        const loadingToast = toast.loading("Securely submitting your application...");
        setApplying(true);
        try {
            const res = await applyToJob(id);
            if (res.data.success) {
                toast.success("Application successful! You're in the running.", { id: loadingToast });
                setJob(prev => ({ ...prev, has_applied: true }));
            }
        } catch (err) {
            console.error("Apply Error:", err);
            toast.error(err.response?.data?.message || "Application submission failed", { id: loadingToast });
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <Loader text="Assembling job profile..." />;
    if (!job) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 py-12 px-6">
            
            {/* 🧭 Top Navigation & Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div className="space-y-4">
                    <Link href="/candidate/bowserjobs" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all">
                        <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Explore More Roles
                    </Link>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="indigo" className="px-3 py-1 text-[10px] uppercase font-black tracking-widest">
                            <FiInfo className="mr-1" /> Hiring Now
                        </Badge>
                        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                            <FiClock className="w-3.5 h-3.5" /> Published {new Date(job.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100" title="Report Issue">
                        <FiFlag className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100" title="Share Position">
                        <FiExternalLink className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 🚀 Main Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                <div className="flex items-start gap-6">
                    <div className="shrink-0 w-20 h-20 rounded-[2rem] bg-white border-2 border-indigo-50 flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100/50 text-3xl font-black ring-4 ring-indigo-50/30">
                        {job.employer?.name?.[0].toUpperCase() || "W"}
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                <FiBriefcase className="w-4 h-4 text-indigo-500" />
                                {job.employer?.name}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                <FiMapPin className="w-4 h-4 text-rose-500" />
                                {job.location || "Remote Workspace"}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                <FiLayers className="w-4 h-4 text-emerald-500" />
                                {job.category?.name || "Uncategorized"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <button
                        onClick={handleApply}
                        disabled={job.has_applied || applying}
                        className={`group px-10 py-5 rounded-[2rem] text-sm font-black transition-all flex items-center gap-3 shadow-2xl relative overflow-hidden ${
                            job.has_applied 
                            ? "bg-emerald-500 text-white shadow-emerald-200 cursor-default" 
                            : "bg-black text-white hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95"
                        }`}
                    >
                        {job.has_applied ? (
                             <>
                                <FiCheckCircle className="w-5 h-5 animate-bounce" />
                                Applied Successfully
                             </>
                        ) : (
                            <>
                                <FiSend className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                Apply for this Position
                            </>
                        )}
                    </button>
                    <p className="text-[10px] text-center mt-3 font-black uppercase tracking-widest text-slate-300 flex items-center justify-center gap-2">
                        <FiShield className="w-3 h-3" /> Secure Application
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* 📝 Left: Job Content */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-12 ring-1 ring-slate-100 relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 opacity-50"></div>
                        
                        <div className="flex items-center gap-4 mb-10 relative">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <FiInfo className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Job Description & Scope</h3>
                                <p className="text-xs font-bold text-slate-400">Detailed overview of responsibilities and requirements.</p>
                            </div>
                        </div>
                        
                        <div className="prose prose-indigo max-w-none text-slate-600 font-medium leading-loose whitespace-pre-line text-[16px] relative">
                            {job.description}
                        </div>
                    </div>
                    
                    {/* Additional highlight card */}
                    <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                        <FiBriefcase className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative">
                            <h4 className="text-xl font-black tracking-tight">Ready to join {job.employer?.name}?</h4>
                            <p className="text-indigo-100 text-sm font-medium mt-1">Join a community of thousands of talented professionals.</p>
                        </div>
                        <button 
                            onClick={handleApply}
                            disabled={job.has_applied}
                            className={`px-8 py-4 bg-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 relative ${
                                job.has_applied ? "text-emerald-500 cursor-not-allowed" : "text-indigo-600 hover:bg-slate-50"
                            }`}
                        >
                            {job.has_applied ? "Application Sent" : "Submit Details"}
                        </button>
                    </div>
                </div>

                {/* 📊 Right: Sidebar Stats & Info */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Application Stats */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6 ring-1 ring-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">Activity Insights</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform font-bold">
                                        <FiUsers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{job.applications_count || 0}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Applicants</p>
                                    </div>
                                </div>
                                <div className="text-blue-500 opacity-20"><FiUsers className="w-6 h-6" /></div>
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FiCheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Verified</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employer Status</p>
                                    </div>
                                </div>
                                <div className="text-emerald-500 opacity-20"><FiShield className="w-6 h-6" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Metadata List */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-slate-200">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-4">Quick Breakdown</h3>
                        
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <FiLayers className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-black tracking-widest uppercase opacity-50">Department</p>
                                    <p className="text-sm font-bold mt-0.5">{job.category?.name || "General Office"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <FiDollarSign className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-black tracking-widest uppercase opacity-50">Compensation</p>
                                    <p className="text-sm font-bold mt-0.5">{job.salary || "Competitive Salary"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <FiMapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-black tracking-widest uppercase opacity-50">Work Environment</p>
                                    <p className="text-sm font-bold mt-0.5">{job.location || "Remote/Office"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assistance Card */}
                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 text-center space-y-3 ring-1 ring-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <FiInfo className="w-6 h-6" />
                        </div>
                        <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Need help?</h5>
                        <p className="text-xs text-slate-400 font-medium">Our support team is always available to help with your application.</p>
                        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-black transition-colors block mx-auto pt-2 border-b border-indigo-100">Contact Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
