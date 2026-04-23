"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLogOut, FiBell } from "react-icons/fi";
import { signOut } from "@/service/authService";
import { toast } from "react-hot-toast";
import Badge from "@/components/ui/Badge";

export default function Navbar({ name, role }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success("Logged out");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            router.push("/sign-in");
            router.refresh();
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-blue-50 backdrop-blur-xl border-b border-blue-200 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02] active:scale-95">
                        <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <span className="text-xl font-bold tracking-tighter">W</span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-gray-900">
                            Work<span className="text-blue-600">opia</span>
                        </span>
                    </Link>

                    {/* Right: User Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {name ? (
                            <>
                                {/* User Profile Pill */}
                                <div className="flex items-center gap-3 p-1 pl-1 pr-3 sm:pr-4 bg-white hover:shadow-sm hover:border-gray-200 rounded-full border border-gray-100 transition-all cursor-default group">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
                                            {name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800 leading-none capitalize truncate max-w-[80px] sm:max-w-[120px]">
                                            {name}
                                        </span>
                                        <Badge variant="purple" className="py-0 px-1.5 h-3.5 text-[9px] uppercase tracking-wider font-extrabold mt-0.5">
                                            {role}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all group"
                                >
                                    <FiLogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                                    <span className="hidden md:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/sign-in" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Sign In</Link>
                                <Link href="/sign-up" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-black hover:shadow-lg transition-all active:scale-95">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}