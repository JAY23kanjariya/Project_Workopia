import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLES, ROLE_NAMES } from "@/utils/constants";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default async function CandidateLayout({ children }) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    let user = null;
    try {
        user = userCookie ? JSON.parse(userCookie) : null;
    } catch {
        user = null;
    }

    // 🔒 Auth Guard: Ensure only candidates can access these routes
    if (!user || user.role_id !== ROLES.CANDIDATE) {
        redirect("/unauthorized");
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col transition-colors duration-300">
            {/* Header / Navbar */}
            <Navbar name={user.name} role={ROLE_NAMES[user.role_id]} />

            <div className="flex flex-1 relative">
                {/* Sidebar: Role-based navigation */}
                <Sidebar role={ROLE_NAMES[user.role_id]} />
                
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="flex-1 p-4 sm:p-8 lg:p-10 animate-in fade-in duration-500">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                    
                    {/* Footer: Pushed to bottom by flex-1 */}
                    <Footer />
                </main>
            </div>
        </div>
    );
}