import Link from "next/link";
import { FiBriefcase, FiUsers, FiSearch, FiArrowRight, FiCheckCircle, FiZap, FiShield, FiTrendingUp } from "react-icons/fi";

export const metadata = {
  title: "Workopia — Find Your Dream Career",
  description: "Connect with top employers and discover opportunities that match your ambitions. Workopia is the modern job portal for candidates and employers alike.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-blue-50 backdrop-blur-xl border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <FiBriefcase className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-gray-900 tracking-tight">Workopia</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">Contact Us</Link>
            <Link href="/sign-in" className="px-5 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
            <Link href="/sign-up" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 hover:shadow-lg transition-all active:scale-95">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-b from-indigo-50 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-8">
            <FiZap className="w-3.5 h-3.5" />
            Trusted by 10,000+ professionals worldwide
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            Find Your Next
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Career Move</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Connect with top employers, discover opportunities that match your ambitions, and take the next step in your professional journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-extrabold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
              Start Your Journey
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/sign-in" className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl text-sm font-extrabold hover:border-gray-300 hover:shadow-lg transition-all active:scale-95">
              I Already Have an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-8 border-y border-gray-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Active Jobs" },
            { value: "5K+", label: "Companies" },
            { value: "50K+", label: "Candidates" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-400 font-bold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">Why Choose Workopia?</h2>
            <p className="text-gray-500 max-w-lg mx-auto font-medium">Everything you need to land your dream role or find the perfect candidate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FiSearch,
                title: "Smart Job Search",
                desc: "Filter by title, category, and location to find exactly what you're looking for.",
                color: "from-blue-500 to-indigo-600",
                bg: "bg-blue-50",
              },
              {
                icon: FiUsers,
                title: "Employer Dashboard",
                desc: "Post jobs, manage applications, and track candidate interest in real-time.",
                color: "from-emerald-500 to-teal-600",
                bg: "bg-emerald-50",
              },
              {
                icon: FiShield,
                title: "Secure & Reliable",
                desc: "Enterprise-grade security with role-based access for admins, employers, and candidates.",
                color: "from-amber-500 to-orange-600",
                bg: "bg-amber-50",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto font-medium">Three simple steps to kickstart your career or build your team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Account", desc: "Sign up as a candidate or employer in under 30 seconds." },
              { step: "02", title: "Explore & Connect", desc: "Browse jobs or post openings. Filter by category, title, and location." },
              { step: "03", title: "Apply & Hire", desc: "Submit applications with a click or review candidates from your dashboard." },
            ].map((item, i) => (
              <div key={i} className="relative text-center p-8">
                <div className="text-6xl font-black text-blue-100 mb-4">{item.step}</div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">Built for Everyone</h2>
            <p className="text-gray-500 max-w-lg mx-auto font-medium">Tailored dashboards for every role in the hiring process.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: "Candidate", features: ["Browse & search jobs", "Quick Apply in one click", "Track application status", "Manage your profile"], color: "blue" },
              { role: "Employer", features: ["Post job listings", "Review applications", "Approve/Reject candidates", "Dashboard analytics"], color: "emerald" },
              { role: "Admin", features: ["Manage all users", "Moderate job posts", "Category management", "Platform-wide analytics"], color: "indigo" },
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-lg transition-all`}>
                <div className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 bg-${item.color}-50 text-${item.color}-600`}>
                  {item.role}
                </div>
                <ul className="space-y-3">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <FiCheckCircle className={`w-4 h-4 text-${item.color}-500 shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[3rem] p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            <FiTrendingUp className="w-10 h-10 text-white/60 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 max-w-lg mx-auto mb-10 font-medium">Join thousands of professionals who trust Workopia to connect them with the right opportunities.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-2xl text-sm font-extrabold hover:shadow-xl transition-all active:scale-95">
                Create Free Account <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/sign-in" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl text-sm font-extrabold hover:bg-white/20 transition-all active:scale-95">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t bg-blue-50 border-blue-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <FiBriefcase className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-black text-gray-900">Workopia</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400 font-bold">
            <Link href="/contact" className="hover:text-gray-600 transition-colors">Contact Us</Link>
            <Link href="/sign-in" className="hover:text-gray-600 transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-gray-600 transition-colors">Register</Link>
          </div>
          <p className="text-xs text-gray-300 font-medium">© {new Date().getFullYear()} Workopia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
