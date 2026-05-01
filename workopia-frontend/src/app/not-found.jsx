"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiHome, FiCompass } from "react-icons/fi";

export default function NotFoundPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="max-w-lg w-full text-center space-y-10">

                {/* Icon */}
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-indigo-100 border border-indigo-50 text-indigo-500">
                    <FiCompass className="w-10 h-10" />
                </div>

                {/* Text */}
                <div className="space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-500">Error 404</p>
                    <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
                    <p className="text-slate-500 font-medium text-base max-w-sm mx-auto leading-relaxed">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-100 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black hover:shadow-2xl hover:shadow-indigo-100 transition-all active:scale-95"
                    >
                        <FiHome className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}