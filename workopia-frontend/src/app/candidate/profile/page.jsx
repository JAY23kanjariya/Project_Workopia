"use client";

import { useEffect, useState } from "react";
import { getCandidateProfile } from "@/service/candidateService";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { 
    FiEdit3, FiPhone, FiMail, FiMapPin, FiLinkedin, FiGithub, 
    FiGlobe, FiBook, FiAward, FiBriefcase, FiFileText, FiUser,
    FiPlusCircle, FiArrowRight 
} from "react-icons/fi";

// Client-side cookie parser helper
const getUserFromCookie = () => {
    if (typeof window === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find(row => row.startsWith("user="));
    if (!userCookie) return null;
    try {
        return JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
    } catch {
        return null;
    }
};

export default function CandidateProfilePage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setUser(getUserFromCookie());
        const fetchProfile = async () => {
            try {
                const res = await getCandidateProfile();
                if (res.data) {
                    setProfile(res.data.data);
                }
            } catch (err) {
                console.error("Profile Fetch Error:", err);
                if (err.response?.status === 404) {
                    setError("PI_NOT_FOUND");
                } else {
                    setError("PI_ERROR");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <Loader text="Retrieving your professional profile..." />;

    if (error === "PI_NOT_FOUND") {
        return (
            <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100 text-indigo-500 border border-indigo-50">
                    <FiUser className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Setup Your Profile, {user?.name}</h1>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium">You haven't completed your professional profile yet. Complete it now to increase your chances of getting hired.</p>
                </div>
                <Link
                    href="/candidate/profile/edit"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl text-sm font-black hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all active:scale-95"
                >
                    <FiPlusCircle className="w-5 h-5" />
                    Complete Profile Now
                </Link>
            </div>
        );
    }

    if (!profile) return null;

    // Use user from profile relation if available, fallback to cookie
    const displayUser = profile.user || user;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 py-10 px-6 pb-20">
            {/* 🏷️ Hero / Cover Section */}
            <div className="relative">
                <div className="h-48 w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-[3rem] shadow-2xl shadow-indigo-100"></div>
                <div className="absolute -bottom-16 left-12 flex items-end gap-8">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-indigo-100/50 flex items-center justify-center border-4 border-white ring-1 ring-slate-100 uppercase text-4xl font-black text-indigo-600">
                        {displayUser?.name?.[0]}
                    </div>
                </div>
                <div className="absolute top-6 right-6">
                    <Link
                        href="/candidate/profile/edit"
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all border border-white/20"
                    >
                        <FiEdit3 className="w-4 h-4" />
                        Update Profile
                    </Link>
                </div>
            </div>

            {/* 👤 Identity Section */}
            <div className="pt-20 px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{displayUser?.name}</h1>
                        <p className="text-lg font-bold text-indigo-500 mt-1">{profile.specialization || "Talented Candidate"}</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 group-hover:scale-110 transition-transform duration-700">
                             <FiUser className="w-24 h-24" />
                         </div>
                         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">About me</h3>
                         <p className="text-slate-500 font-medium leading-relaxed max-w-2xl relative">
                            {profile.bio || "No professional bio provided yet. Add one in the edit section to stand out to employers."}
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Education */}
                         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600">
                                 <FiBook className="w-16 h-16" />
                             </div>
                             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                                 <FiBook className="w-4 h-4" /> Academic Mapping
                             </h3>
                             <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-black text-slate-900">{profile.degree}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1">{profile.college_name}</p>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    <FiAward className="w-3 h-3" /> CGPA: {profile.cgpa}
                                </div>
                             </div>
                         </div>

                         {/* Experience */}
                         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-600">
                                 <FiBriefcase className="w-16 h-16" />
                             </div>
                             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                                 <FiBriefcase className="w-4 h-4" /> Professional Tenure
                             </h3>
                             <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-black text-slate-900">{profile.experience} Years of Active Experience</p>
                                    <p className="text-xs font-bold text-slate-400 mt-1">Ready for next career milestone</p>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    <FiCheckCircle className="w-3 h-3" /> Industry Ready
                                </div>
                             </div>
                         </div>
                    </div>
                </div>

                {/* 📞 Contact & Links Sidebar */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl shadow-indigo-100">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-4">Secure Contact</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/5 text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <FiMail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Email Domain</p>
                                    <p className="text-sm font-bold truncate max-w-[150px]">{displayUser?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/5 text-rose-400 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                                    <FiPhone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Direct Line</p>
                                    <p className="text-sm font-bold whitespace-nowrap">{profile.phone_number || "Not Shared"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Digital Presence</h3>
                            <div className="flex flex-col gap-3">
                                {profile.linkedin_link && (
                                    <a href={profile.linkedin_link} target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white hover:text-indigo-600 transition-all hover:-translate-y-1">
                                        <span className="text-xs font-black uppercase tracking-widest">LinkedIn</span>
                                        <FiLinkedin className="w-4 h-4" />
                                    </a>
                                )}
                                {profile.github_link && (
                                    <a href={profile.github_link} target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white hover:text-black transition-all hover:-translate-y-1">
                                        <span className="text-xs font-black uppercase tracking-widest">GitHub</span>
                                        <FiGithub className="w-4 h-4" />
                                    </a>
                                )}
                                {profile.portfolio_link && (
                                    <a href={profile.portfolio_link} target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white hover:text-rose-600 transition-all hover:-translate-y-1">
                                        <span className="text-xs font-black uppercase tracking-widest">Portfolio</span>
                                        <FiGlobe className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resume Card */}
                    {profile.resume_link && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-4 shadow-sm group">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform active:scale-95">
                                <FiFileText className="w-8 h-8" />
                            </div>
                            <h5 className="font-black text-slate-900 tracking-tight">Active Resume Map</h5>
                            <p className="text-xs text-indigo-400 font-medium uppercase tracking-[0.2em]">Latest Professional Revision</p>
                            <a 
                                href={profile.resume_link} 
                                target="_blank" 
                                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-indigo-100"
                            >
                                Download Resume <FiArrowRight />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
