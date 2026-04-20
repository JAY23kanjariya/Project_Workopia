import React from 'react';
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:rotate-6">
                                W
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                Work<span className="text-blue-600">opia</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Connecting brilliant talent with the world's most innovative companies. Your dream career starts with a single click.
                        </p>
                        <div className="flex items-center gap-3">
                            {[FiFacebook, FiTwitter, FiLinkedin, FiInstagram].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all transform hover:-translate-y-1">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* For Candidates */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">For Candidates</h3>
                        <ul className="space-y-4">
                            <li><Link href="/candidate/jobs" className="text-gray-500 hover:text-blue-600 transition-all text-sm inline-block hover:translate-x-1">Browse Jobs</Link></li>
                            <li><Link href="/candidate/applications" className="text-gray-500 hover:text-blue-600 transition-all text-sm inline-block hover:translate-x-1">My Applications</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-all text-sm inline-block hover:translate-x-1">Job Alerts</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-all text-sm inline-block hover:translate-x-1">Career Advice</Link></li>
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-6">For Employers</h3>
                        <ul className="space-y-4">
                            <li><Link href="/employer/dashboard" className="text-gray-500 hover:text-blue-600 transition-all text-sm inline-block hover:translate-x-1">Post a Job</Link></li>
                            <li><Link href="/employer/jobs" className="text-gray-500 hover:text-blue-600 transition-all text-sm inline-block hover:translate-x-1">Manage Jobs</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-all text-sm inline-block hover:translate-x-1">Source Talent</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-blue-600 transition-all text-sm inline-block hover:translate-x-1">Hiring Solutions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-900 mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-500">
                                <FiMapPin className="text-blue-600 mt-0.5 shrink-0" />
                                <span>Workopia Demo <br />Gec,bhavnagar</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-500">
                                <FiMail className="text-blue-600 shrink-0" />
                                <span>support@workopia.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
                    <p>© {currentYear} Workopia. Built with passion for better hiring.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}