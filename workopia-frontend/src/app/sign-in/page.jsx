"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { FiMail, FiLock, FiBriefcase, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { signIn } from "@/service/authService";
import { signInValidationSchema } from "./signInValidationSchema";
import { useState } from "react";
import { ROLES } from "@/utils/constants";

export default function SignInPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: signInValidationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setServerError("");

                const response = await signIn(values);

                if (response.data.success) {
                    const user = response.data.data.user;
                    toast.success("Welcome back!");

                    if (user?.role_id === ROLES.ADMIN) router.push("/admin/dashboard");
                    else if (user?.role_id === ROLES.EMPLOYER) router.push("/employer/dashboard");
                    else if (user?.role_id === ROLES.CANDIDATE) router.push("/candidate/dashboard");
                } else {
                    toast.error(response.data.message || "Login failed");
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Login failed";
                setServerError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 relative overflow-hidden items-center justify-center p-16">
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
                        Your career journey
                        <br />starts here.
                    </h2>
                    <p className="text-blue-100 text-lg font-medium leading-relaxed mb-10">
                        Connect with top employers, discover roles that match your ambitions, and take the next step forward.
                    </p>

                    <div className="space-y-4">
                        {["10,000+ active job listings", "Trusted by 5,000+ companies", "98% candidate satisfaction"].map((text, i) => (
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
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                                <FiBriefcase className="w-4 h-4" />
                            </div>
                            <span className="text-lg font-black text-gray-900">Workopia</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome back</h1>
                        <p className="text-gray-400 font-medium">Sign in to your account to continue.</p>
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                            <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-sm text-red-600 font-semibold">{serverError}</p>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Email Address</label>
                            <div className="relative group">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="you@company.com"
                                    className={`w-full pl-12 pr-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${
                                        formik.touched.email && formik.errors.email
                                            ? "border-red-200 focus:ring-red-50 focus:border-red-500"
                                            : "border-transparent focus:ring-blue-50 focus:border-blue-500 focus:bg-white"
                                    }`}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1">
                                    <FiAlertCircle className="w-3 h-3" /> {formik.errors.email}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Password</label>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="••••••••"
                                    className={`w-full pl-12 pr-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${
                                        formik.touched.password && formik.errors.password
                                            ? "border-red-200 focus:ring-red-50 focus:border-red-500"
                                            : "border-transparent focus:ring-blue-50 focus:border-blue-500 focus:bg-white"
                                    }`}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1">
                                    <FiAlertCircle className="w-3 h-3" /> {formik.errors.password}
                                </div>
                            )}
                        </div>

                        {/* Forgot password link */}
                        <div className="flex justify-end -mt-1">
                            <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                Forgot password?
                            </Link>
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
                                    Signing in...
                                </div>
                            ) : (
                                <>
                                    Sign In
                                    <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400 font-medium">
                            Don't have an account?{" "}
                            <Link href="/signUp" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}