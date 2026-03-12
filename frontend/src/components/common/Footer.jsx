import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-900 pt-24 pb-12 text-white overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-flex items-center mb-8">
                            <span className="text-3xl font-black text-white tracking-tighter">
                                Work<span className="text-primary">opia</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-xs">
                            Elevating the global job marketplace through premium connections and seamless talent acquisition.
                        </p>
                        <div className="flex gap-4">
                            {['Twitter', 'LinkedIn', 'Github'].map((social) => (
                                <a 
                                    key={social} 
                                    href="#" 
                                    className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/10"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-5 h-5 bg-current opacity-20"></div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-primary">Marketplace</h4>
                        <ul className="space-y-4">
                            {['Browse Jobs', 'Companies', 'Salaries', 'Pricing'].map((link) => (
                                <li key={link}>
                                    <Link to="/jobs" className="text-gray-400 font-bold hover:text-white transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-primary">Resources</h4>
                        <ul className="space-y-4">
                            {['Documentation', 'Help Center', 'Career Blog', 'API Reference'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-400 font-bold hover:text-white transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-primary">Insider Access</h4>
                        <p className="text-gray-400 text-sm font-medium mb-6">
                            Get curated job opportunities delivered to your inbox weekly.
                        </p>
                        <div className="space-y-4">
                            <input 
                                type="email" 
                                placeholder="name@company.com" 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all font-bold"
                            />
                            <button className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">
                        © {new Date().getFullYear()} Workopia Platform. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
