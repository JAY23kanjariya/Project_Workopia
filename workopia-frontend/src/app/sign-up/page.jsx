"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiBriefcase, FiArrowRight, FiAlertCircle, FiUsers, FiSearch } from "react-icons/fi";
import { signUp } from "@/service/authService";
import { signUpValidationSchema } from "./signUpValidationSchema";
import { useState } from "react";
import { ROLES } from "@/utils/constants";

export default function SignUpPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            role_id: "",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: signUpValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setServerError("");

            try {
                await signUp(values);
                toast.success("Account created successfully!");
                router.push("/sign-in");
            } catch (error) {
                setServerError(error.message);
                toast.error(error.message || "Failed to create account");
            } finally {
                setLoading(false);
            }
        },
    });

    const inputClass = (field) =>
        `w-full pl-12 pr-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${
            formik.touched[field] && formik.errors[field]
                ? "border-red-200 focus:ring-red-50 focus:border-red-500"
                : "border-transparent focus:ring-blue-50 focus:border-blue-500 focus:bg-white"
        }`;

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-800 relative overflow-hidden items-center justify-center p-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-md">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                            <FiBriefcase className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">Workopia</span>
                    </Link>

                    <h2 className="text-4xl font-black text-white leading-tight mb-6">
                        Join thousands of
                        <br />professionals today.
                    </h2>
                    <p className="text-blue-100 text-lg font-medium leading-relaxed mb-10">
                        Create your free account and start connecting with opportunities that match your ambitions.
                    </p>

                    <div className="space-y-4">
                        {["Free forever — no hidden costs", "Browse 10,000+ job listings", "Apply with a single click"].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                <span className="text-sm text-blue-100 font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                                <FiBriefcase className="w-4 h-4" />
                            </div>
                            <span className="text-lg font-black text-gray-900">Workopia</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create your account</h1>
                        <p className="text-gray-400 font-medium">Get started in under 30 seconds.</p>
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                            <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-sm text-red-600 font-semibold">{serverError}</p>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        {/* Role Selection Cards */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">I am a</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                    formik.values.role_id == ROLES.CANDIDATE ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100" : "border-slate-100 bg-slate-50 text-slate-400"
                                }`}>
                                    <input type="radio" name="role_id" value={ROLES.CANDIDATE} onChange={formik.handleChange} className="hidden" />
                                    <FiSearch className="w-5 h-5" />
                                    <span className="text-sm font-bold">Job Seeker</span>
                                </label>
                                <label className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                    formik.values.role_id == ROLES.EMPLOYER ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100" : "border-slate-100 bg-slate-50 text-slate-400"
                                }`}>
                                    <input type="radio" name="role_id" value={ROLES.EMPLOYER} onChange={formik.handleChange} className="hidden" />
                                    <FiUsers className="w-5 h-5" />
                                    <span className="text-sm font-bold">Employer</span>
                                </label>
                            </div>
                            {formik.touched.role_id && formik.errors.role_id && (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle className="w-3 h-3" /> {formik.errors.role_id}</div>
                            )}
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Full Name</label>
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="John Doe" className={inputClass("name")} />
                            </div>
                            {formik.touched.name && formik.errors.name && (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle className="w-3 h-3" /> {formik.errors.name}</div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Email Address</label>
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="you@company.com" className={inputClass("email")} />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle className="w-3 h-3" /> {formik.errors.email}</div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Password</label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Minimum 8 characters" className={inputClass("password")} />
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle className="w-3 h-3" /> {formik.errors.password}</div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Confirm Password</label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                <input type="password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Re-enter password" className={inputClass("confirmPassword")} />
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle className="w-3 h-3" /> {formik.errors.confirmPassword}</div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl text-sm font-extrabold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </div>
                            ) : (
                                <>
                                    Create Account
                                    <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400 font-medium">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}