"use client";

import { useEffect, useState } from "react";
import { getJobById, createJob, updateJob } from "@/service/jobService";
import { getCategories } from "@/service/categoriesService";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiSave, FiBriefcase, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";

export default function JobForm() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const isEdit = !!id;

    const [categories, setCategories] = useState([]);
    const [initialValues, setInitialValues] = useState({
        title: "",
        category_id: "",
        location: "",
        description: "",
        status: 1,
    });
    const [fetching, setFetching] = useState(true);

    const validationSchema = Yup.object({
        title: Yup.string().required("Job title is required").min(3, "Title is too short"),
        category_id: Yup.string().required("Please select a category"),
        location: Yup.string().required("Location is required"),
        description: Yup.string().required("Job description is required").min(20, "Description should be at least 20 characters"),
        status: Yup.number().required(),
    });

    // Fetch categories + job data (if editing)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch categories
                const catRes = await getCategories({ all: "true" });
                if (catRes.data.success) {
                    const cats = catRes.data.categories;
                    setCategories(Array.isArray(cats) ? cats : cats.data || []);
                }

                // If editing, fetch job details
                if (isEdit) {
                    const jobRes = await getJobById(id);
                    if (jobRes.data.success) {
                        const j = jobRes.data.jobPost;
                        setInitialValues({
                            title: j.title || "",
                            category_id: j.category_id || "",
                            location: j.location || "",
                            description: j.description || "",
                            status: j.status ?? 1,
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
    }, [id, isEdit]);

    const handleSubmit = async (values, { setSubmitting }) => {
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

    if (fetching) return <Loader text={isEdit ? "Loading job details..." : "Preparing form..."} />;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10 px-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/employer/jobs" className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                    <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Jobs
                </Link>
                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {isEdit ? "Edit Mode" : "New Listing"}
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <FiBriefcase className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {isEdit ? "Edit Job Listing" : "Post a New Job"}
                        </h2>
                        <p className="text-sm text-gray-400 font-medium italic">Attract the right talent for your organization.</p>
                    </div>
                </div>

                <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, errors, touched, values }) => (
                        <Form className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Job Title</label>
                                <Field
                                    name="title"
                                    placeholder="e.g. Senior React Developer"
                                    className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 ${
                                        errors.title && touched.title ? "border-red-200 focus:ring-red-50 focus:border-red-500" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                    }`}
                                />
                                {errors.title && touched.title && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.title}</div>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Category</label>
                                <Field
                                    as="select"
                                    name="category_id"
                                    className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 ${
                                        errors.category_id && touched.category_id ? "border-red-200 focus:ring-red-50 focus:border-red-500" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                    }`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.filter(c => c.status === 1).map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Field>
                                {errors.category_id && touched.category_id && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.category_id}</div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Location</label>
                                <Field
                                    name="location"
                                    placeholder="e.g. New York, NY or Remote"
                                    className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 ${
                                        errors.location && touched.location ? "border-red-200 focus:ring-red-50 focus:border-red-500" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                    }`}
                                />
                                {errors.location && touched.location && (
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
                                    placeholder="Describe the role, responsibilities, requirements, and benefits..."
                                    className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 resize-none ${
                                        errors.description && touched.description ? "border-red-200 focus:ring-red-50 focus:border-red-500" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                    }`}
                                />
                                {errors.description && touched.description && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.description}</div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Listing Status</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                        values.status == 1 ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100" : "border-slate-50 bg-slate-50 text-slate-400 opacity-60"
                                    }`}>
                                        <Field type="radio" name="status" value="1" className="hidden" />
                                        <FiCheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-bold">Active</span>
                                    </label>
                                    <label className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                        values.status == 0 ? "border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-100" : "border-slate-50 bg-slate-50 text-slate-400 opacity-60"
                                    }`}>
                                        <Field type="radio" name="status" value="0" className="hidden" />
                                        <FiX className="w-5 h-5" />
                                        <span className="text-sm font-bold">Closed</span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 flex flex-col sm:flex-row gap-3">
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
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
