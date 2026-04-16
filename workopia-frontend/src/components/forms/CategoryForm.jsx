"use client";

import { useEffect, useState } from "react";
import { getCategoryById, createCategory, updateCategory } from "@/service/categoriesService";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiSave, FiX, FiLayers, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function CategoryForm() {
    const router = useRouter();
    const params = useParams();
    
    // Support both [id] and [id] routes
    const id = params?.id;
    const isEdit = !!id;

    const [initialValues, setInitialValues] = useState({
        name: "",
        description: "",
        status: 1,
    });

    const [fetching, setFetching] = useState(isEdit);

    const validationSchema = Yup.object({
        name: Yup.string().required("Category name is required").min(2, "Name is too short"),
        description: Yup.string().max(500, "Description must be under 500 characters"),
        status: Yup.number().required(),
    });

    useEffect(() => {
        if (isEdit) {
            const fetchCategory = async () => {
                try {
                    const res = await getCategoryById(id);
                    if (res.data.success) {
                        const c = res.data.category;
                        setInitialValues({
                            name: c.name,
                            description: c.description || "",
                            status: c.status,
                        });
                    }
                } catch (err) {
                    console.error("Load Error:", err);
                    toast.error("Failed to load category metadata");
                    router.push("/admin/categories");
                } finally {
                    setFetching(false);
                }
            };
            fetchCategory();
        }
    }, [id, isEdit, router]);

    const handleSubmit = async (values, { setSubmitting }) => {
        const loadingToast = toast.loading(isEdit ? "Updating category..." : "Creating category...");
        try {
            const payload = { ...values, status: Number(values.status) };

            if (isEdit) {
                await updateCategory(id, payload);
                toast.success("Category updated successfully", { id: loadingToast });
            } else {
                await createCategory(payload);
                toast.success("Category created successfully", { id: loadingToast });
            }

            router.push("/admin/categories");
        } catch (err) {
            console.error("Submit Error:", err);
            toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    if (fetching) return <Loader text="Synchronizing category details..." />;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10 px-4">
            <div className="flex items-center justify-between">
                <Link 
                    href="/admin/categories" 
                    className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Catalog
                </Link>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {isEdit ? "Modification Mode" : "New Entry"}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <FiLayers className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {isEdit ? "Edit Category" : "Add New Category"}
                        </h2>
                        <p className="text-sm text-gray-400 font-medium italic">Capture the essence of this industry classification.</p>
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched, values }) => (
                        <Form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Category Name</label>
                                <div className="relative group">
                                    <Field
                                        name="name"
                                        placeholder="e.g. Software Development"
                                        className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold transition-all outline-none focus:ring-4 ${
                                            errors.name && touched.name 
                                            ? "border-red-200 focus:ring-red-50 focus:border-red-500" 
                                            : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                    />
                                    {errors.name && touched.name && (
                                        <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase pl-1">
                                            <FiAlertCircle /> {errors.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Description</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows="4"
                                    placeholder="Briefly describe what this category represents..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Live Status</label>
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
                                        <span className="text-sm font-bold">Inactive</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-extrabold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <FiSave className="w-5 h-5" />
                                    {isEdit ? "Update Changes" : "Create Category"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push("/admin/categories")}
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
