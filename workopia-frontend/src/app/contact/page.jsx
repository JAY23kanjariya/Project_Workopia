"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { sendContactMessage } from "@/service/contactService";
import { FiMail, FiArrowRight } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";

// Client-side cookie parser helper
const getUserFromCookie = () => {
    if (typeof window === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find(row => row.startsWith("user="));
    if (!userCookie) return null;
    try {
        return JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
    } catch {
        return null;
    }
};

const contactSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    message: Yup.string().min(10, "Message too short").required("Message is required"),
});

export default function ContactPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getUserFromCookie());
    }, []);

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        const load = toast.loading("Sending your message...");
        try {
            const res = await sendContactMessage(values);
            toast.success(res.data.message, { id: load });
            resetForm();
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong", { id: load });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50/30 flex flex-col">
            <Navbar name={user?.name} role={user?.role_id} />
            
            <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    
                    {/* Left Side: Information */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-1000">
                        <div className="space-y-4">
                            <div className="h-1.5 w-16 bg-blue-600 rounded-full"></div>
                            <h1 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tighter">
                                Contact us
                            </h1>
                        </div>
                        
                        <div className="relative">
                            {/* Decorative dots pattern */}
                            <div className="absolute -top-10 -left-10 w-32 h-32 opacity-20 pointer-events-none">
                                <div className="grid grid-cols-4 gap-4">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-md relative z-10">
                                Need to get in touch with us? Either fill out the form with your inquiry or find the <span className="text-blue-600 font-bold border-b-2 border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">department email</span> you'd like to contact below.
                            </p>
                        </div>

                        <div className="pt-8 space-y-6">
                            <div className="flex items-center gap-4 text-slate-500 font-bold text-sm tracking-widest uppercase">
                                <span className="h-px w-8 bg-slate-200"></span>
                                Support Channels
                                <span className="h-px w-8 bg-slate-200"></span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-blue-50 shadow-sm w-fit group hover:border-blue-200 transition-all">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <FiMail />
                                    </div>
                                    <span className="font-bold text-slate-700">workopia@support.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form Card */}
                    <div className="animate-in fade-in slide-in-from-right-6 duration-1000">
                        <div className="bg-white p-10 sm:p-14 rounded-[3rem] shadow-2xl shadow-blue-100 border border-white relative overflow-hidden">
                            {/* Inner gradient glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                            
                            <Formik
                                initialValues={{ first_name: "", last_name: "", email: "", message: "" }}
                                validationSchema={contactSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form className="space-y-8 relative z-10">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">First name*</label>
                                                <Field name="first_name" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 transition-all outline-none" placeholder="John" />
                                                {errors.first_name && touched.first_name && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.first_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Last name</label>
                                                <Field name="last_name" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 transition-all outline-none" placeholder="Doe" />
                                                {errors.last_name && touched.last_name && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.last_name}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Email*</label>
                                            <Field name="email" type="email" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 transition-all outline-none" placeholder="john@example.com" />
                                            {errors.email && touched.email && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">What can we help you with?</label>
                                            <Field as="textarea" name="message" rows="4" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-600 transition-all outline-none resize-none" placeholder="Type your message here..." />
                                            {errors.message && touched.message && <p className="text-[10px] font-bold text-rose-500 pl-1">{errors.message}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                                        >
                                            Submit
                                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
