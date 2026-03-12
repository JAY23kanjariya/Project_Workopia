import { useState, useContext } from "react"
import { AuthContext } from "../../auth/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"

// Inline Icons
const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const IconArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

function LoginPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [serverError, setServerError] = useState("");

    const onSubmit = async (data) => {
        setServerError("");
        try {
            const response = await login(data.email, data.password);

            if (response.data.success) {
                const user = response.data.data.user;
                if (user?.role_id === 1) {
                    navigate('/admin/dashboard');
                } else if (user?.role_id === 2) {
                    navigate('/employer/dashboard');
                } else if (user?.role_id === 3) {
                    navigate('/candidate/dashboard');
                }
            } else {
                setServerError(response.data.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login submission error:", error);
            const message = error.response?.data?.message || error.response?.data?.errors || "Invalid email or password. Please try again.";
            setServerError(typeof message === 'object' ? Object.values(message).flat()[0] : message);
        }
    }

    return (
        <div className="min-h-screen bg-white lg:bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center group">
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">
                            Work<span className="text-primary">opia</span>
                        </span>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white lg:shadow-2xl lg:shadow-primary/30 rounded-3xl p-8 md:p-12 border border-transparent lg:border-gray-100">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 font-medium">
                            Please enter your details to sign in to your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {serverError && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center animate-shake">
                                <span className="mr-2">⚠️</span> {serverError}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                    <IconMail />
                                </div>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/10'} rounded-2xl text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:ring-4 focus:bg-white focus:border-primary transition-all`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                    })}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest text-left">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-black text-primary hover:underline">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                                    <IconLock />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.password ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary/10'} rounded-2xl text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:ring-4 focus:bg-white focus:border-primary transition-all`}
                                    {...register("password", { required: "Password is required" })}
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.password.message}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-black hover:bg-primary-dark shadow-xl shadow-primary/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Sign In <IconArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 font-bold text-sm">
                            New to Workopia?{" "}
                            <Link to="/register" className="text-primary hover:underline">
                                Create an account
                            </Link>
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

export default LoginPage


