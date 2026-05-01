"use client";

import { useEffect, useState } from "react";
import { getJobById, createJob, updateJob } from "@/service/jobService";
import { getCategories } from "@/service/categoriesService";
import { useRouter, useParams } from "next/navigation";
import jobFormValidationSchema from "./jobFormValidationSchema";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { Formik, Form, Field } from "formik";
import { toast } from "react-hot-toast";
import { 
    FiArrowLeft, FiSave, FiBriefcase, FiAlertCircle, FiCheckCircle, 
    FiX, FiMapPin, FiDollarSign, FiCalendar, FiUsers, FiGlobe, FiTool 
} from "react-icons/fi";

export default function JobForm({ isView = false }) {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const isEdit = !!id && !isView;

    const [categories, setCategories] = useState([]);
    const [initialValues, setInitialValues] = useState({
        title: "",
        category_id: "",
        location: "",
        description: "",
        status: 1,
        employment_type: "Full-time",
        city: "",
        state: "",
        country: "",
        work_mode: "On-site",
        salary_type: "Fixed",
        min_salary: "",
        max_salary: "",
        required_skills: "",
        min_experience: "",
        max_experience: "",
        education_qualification: "",
        openings_count: 1,
        application_deadline: "",
        company_name: "",
        company_description: "",
        company_website: "",
    });
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const catRes = await getCategories({ all: "true" });
                if (catRes.data.success) {
                    const cats = catRes.data.categories;
                    setCategories(Array.isArray(cats) ? cats : cats.data || []);
                }

                if (id) {
                    const jobRes = await getJobById(id);
                    if (jobRes.data.success && jobRes.data.jobPost) {
                        const j = jobRes.data.jobPost;
                        setInitialValues({
                            title: j.title || "",
                            category_id: j.category_id?.toString() || j.category?.id?.toString() || "",
                            location: j.location || "",
                            description: j.description || "",
                            status: j.status == true || j.status == 1 ? 1 : 0,
                            employment_type: j.employment_type || "Full-time",
                            city: j.city || "",
                            state: j.state || "",
                            country: j.country || "",
                            work_mode: j.work_mode || "On-site",
                            salary_type: j.salary_type || "Fixed",
                            min_salary: j.min_salary || "",
                            max_salary: j.max_salary || "",
                            required_skills: j.required_skills || "",
                            min_experience: j.min_experience || "",
                            max_experience: j.max_experience || "",
                            education_qualification: j.education_qualification || "",
                            openings_count: j.openings_count || 1,
                            application_deadline: j.application_deadline || "",
                            company_name: j.company_name || "",
                            company_description: j.company_description || "",
                            company_website: j.company_website || "",
                        });
                    }
                }
            } catch (err) {
                console.error("Load Error:", err);
                toast.error("Failed to load form data");
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [id]);

    const handleSubmit = async (values, { setSubmitting }) => {
        if (isView) return;
        const loadingToast = toast.loading(isEdit ? "Updating job..." : "Creating job...");
        try {
            // Clean up payload: convert empty strings to null for optional numeric/date fields
            // and ensure numbers are correctly typed
            const payload = { 
                ...values, 
                status: Number(values.status), 
                category_id: Number(values.category_id),
                min_salary: values.min_salary === "" ? null : Number(values.min_salary),
                max_salary: values.max_salary === "" ? null : Number(values.max_salary),
                min_experience: values.min_experience === "" ? null : Number(values.min_experience),
                max_experience: values.max_experience === "" ? null : Number(values.max_experience),
                openings_count: Number(values.openings_count),
                application_deadline: values.application_deadline === "" ? null : values.application_deadline,
                company_website: values.company_website === "" ? null : values.company_website
            };

            if (isEdit) {
                await updateJob(id, payload);
                toast.success("Job updated successfully", { id: loadingToast });
            } else {
                await createJob(payload);
                toast.success("Job created successfully", { id: loadingToast });
            }
            router.push("/employer/jobs");
        } catch (err) {
            console.error("Submit Error:", err);
            const msg = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(", ")
                : err.response?.data?.message || "Operation failed";
            toast.error(msg, { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    if (fetching) return <Loader text={isView ? "Retrieving job information..." : isEdit ? "Loading job details..." : "Preparing form..."} />;

    const inputStyle = (error, touched) => `w-full px-5 py-4 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 ${
        isView ? "bg-slate-50 border-transparent text-gray-600 cursor-not-allowed" :
        error && touched ? "bg-slate-50 border-red-200 focus:ring-red-50 focus:border-red-500" : 
        "bg-slate-50 border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
    }`;

    const labelStyle = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1 mb-2 block";

    const SectionHeader = ({ icon: Icon, title, desc }) => (
        <div className="flex items-center gap-4 mb-6 pt-4 border-t border-slate-50 first:border-0 first:pt-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{title}</h3>
                <p className="text-[10px] font-bold text-slate-400">{desc}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10 px-4">
            <div className="flex items-center justify-between">
                <Link href="/employer/jobs" className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                    <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Jobs
                </Link>
                <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${isView ? "bg-indigo-50 text-indigo-600" : isEdit ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                    {isView ? "Read Only" : isEdit ? "Edit Mode" : "New Listing"}
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-10 sm:p-14">
                <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-50">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-lg ${isView ? "bg-indigo-600 shadow-indigo-100" : "bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-200"}`}>
                        <FiBriefcase className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {isView ? "Job Preview" : isEdit ? "Update Listing" : "Create Opportunity"}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">Define the core details for your next professional role.</p>
                    </div>
                </div>

                <Formik initialValues={initialValues} enableReinitialize validationSchema={isView ? null : jobFormValidationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, errors, touched, values }) => (
                        <Form className="space-y-12">
                            {/* Section 1: Basic Info */}
                            <div className="space-y-6">
                                <SectionHeader icon={FiBriefcase} title="Core Details" desc="Job title, category, and basic work arrangement." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Job Title*</label>
                                        <Field name="title" disabled={isView} placeholder="e.g. Senior Frontend Engineer" className={inputStyle(errors.title, touched.title)} />
                                        {errors.title && touched.title && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.title}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Category*</label>
                                        <Field as="select" name="category_id" disabled={isView} className={inputStyle(errors.category_id, touched.category_id)}>
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </Field>
                                        {errors.category_id && touched.category_id && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.category_id}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Employment Type*</label>
                                        <Field as="select" name="employment_type" disabled={isView} className={inputStyle(errors.employment_type, touched.employment_type)}>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Contract">Contract</option>
                                        </Field>
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Work Mode*</label>
                                        <Field as="select" name="work_mode" disabled={isView} className={inputStyle(errors.work_mode, touched.work_mode)}>
                                            <option value="On-site">On-site</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Location */}
                            <div className="space-y-6">
                                <SectionHeader icon={FiMapPin} title="Geography" desc="Where the candidate will be based." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-1">
                                        <label className={labelStyle}>General Location (HQ)*</label>
                                        <Field name="location" disabled={isView} placeholder="e.g. Silicon Valley, CA" className={inputStyle(errors.location, touched.location)} />
                                        {errors.location && touched.location && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.location}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>City*</label>
                                        <Field name="city" disabled={isView} className={inputStyle(errors.city, touched.city)} />
                                        {errors.city && touched.city && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.city}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>State/Province*</label>
                                        <Field name="state" disabled={isView} className={inputStyle(errors.state, touched.state)} />
                                        {errors.state && touched.state && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.state}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Country*</label>
                                        <Field name="country" disabled={isView} className={inputStyle(errors.country, touched.country)} />
                                        {errors.country && touched.country && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.country}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Salary & Scope */}
                            <div className="space-y-6">
                                <SectionHeader icon={FiDollarSign} title="Compensation & Timeline" desc="Salary expectations and application window." />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Salary Type*</label>
                                        <Field as="select" name="salary_type" disabled={isView} className={inputStyle(errors.salary_type, touched.salary_type)}>
                                            <option value="Fixed">Fixed Amount</option>
                                            <option value="Range">Salary Range</option>
                                            <option value="Negotiable">Negotiable</option>
                                        </Field>
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Min Salary (INR)</label>
                                        <Field name="min_salary" type="number" disabled={isView} className={inputStyle(errors.min_salary, touched.min_salary)} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Max Salary (INR)</label>
                                        <Field name="max_salary" type="number" disabled={isView} className={inputStyle(errors.max_salary, touched.max_salary)} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Openings Count*</label>
                                        <Field name="openings_count" type="number" disabled={isView} className={inputStyle(errors.openings_count, touched.openings_count)} />
                                        {errors.openings_count && touched.openings_count && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.openings_count}</p>}
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className={labelStyle}>Application Deadline</label>
                                        <Field name="application_deadline" type="date" disabled={isView} className={inputStyle(errors.application_deadline, touched.application_deadline)} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Requirements */}
                            <div className="space-y-6">
                                <SectionHeader icon={FiTool} title="Candidate Profile" desc="Required skills, experience, and education." />
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Required Skills* (Comma separated)</label>
                                        <Field name="required_skills" disabled={isView} placeholder="React, Node.js, Tailwind, AWS" className={inputStyle(errors.required_skills, touched.required_skills)} />
                                        {errors.required_skills && touched.required_skills && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.required_skills}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className={labelStyle}>Min Exp (Years)</label>
                                            <Field name="min_experience" type="number" disabled={isView} className={inputStyle(errors.min_experience, touched.min_experience)} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelStyle}>Max Exp (Years)</label>
                                            <Field name="max_experience" type="number" disabled={isView} className={inputStyle(errors.max_experience, touched.max_experience)} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Education Qualification*</label>
                                        <Field name="education_qualification" disabled={isView} placeholder="e.g. B.Tech in CS or Equivalent Experience" className={inputStyle(errors.education_qualification, touched.education_qualification)} />
                                        {errors.education_qualification && touched.education_qualification && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.education_qualification}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Company */}
                            <div className="space-y-6">
                                <SectionHeader icon={FiGlobe} title="Company Information" desc="Identity and portal for the employer." />
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className={labelStyle}>Company Name*</label>
                                            <Field name="company_name" disabled={isView} className={inputStyle(errors.company_name, touched.company_name)} />
                                            {errors.company_name && touched.company_name && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.company_name}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelStyle}>Website URL</label>
                                            <Field name="company_website" disabled={isView} placeholder="https://company.com" className={inputStyle(errors.company_website, touched.company_website)} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelStyle}>Company Overview*</label>
                                        <Field as="textarea" name="company_description" rows="3" disabled={isView} className={inputStyle(errors.company_description, touched.company_description) + " resize-none"} />
                                        {errors.company_description && touched.company_description && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.company_description}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 6: Full Job Description */}
                            <div className="space-y-6">
                                <SectionHeader icon={FiBriefcase} title="Full Job Description" desc="Detailed breakdown of rules, responsibilities, and culture." />
                                <div className="space-y-1">
                                    <Field as="textarea" name="description" rows="10" disabled={isView} className={inputStyle(errors.description, touched.description) + " resize-none"} />
                                    {errors.description && touched.description && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.description}</p>}
                                </div>
                            </div>

                            {/* Section 7: Listing Status */}
                            <div className="space-y-6">
                                <SectionHeader icon={FiCheckCircle} title="Visibility" desc="Control whether this job is public or hidden." />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`flex items-center justify-center gap-3 p-5 rounded-[2rem] border-2 transition-all cursor-pointer ${values.status == 1 ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xl shadow-emerald-100/20" : "border-slate-50 bg-slate-50 text-slate-400 opacity-60"
                                        } ${isView ? "pointer-events-none cursor-not-allowed" : ""}`}>
                                        <Field type="radio" name="status" value="1" disabled={isView} className="hidden" />
                                        <FiCheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-black">Active Listing</span>
                                    </label>
                                    <label className={`flex items-center justify-center gap-3 p-5 rounded-[2rem] border-2 transition-all cursor-pointer ${values.status == 0 ? "border-amber-500 bg-amber-50 text-amber-700 shadow-xl shadow-amber-100/20" : "border-slate-50 bg-slate-50 text-slate-400 opacity-60"
                                        } ${isView ? "pointer-events-none cursor-not-allowed" : ""}`}>
                                        <Field type="radio" name="status" value="0" disabled={isView} className="hidden" />
                                        <FiX className="w-5 h-5" />
                                        <span className="text-sm font-black">Closed / Hidden</span>
                                    </label>
                                </div>
                            </div>

                            {/* Validation Error Summary */}
                            {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                                <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-start gap-4 animate-in fade-in zoom-in duration-300">
                                    <FiAlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-black text-rose-900 uppercase tracking-wider mb-1">Incomplete Information</p>
                                        <p className="text-xs font-bold text-rose-600 italic">Please check all sections. Some required fields (like {Object.keys(errors).slice(0, 3).join(", ").replace(/_/g, ' ')}) still need your attention.</p>
                                    </div>
                                </div>
                            )}

                            {!isView && (
                                <div className="pt-10 flex gap-4">
                                    <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-black hover:shadow-2xl transition-all disabled:opacity-50 active:scale-95">
                                        <FiSave className="w-5 h-5" />
                                        {isEdit ? "Update Job " : "Create Job"}
                                    </button>
                                    <button type="button" onClick={() => router.push("/employer/jobs")} className="px-10 py-5 bg-slate-50 text-slate-500 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
