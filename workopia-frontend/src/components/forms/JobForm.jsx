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
import { FiArrowLeft, FiSave, FiBriefcase, FiAlertCircle, FiCheckCircle, FiX, FiEdit3 } from "react-icons/fi";

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
    });
    const [fetching, setFetching] = useState(true);

    const validationSchema = jobFormValidationSchema;

    // Fetch categories + job data (if editing or viewing)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch categories
                const catRes = await getCategories({ all: "true" });
                if (catRes.data.success) {
                    const cats = catRes.data.categories;
                    setCategories(Array.isArray(cats) ? cats : cats.data || []);
                }

                // If editing or viewing, fetch job details
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
            const payload = { ...values, status: Number(values.status), category_id: Number(values.category_id) };

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

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10 px-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/employer/jobs" className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                    <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Jobs
                </Link>
                <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${isView ? "bg-indigo-50 text-indigo-600" : isEdit ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                    {isView ? "Read Only" : isEdit ? "Edit Mode" : "New Listing"}
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${isView ? "bg-indigo-600 shadow-indigo-100" : "bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-200"
                        }`}>
                        <FiBriefcase className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {isView ? "Job Details" : isEdit ? "Edit Job Listing" : "Post a New Job"}
                        </h2>
                        <p className="text-sm text-gray-400 font-medium italic">
                            {isView ? "Detailed view of information shared with candidates." : "Attract the right talent for your organization."}
                        </p>
                    </div>
                </div>

                <Formik initialValues={initialValues} enableReinitialize validationSchema={isView ? null : validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, errors, touched, values, setFieldValue, setFieldTouched }) => (
                        <Form className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Job Title</label>
                                <Field
                                    name="title"
                                    disabled={isView}
                                    placeholder="e.g. Senior React Developer"
                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 ${isView ? "bg-slate-50 border-transparent text-gray-600 cursor-not-allowed" :
                                        errors.title && touched.title ? "bg-slate-50 border-red-200 focus:ring-red-50 focus:border-red-500" : "bg-slate-50 border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                />
                                {!isView && errors.title && touched.title && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.title}</div>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Category</label>
                                <Field
                                    as="select"
                                    name="category_id"
                                    disabled={isView}
                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 ${isView ? "bg-slate-50 border-transparent text-gray-600 appearance-none cursor-not-allowed" :
                                        errors.category_id && touched.category_id ? "bg-slate-50 border-red-200 focus:ring-red-50 focus:border-red-500" : "bg-slate-50 border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.filter(c => c.status === 1 || c.id == initialValues.category_id).map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Field>
                                {!isView && errors.category_id && touched.category_id && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.category_id}</div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Location</label>
                                <Field
                                    name="location"
                                    disabled={isView}
                                    placeholder="e.g. New York, NY or Remote"
                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 ${isView ? "bg-slate-50 border-transparent text-gray-600 cursor-not-allowed" :
                                        errors.location && touched.location ? "bg-slate-50 border-red-200 focus:ring-red-50 focus:border-red-500" : "bg-slate-50 border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                />
                                {!isView && errors.location && touched.location && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.location}</div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Description</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows="6"
                                    disabled={isView}
                                    placeholder="Describe the role, responsibilities, requirements, and benefits..."
                                    className={`w-full px-5 py-4 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 resize-none ${isView ? "bg-slate-50 border-transparent text-gray-600 cursor-not-allowed" :
                                        errors.description && touched.description ? "bg-slate-50 border-red-200 focus:ring-red-50 focus:border-red-500" : "bg-slate-50 border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                />
                                {!isView && errors.description && touched.description && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.description}</div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Listing Status</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${values.status == 1 ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100" : "border-slate-50 bg-slate-50 text-slate-400 opacity-60"
                                        } ${isView ? "pointer-events-none cursor-not-allowed" : ""}`}>
                                        <Field type="radio" name="status" value="1" disabled={isView} className="hidden" />
                                        <FiCheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-bold">Active</span>
                                    </label>
                                    <label className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${values.status == 0 ? "border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-100" : "border-slate-50 bg-slate-50 text-slate-400 opacity-60"
                                        } ${isView ? "pointer-events-none cursor-not-allowed" : ""}`}>
                                        <Field type="radio" name="status" value="0" disabled={isView} className="hidden" />
                                        <FiX className="w-5 h-5" />
                                        <span className="text-sm font-bold">Closed</span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 flex flex-col sm:flex-row gap-3">
                                {!isView && (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl text-sm font-extrabold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <FiSave className="w-5 h-5" />
                                            {isEdit ? "Update Job" : "Publish Listing"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.push("/employer/jobs")}
                                            className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl text-sm font-extrabold hover:bg-slate-100 transition-all active:scale-95"
                                        >
                                            {isView ? "Close" : "Cancel"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
