"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/service/authService";
import { toast } from "react-hot-toast";
import { FiMail, FiBriefcase, FiArrowLeft, FiSend, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError("");

        try {
            const res = await forgotPassword({ email });
            toast.success(res.data.message || "Reset link sent!");
            setSent(true);
        } catch (err) {
            const msg = err.response?.data?.message || "Could not send reset link";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden items-center justify-center p-16">
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
                        Don't worry,
                        <br />we've got you.
                    </h2>
                    <p className="text-orange-100 text-lg font-medium leading-relaxed">
                        Enter your email and we'll send you a secure link to reset your password. The link expires in 60 minutes.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white">
                                <FiBriefcase className="w-4 h-4" />
                            </div>
                            <span className="text-lg font-black text-gray-900">Workopia</span>
                        </Link>
                    </div>

                    <Link href="/sign-in" className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-flex">
                        <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Sign In
                    </Link>

                    {sent ? (
                        /* Success State */
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                                <FiCheckCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Check your inbox</h1>
                            <p className="text-gray-400 font-medium mb-8">We've sent a password reset link to <span className="font-bold text-gray-700">{email}</span>. It expires in 60 minutes.</p>
                            <button onClick={() => { setSent(false); setEmail(""); }} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                Didn't receive it? Try again
                            </button>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Forgot password?</h1>
                                <p className="text-gray-400 font-medium">Enter your email and we'll send you a reset link.</p>
                            </div>

                            {error && (
                                <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Email Address</label>
                                    <div className="relative group">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-600 transition-colors w-5 h-5" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            required
                                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="group w-full flex items-center justify-center gap-2 py-4 bg-amber-500 text-white rounded-2xl text-sm font-extrabold hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <>
                                            <FiSend className="w-4 h-4" />
                                            Send Reset Link
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
