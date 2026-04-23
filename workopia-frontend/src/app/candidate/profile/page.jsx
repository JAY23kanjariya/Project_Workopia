"use client";

import { useEffect, useState } from "react";
import { getCandidateProfile } from "@/service/candidateService";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import {
    FiEdit3, FiPhone, FiMail, FiCheckCircle, FiLinkedin, FiGithub,
    FiGlobe, FiBook, FiAward, FiBriefcase, FiFileText, FiUser,
    FiPlusCircle, FiArrowRight, FiExternalLink
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

    if (loading) return <Loader text="Searching for your profile..." />;

    if (error === "PI_NOT_FOUND") {
        return (
            <div className="max-w-4xl mx-auto py-32 px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-100 text-indigo-500 border border-indigo-50">
                    <FiUser className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Setup Your Profile, {user?.name}</h1>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium">Create a stunning profile to catch the eyes of top recruiters.</p>
                </div>
                <Link
                    href="/candidate/profile/edit"
                    className="inline-flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-black hover:shadow-2xl transition-all active:scale-95"
                >
                    <FiPlusCircle className="w-5 h-5" />
                    Complete Profile
                </Link>
            </div>
        );
    }

    if (!profile) return null;

    const displayUser = profile.user || user;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">

            {/* 🏷️ Stable Hero Section */}
            <div className="relative">
                {/* Banner */}
                <div className="h-64 sm:h-72 w-full bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-indigo-200/50"></div>

                {/* Profile Header Content */}
                <div className="max-w-5xl mx-auto px-6 sm:px-12 -mt-50 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10">
                    {/* Avatar */}
                    <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl flex items-center justify-center border-4 border-white relative z-10">
                        <div className="w-full h-full rounded-[2rem] bg-slate-50 flex items-center justify-center text-6xl font-black text-indigo-600 uppercase">
                            {displayUser?.name?.[0]}
                        </div>
                    </div>

                    {/* Identity Info */}
                    <div className="flex-1 text-center sm:text-left pb-4 sm:pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                            <h1 className="text-3xl sm:text-5xl font-black text-white capitalize tracking-tight flex items-center gap-3">
                                {displayUser?.name}
                                <FiCheckCircle className="text-indigo-500 w-6 h-6 sm:w-8 sm:h-8" />
                            </h1>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 shadow-sm">
                                {profile.specialization || "Talented Professional"}
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pb-6">
                        <Link
                            href="/candidate/profile/edit"
                            className="flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-indigo-600 hover:scale-105 transition-all shadow-2xl shadow-slate-200 active:scale-95"
                        >
                            <FiEdit3 className="w-5 h-5" />
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* 👤 Professional Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Side: Professional Resume */}
                <div className="lg:col-span-8 space-y-10">

                    {/* About Section */}
                    <section className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-indigo-900 translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-1000">
                            <FiUser className="w-40 h-40" />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <FiUser className="w-6 h-6" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Professional Bio</h3>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed text-lg sm:text-xl relative z-10 italic">
                            "{profile.bio || "No professional bio provided yet. Update your profile to tell employers about your expertise."}"
                        </p>
                    </section>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Academic Card */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6 relative group hover:border-indigo-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <FiBook className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-indigo-200 transition-colors">Education</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-lg font-black text-slate-900">{profile.degree || "Degree Unspecified"}</p>
                                    <p className="text-sm font-bold text-slate-400 mt-1">{profile.college_name || "Institution Name"}</p>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-indigo-100">
                                    <FiAward className="w-4 h-4" /> CGPA: {profile.cgpa || "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* Experience Card */}
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6 relative group hover:border-emerald-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <FiBriefcase className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-emerald-200 transition-colors">Career</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-lg font-black text-slate-900">{profile.experience} Years Active</p>
                                    <p className="text-sm font-bold text-slate-400 mt-1">Ready for impact</p>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                                    <FiCheckCircle className="w-4 h-4" /> Market Ready
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Network & Docs */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white space-y-10 shadow-2xl shadow-indigo-100 border border-white/5">
                        <div className="space-y-10">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                Contact
                            </h3>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group">
                                    <div className="min-w-[48px] h-[48px] flex items-center justify-center bg-white/5 text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <FiMail className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Professional Email</p>
                                        <p className="text-sm font-bold truncate text-slate-200">{displayUser?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="min-w-[48px] h-[48px] flex items-center justify-center bg-white/5 text-emerald-400 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                        <FiPhone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Direct Phone</p>
                                        <p className="text-sm font-bold text-slate-200">{profile.phone_number || "Not Visible"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Digital Handles */}
                            {(profile.linkedin_link || profile.github_link || profile.portfolio_link) && (
                                <div className="pt-10 border-t border-white/5 space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Links</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {profile.linkedin_link && (
                                            <a href={profile.linkedin_link} target="_blank" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 hover:bg-white hover:text-indigo-600 transition-all hover:-translate-y-1">
                                                <FiLinkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {profile.github_link && (
                                            <a href={profile.github_link} target="_blank" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-all hover:-translate-y-1">
                                                <FiGithub className="w-5 h-5" />
                                            </a>
                                        )}
                                        {profile.portfolio_link && (
                                            <a href={profile.portfolio_link} target="_blank" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-rose-400 hover:bg-white hover:text-rose-600 transition-all hover:-translate-y-1">
                                                <FiGlobe className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Final CTA: Resume */}
                    {profile.resume_link && (
                        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col items-center text-center space-y-6 shadow-xl shadow-indigo-100 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 translate-x-4 -translate-y-4">
                                <FiFileText className="w-24 h-24" />
                            </div>
                            <h5 className="font-black text-xl tracking-tight">Need my resume?</h5>
                            <p className="text-[11px] font-black uppercase tracking-widest text-indigo-200">PDF Document • {new Date().getFullYear()}</p>
                            <a
                                href={profile.resume_link}
                                target="_blank"
                                className="w-full py-5 bg-white text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                Download Now <FiExternalLink className="inline-block ml-2 w-4 h-4 mb-1" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
