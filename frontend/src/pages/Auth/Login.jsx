import { useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

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

                if (user?.role_id === 1) navigate("/admin/dashboard");
                else if (user?.role_id === 2) navigate("/employer/dashboard");
                else if (user?.role_id === 3) navigate("/candidate/dashboard");
            } else {
                setServerError(response.data.message || "Login failed");
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Invalid email or password";
            setServerError(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-6">
                    <Link to="/" className="text-2xl font-semibold text-gray-900">
                        Work<span className="text-primary">opia</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">

                    <h1 className="text-xl font-semibold text-gray-900 mb-4">
                        Login 
                    </h1>

                    {serverError && (
                        <p className="text-red-500 text-sm mb-4">
                            {serverError}
                        </p>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                                    errors.email ? "border-red-300" : "border-gray-300"
                                }`}
                                {...register("email", {
                                    required: "Email is required"
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none ${
                                    errors.password ? "border-red-300" : "border-gray-300"
                                }`}
                                {...register("password", {
                                    required: "Password is required"
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white py-2 rounded-md text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Loading..." : "Login"}
                        </button>
                    </form>

                    {/* Register */}
                    <p className="text-sm text-gray-600 mt-4 text-center">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-primary">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;