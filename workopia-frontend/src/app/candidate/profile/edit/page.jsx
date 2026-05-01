"use client";

import { useEffect, useState } from "react";
import { getCandidateProfile, updateCandidateProfile } from "@/service/candidateService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { 
    FiArrowLeft, FiSave, FiUser, FiPhone, FiBook, FiAward, 
    FiBriefcase, FiFileText, FiLinkedin, FiGithub, FiGlobe, 
    FiCheckCircle, FiInfo, FiActivity
} from "react-icons/fi";

const profileValidationSchema = Yup.object().shape({
    phone_number: Yup.string().required("Contact number is required").min(10, "Invalid phone number"),
    bio: Yup.string().required("Professional bio is required").min(50, "Bio should be at least 50 characters"),
    degree: Yup.string().required("Current degree is required"),
    specialization: Yup.string().required("Major/Specialization is required"),
    college_name: Yup.string().required("Institution name is required"),
    cgpa: Yup.number().required("Academic performance (CGPA) is required").max(10, "Invalid CGPA"),
    experience: Yup.number().required("Work experience in years is required"),
    resume_link: Yup.string().url("Must be a valid URL link to your resume"),
    portfolio_link: Yup.string().url("Must be a valid URL"),
    linkedin_link: Yup.string().url("Must be a valid URL"),
    github_link: Yup.string().url("Must be a valid URL"),
});

export default function EditProfilePage() {
    const router = useRouter();
    const [initialValues, setInitialValues] = useState({
        phone_number: "",
        bio: "",
        degree: "",
        specialization: "",
        college_name: "",
        cgpa: "",
        experience: "",
        resume_link: "",
        portfolio_link: "",
        linkedin_link: "",
        github_link: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getCandidateProfile();
                if (res.data && res.data.data) {
                    const p = res.data.data;
                    setInitialValues({
                        phone_number: p.phone_number || "",
                        bio: p.bio || "",
                        degree: p.degree || "",
                        specialization: p.specialization || "",
                        college_name: p.college_name || "",
                        cgpa: p.cgpa || "",
                        experience: p.experience || "",
                        resume_link: p.resume_link || "",
                        portfolio_link: p.portfolio_link || "",
                        linkedin_link: p.linkedin_link || "",
                        github_link: p.github_link || "",
                    });
                }
            } catch (err) {
                console.log("No existing profile or error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        const loadingToast = toast.loading("Saving professional mapping...");
        try {
            await updateCandidateProfile(values);
            toast.success("Profile mapped successfully!", { id: loadingToast });
            router.push("/candidate/profile");
        } catch (err) {
            console.error("Save Error:", err);
            toast.error(err.response?.data?.message || "Failed to save profile", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader text="Preparing your professional workspace..." />;

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 py-12 px-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Link href="/candidate/profile" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-4">
                        <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Profile
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Edit Professional Identity
                    </h1>
                </div>
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl hidden md:block">
                    <FiActivity className="w-8 h-8" />
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={profileValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-10">
                        
                        {/* Section 1: Core Professional Bio */}
                        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm space-y-8 ring-1 ring-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><FiUser className="w-4 h-4" /></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Career Overview</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Primary Contact Number</label>
                                    <Field name="phone_number" className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none" placeholder="+1 (555) 000-0000" />
                                    {errors.phone_number && touched.phone_number && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.phone_number}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Professional Focus (Title)</label>
                                    <Field name="specialization" className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none" placeholder="e.g. Senior Backend Engineer" />
                                    {errors.specialization && touched.specialization && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.specialization}</p>}
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Executive Summary / Bio</label>
                                    <Field as="textarea" name="bio" rows="5" className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none resize-none" placeholder="Summarize your professional journey and key achievements..." />
                                    {errors.bio && touched.bio && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.bio}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Academic & Experience Mapping */}
                        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm space-y-8 ring-1 ring-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><FiBook className="w-4 h-4" /></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Background Mapping</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Educational Institution</label>
                                    <Field name="college_name" className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none" placeholder="University of Technology" />
                                    {errors.college_name && touched.college_name && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.college_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Degree Earned</label>
                                    <Field name="degree" className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none" placeholder="Bachelor of Science in CS" />
                                    {errors.degree && touched.degree && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.degree}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">CGPA / Grade</label>
                                    <Field name="cgpa" className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none" placeholder="e.g. 9.0 / 10" />
                                    {errors.cgpa && touched.cgpa && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.cgpa}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Years of Experience</label>
                                    <Field name="experience" className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none" placeholder="e.g. 5" />
                                    {errors.experience && touched.experience && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.experience}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Portfolio & Digital Sync */}
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white space-y-8 shadow-2xl shadow-slate-100">
                             <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/10 text-indigo-400 rounded-xl"><FiGlobe className="w-4 h-4" /></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Digital Portfolio</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiLinkedin className="text-blue-400" />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">LinkedIn Profile</label>
                                    </div>
                                    <Field name="linkedin_link" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-semibold focus:bg-white/10 transition-all outline-none text-white" placeholder="https://linkedin.com/in/username" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiGithub className="text-slate-200" />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">GitHub Profile</label>
                                    </div>
                                    <Field name="github_link" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-semibold focus:bg-white/10 transition-all outline-none text-white" placeholder="https://github.com/username" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiGlobe className="text-rose-400" />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Personal Website</label>
                                    </div>
                                    <Field name="portfolio_link" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-semibold focus:bg-white/10 transition-all outline-none text-white" placeholder="https://yourwebsite.com" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FiFileText className="text-emerald-400" />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Direct Resume Link (Cloud)</label>
                                    </div>
                                    <Field name="resume_link" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-semibold focus:bg-white/10 transition-all outline-none text-white" placeholder="Google Drive / Dropbox Link" />
                                    <p className="text-[9px] font-bold text-slate-500 mt-2 flex items-center gap-1 opacity-60">
                                        <FiInfo className="text-indigo-400" />
                                        Tip: Convert your PDF to a link at <a href="https://resumelink.co/" target="_blank" className="text-indigo-400 underline hover:text-white transition-colors">resumelink.co</a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200">
                             <div className="flex items-center gap-3 text-slate-400 font-medium text-xs">
                                 <FiInfo className="w-4 h-4 text-indigo-500" />
                                 All fields contribute to your overall profile strength.
                             </div>
                             <div className="flex items-center gap-4 w-full sm:w-auto">
                                <Link 
                                    href="/candidate/profile"
                                    className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 text-center"
                                >
                                    Discard Changes
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-black hover:shadow-2xl hover:shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <FiSave className="w-5 h-5" />
                                    Update Profile
                                </button>
                             </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
}
