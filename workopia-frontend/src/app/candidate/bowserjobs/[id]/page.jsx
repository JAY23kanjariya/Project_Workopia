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
    FiShield, FiInfo, FiExternalLink, FiGlobe, FiTool, FiBookOpen 
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

    const formattedSalary = () => {
        if (job.salary_type === "Negotiable") return "Negotiable";
        if (job.salary_type === "Fixed") return `₹${Number(job.min_salary).toLocaleString()}`;
        return `₹${Number(job.min_salary).toLocaleString()} - ₹${Number(job.max_salary).toLocaleString()}`;
    };

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
                        <Badge variant="purple" className="px-3 py-1 text-[10px] uppercase font-black tracking-widest">
                            {job.employment_type}
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
                    <div className="shrink-0 w-24 h-24 rounded-[2.5rem] bg-white border-2 border-indigo-50 flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100/50 text-4xl font-black ring-4 ring-indigo-50/30">
                        {job.company_name?.[0].toUpperCase() || job.employer?.name?.[0].toUpperCase() || "W"}
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <FiGlobe className="w-4 h-4" />
                                </div>
                                {job.company_name}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                                    <FiMapPin className="w-4 h-4" />
                                </div>
                                {job.city}, {job.state}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <FiLayers className="w-4 h-4" />
                                </div>
                                {job.work_mode}
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
                            : "bg-black text-white hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 w-full lg:w-auto justify-center"
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
                                Apply for Position
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
                    
                    {/* Key Requirements Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center space-y-2 group hover:border-indigo-100 transition-all">
                            <FiUsers className="w-6 h-6 mx-auto text-indigo-400 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-black text-slate-900">{job.openings_count} Openings</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center space-y-2 group hover:border-emerald-100 transition-all">
                            <FiTool className="w-6 h-6 mx-auto text-emerald-400 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-black text-slate-900">{job.min_experience}-{job.max_experience} Yrs Exp</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center space-y-2 group hover:border-rose-100 transition-all">
                            <FiBookOpen className="w-6 h-6 mx-auto text-rose-400 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-black text-slate-900 truncate px-1">{job.education_qualification}</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center space-y-2 group hover:border-amber-100 transition-all">
                            <FiCalendar className="w-6 h-6 mx-auto text-amber-400 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-black text-slate-900">{job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'Rolling'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden p-10 sm:p-14 ring-1 ring-slate-100 relative">
                        <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-50">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                <FiInfo className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Job Scope & Requirements</h3>
                                <p className="text-xs font-bold text-slate-400">Comprehensive breakdown of the opportunity.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-12">
                            <div className="prose prose-indigo max-w-none text-slate-600 font-medium leading-loose whitespace-pre-line text-[16px]">
                                {job.description}
                            </div>

                            <div className="space-y-6 pt-10 border-t border-slate-50">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Preferred Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.required_skills?.split(',').map((skill, i) => (
                                        <div key={i} className="px-5 py-3 bg-slate-50 text-slate-600 text-xs font-black rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-white transition-all cursor-default">
                                            {skill.trim()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Information */}
                    <div className="bg-slate-50 rounded-[3rem] p-10 sm:p-14 space-y-8 border border-slate-100">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-black text-xl">
                                    {job.company_name?.[0]}
                                </div>
                                <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">About {job.company_name}</h3>
                            </div>
                            {job.company_website && (
                                <a href={job.company_website} target="_blank" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-black transition-colors">
                                    Official Website <FiExternalLink className="w-4 h-4" />
                                </a>
                            )}
                         </div>
                         <p className="text-slate-600 font-medium leading-relaxed">
                            {job.company_description}
                         </p>
                    </div>
                </div>

                {/* 📊 Right: Sidebar Stats */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Insights */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6 ring-1 ring-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">Activity Insights</h3>
                        <div className="space-y-6 pb-2">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform font-bold">
                                        <FiUsers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{job.applications_count || 0}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applicants</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FiCheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Verified</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted by {job.employer?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Apply CTA (Mobile optimized display) */}
                        {!job.has_applied && (
                            <button onClick={handleApply} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-95">
                                Submit Application
                            </button>
                        )}
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-slate-200 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                            <FiDollarSign className="w-32 h-32" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-4 relative">Quick Stats</h3>
                        
                        <div className="space-y-8 relative">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400">
                                    <FiLayers className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Role Type</p>
                                    <p className="text-sm font-bold mt-1">{job.employment_type}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400">
                                    <FiDollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Annual CTC</p>
                                    <p className="text-lg font-black mt-1 text-emerald-50">{formattedSalary()}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-rose-400">
                                    <FiMapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Settlement</p>
                                    <p className="text-sm font-bold mt-1 capitalize">{job.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assistance Card */}
                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 text-center space-y-3 ring-1 ring-slate-100 shadow-sm">
                        <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Need help?</h5>
                        <p className="text-xs text-slate-400 font-medium">Our support team is always available to help with your application.</p>
                        <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-black transition-colors block mx-auto pt-2 border-b border-indigo-100">Contact Support</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
