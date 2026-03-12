import { useState, useContext } from "react"
import { AuthContext } from "../../auth/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"

// Inline Icons
const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const IconShield = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

function CreateAccountPage() {
    const { createUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const [serverError, setServerError] = useState("");

    const onSubmit = async (data) => {
        setServerError("");
        try {
            await createUser(data);
            navigate('/login');
        } catch (error) {
            console.error("Account creation error:", error);
            const message = error.response?.data?.message || error.response?.data?.errors || "Registration failed. Please try again.";
            setServerError(typeof message === 'object' ? Object.values(message).flat()[0] : message);
        }
    };

    return (
        <div className="min-h-screen bg-white lg:bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center group">
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">
                            Work<span className="text-primary">opia</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white lg:shadow-2xl lg:shadow-primary/30 rounded-3xl p-8 md:p-12 border border-transparent lg:border-gray-100">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">
                            Join thousands of professionals and start your journey.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {serverError && (
                            <div className="col-span-full bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center">
                                <span className="mr-2">⚠️</span> {serverError}
                            </div>
                        )}

                        {/* Role Selection */}
                        <div className="col-span-full">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                I want to join as a
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`relative flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${watch("role_id") === 3 ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
                                    <input type="radio" value="3" {...register("role_id", { required: "Please select a role" })} className="absolute opacity-0" />
                                    <span className={`font-bold ${watch("role_id") === 3 ? 'text-primary' : 'text-gray-500'}`}>Candidate</span>
                                </label>
                                <label className={`relative flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${watch("role_id") === 2 ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
                                    <input type="radio" value="2" {...register("role_id", { required: "Please select a role" })} className="absolute opacity-0" />
                                    <span className={`font-bold ${watch("role_id") === 2 ? 'text-primary' : 'text-gray-500'}`}>Employer</span>
                                </label>
                            </div>
                            {errors.role_id && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.role_id.message}</p>}
                        </div>

                        {/* Name */}
                        <div className="md:col-span-1">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                    <IconUser />
                                </div>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-2xl text-gray-900 font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all outline-none`}
                                    {...register("name", { required: "Name is required" })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-1">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                    <IconMail />
                                </div>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-2xl text-gray-900 font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all outline-none`}
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="md:col-span-1">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                    <IconLock />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-2xl text-gray-900 font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all outline-none`}
                                    {...register("password", { required: "Required", minLength: 8 })}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="md:col-span-1">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                    <IconShield />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'} rounded-2xl text-gray-900 font-bold focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all outline-none`}
                                    {...register("confirmPassword", {
                                        required: "Required",
                                        validate: (val) => val === watch("password") || "Not matching"
                                    })}
                                />
                            </div>
                        </div>

                        <div className="col-span-full mt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-black hover:bg-primary-dark shadow-xl shadow-primary/10 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Creating Account..." : "Join Workopia"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 font-bold text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm font-black flex items-center justify-center gap-2 group transition-colors">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountPage


