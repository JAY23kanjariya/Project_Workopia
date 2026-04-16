"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateProfile, changePassword, deleteAccount, signOut } from "@/service/authService";
import Loader from "@/components/ui/Loader";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { FiUser, FiLock, FiTrash2, FiSave, FiAlertCircle, FiShield, FiMail, FiAlertTriangle, FiX } from "react-icons/fi";

export default function SettingsPage({ role }) {
    const router = useRouter();
    const isAdmin = role === "admin";

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                if (res.data.success) setUser(res.data.data);
            } catch (err) {
                console.error("Fetch user error:", err);
                toast.error("Could not load your profile");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Profile validation
    const profileSchema = Yup.object({
        name: Yup.string().required("Name is required").min(2, "Name is too short"),
        email: Yup.string().email("Invalid email").required("Email is required"),
    });

    // Password validation
    const passwordSchema = Yup.object({
        current_password: Yup.string().required("Current password is required"),
        password: Yup.string().required("New password is required").min(8, "Minimum 8 characters"),
        password_confirmation: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Please confirm your password"),
    });

    const handleProfileUpdate = async (values, { setSubmitting }) => {
        const t = toast.loading("Updating profile...");
        try {
            const res = await updateProfile(values);
            if (res.data.success) {
                setUser(res.data.user);
                toast.success("Profile updated", { id: t });
            }
        } catch (err) {
            const msg = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(", ") : "Update failed";
            toast.error(msg, { id: t });
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChange = async (values, { setSubmitting, resetForm }) => {
        const t = toast.loading("Changing password...");
        try {
            const res = await changePassword(values);
            if (res.data.success) {
                toast.success("Password changed successfully", { id: t });
                resetForm();
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors ? Object.values(err.response?.data?.errors || {}).flat().join(", ") : "Password change failed";
            toast.error(msg, { id: t });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        const t = toast.loading("Deleting your account...");
        try {
            await deleteAccount();
            toast.success("Account deleted. Goodbye.", { id: t });
            await signOut();
            router.push("/sign-in");
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not delete account", { id: t });
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) return <Loader text="Loading your settings..." />;

    const tabs = [
        { key: "profile", label: "Profile", icon: FiUser },
        { key: "password", label: "Security", icon: FiLock },
        ...(!isAdmin ? [{ key: "danger", label: "Danger Zone", icon: FiTrash2 }] : []),
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10 px-4">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
                <p className="text-gray-500 mt-1 font-medium italic">Manage your profile, security, and preferences.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.key
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-400 hover:text-gray-600"
                            } ${tab.key === "danger" ? (activeTab === "danger" ? "!text-red-600" : "!text-red-300 hover:!text-red-500") : ""}`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && user && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-200">
                            {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5">
                                <FiMail className="w-3.5 h-3.5" /> {user.email}
                            </p>
                        </div>
                    </div>

                    <Formik initialValues={{ name: user.name || "", email: user.email || "" }} enableReinitialize validationSchema={profileSchema} onSubmit={handleProfileUpdate}>
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Full Name</label>
                                    <Field name="name" className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${errors.name && touched.name ? "border-red-200 focus:ring-red-50" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"}`} />
                                    {errors.name && touched.name && <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.name}</div>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Email Address</label>
                                    <Field name="email" type="email" className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${errors.email && touched.email ? "border-red-200 focus:ring-red-50" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"}`} />
                                    {errors.email && touched.email && <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.email}</div>}
                                </div>
                                <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-extrabold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50">
                                    <FiSave className="w-5 h-5" /> {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "password" && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                            <FiShield className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Change Password</h2>
                            <p className="text-sm text-gray-400 font-medium italic">Secure your account with a strong password.</p>
                        </div>
                    </div>

                    <Formik initialValues={{ current_password: "", password: "", password_confirmation: "" }} validationSchema={passwordSchema} onSubmit={handlePasswordChange}>
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Current Password</label>
                                    <Field name="current_password" type="password" placeholder="Enter your current password" className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${errors.current_password && touched.current_password ? "border-red-200 focus:ring-red-50" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"}`} />
                                    {errors.current_password && touched.current_password && <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.current_password}</div>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">New Password</label>
                                    <Field name="password" type="password" placeholder="Minimum 8 characters" className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${errors.password && touched.password ? "border-red-200 focus:ring-red-50" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"}`} />
                                    {errors.password && touched.password && <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.password}</div>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Confirm New Password</label>
                                    <Field name="password_confirmation" type="password" placeholder="Re-enter new password" className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-4 transition-all ${errors.password_confirmation && touched.password_confirmation ? "border-red-200 focus:ring-red-50" : "border-transparent focus:ring-indigo-50 focus:border-indigo-500 focus:bg-white"}`} />
                                    {errors.password_confirmation && touched.password_confirmation && <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase pl-1"><FiAlertCircle /> {errors.password_confirmation}</div>}
                                </div>
                                <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500 text-white rounded-2xl text-sm font-extrabold hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-200 transition-all active:scale-95 disabled:opacity-50">
                                    <FiLock className="w-5 h-5" /> {isSubmitting ? "Updating..." : "Update Password"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === "danger" && !isAdmin && (
                <div className="bg-white rounded-[2.5rem] border-2 border-red-100 shadow-sm p-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                            <FiAlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-red-900">Danger Zone</h2>
                            <p className="text-sm text-red-400 font-medium italic">Irreversible actions that affect your account.</p>
                        </div>
                    </div>

                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                        <h3 className="font-bold text-gray-900 mb-1">Delete Your Account</h3>
                        <p className="text-sm text-gray-500 mb-4">Once deleted, all your data including jobs, applications, and profile information will be permanently removed. This cannot be undone.</p>
                        <button onClick={() => setShowDeleteModal(true)} className="px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-extrabold hover:bg-red-700 hover:shadow-xl hover:shadow-red-200 transition-all active:scale-95">
                            Delete My Account
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mx-auto mb-6">
                            <FiAlertTriangle className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Account Forever?</h3>
                        <p className="text-sm text-gray-400 text-center mb-8">This will permanently erase all your data. You will be signed out immediately.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-2xl text-sm font-extrabold hover:bg-slate-100 transition-all active:scale-95">Cancel</button>
                            <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-sm font-extrabold hover:bg-red-700 hover:shadow-xl hover:shadow-red-200 transition-all active:scale-95 disabled:opacity-50">
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
