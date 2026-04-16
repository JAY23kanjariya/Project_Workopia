"use client";

import { signOut } from "@/service/authService";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
    FiLogOut, 
    FiGrid, 
    FiUsers, 
    FiBriefcase, 
    FiFileText, 
    FiSearch, 
    FiLayout,
    FiSettings,
    FiChevronRight
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function Sidebar({ role }) {
    const pathname = usePathname();
    const router = useRouter();

    const menu = {
        admin: [
            { name: "Dashboard", path: "/admin/dashboard", icon: FiGrid },
            { name: "Users", path: "/admin/users", icon: FiUsers },
            { name: "Jobs", path: "/admin/jobs", icon: FiBriefcase },
            { name: "Categories", path: "/admin/categories", icon: FiLayout },
            { name: "Settings", path: "/admin/settings", icon: FiSettings },
        ],
        employer: [
            { name: "Dashboard", path: "/employer/dashboard", icon: FiGrid },
            { name: "My Jobs", path: "/employer/jobs", icon: FiBriefcase },
            { name: "Applications", path: "/employer/applications", icon: FiFileText },
            { name: "Settings", path: "/employer/settings", icon: FiSettings },
        ],
        candidate: [
            { name: "Dashboard", path: "/candidate/dashboard", icon: FiGrid },
            { name: "Browse Jobs", path: "/candidate/bowserjobs", icon: FiSearch },
            { name: "My Applications", path: "/candidate/applications", icon: FiFileText },
            { name: "Settings", path: "/candidate/settings", icon: FiSettings },
        ],
    };


    const items = menu[role] || [];

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
        <aside className="w-72 sticky top-16 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 pt-16 lg:sticky lg:h-[calc(100vh-64px)]">
            <div className="flex-1 px-4 py-8 overflow-y-auto">
                <div className="mb-8 px-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
                        Main Menu
                    </p>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <FiSettings className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white capitalize">{role} Account</p>
                            <p className="text-[10px] text-slate-400">Manage your portal</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                                    isActive 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 transition-transform duration-200 ${!isActive && "group-hover:scale-110"}`} />
                                    <span className="text-sm font-semibold">{item.name}</span>
                                </div>
                                {isActive && <FiChevronRight className="w-4 h-4 animate-in fade-in slide-in-from-left-2" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Logout Section */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl text-sm font-semibold transition-all duration-200 group"
                >
                    <FiLogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
