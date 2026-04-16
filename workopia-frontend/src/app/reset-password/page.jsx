"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/service/authService";
import { toast } from "react-hot-toast";
import { FiLock, FiBriefcase, FiArrowRight, FiAlertCircle, FiCheckCircle, FiShield } from "react-icons/fi";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (password !== passwordConfirmation) {
            setError("Passwords do not match");
            return;
        }
        if (!token || !email) {
            setError("Invalid or missing reset link. Please request a new one.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await resetPassword({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            toast.success(res.data.message || "Password reset successfully!");
            setSuccess(true);
        } catch (err) {
            const msg = err.response?.data?.message || "Reset failed. The link may have expired.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (hasError) =>
        `w-full pl-12 pr-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${
            hasError ? "border-red-200 focus:ring-red-50 focus:border-red-500" : "border-transparent focus:ring-blue-50 focus:border-blue-500 focus:bg-white"
        }`;

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden items-center justify-center p-16">
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
                        Almost there.
                        <br />Set a new password.
                    </h2>
                    <p className="text-emerald-100 text-lg font-medium leading-relaxed mb-10">
                        Choose a strong, unique password that you haven't used before. Your account security is our priority.
                    </p>

                    <div className="space-y-4">
                        {["Must be at least 8 characters", "Use a mix of letters and numbers", "Avoid reusing old passwords"].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                <span className="text-sm text-emerald-100 font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                                <FiBriefcase className="w-4 h-4" />
                            </div>
                            <span className="text-lg font-black text-gray-900">Workopia</span>
                        </Link>
                    </div>

                    {success ? (
                        /* Success State */
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                                <FiCheckCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Password Reset!</h1>
                            <p className="text-gray-400 font-medium mb-8">Your password has been changed successfully. You can now sign in with your new credentials.</p>
                            <Link href="/sign-in" className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-extrabold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
                                Go to Sign In <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <FiShield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Reset Password</h1>
                                    <p className="text-sm text-gray-400 font-medium">For: <span className="text-gray-700 font-bold">{email || "your account"}</span></p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">New Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-600 transition-colors w-5 h-5" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Minimum 8 characters"
                                            required
                                            className={inputClass(false)}
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Confirm Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-600 transition-colors w-5 h-5" />
                                        <input
                                            type="password"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            placeholder="Re-enter password"
                                            required
                                            className={inputClass(false)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !password || !passwordConfirmation}
                                    className="group w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-extrabold hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Resetting...
                                        </div>
                                    ) : (
                                        <>
                                            Reset Password
                                            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <Link href="/forgot-password" className="text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors">
                                    Request a new reset link
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
