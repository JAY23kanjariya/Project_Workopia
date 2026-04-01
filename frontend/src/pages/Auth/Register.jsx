import { useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

function CreateAccountPage() {
    const { createUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const [serverError, setServerError] = useState("");

    const onSubmit = async (data) => {
        setServerError("");
        try {
            await createUser(data);
            navigate("/login");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Registration failed";
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
                        Register
                    </h1>

                    {serverError && (
                        <p className="text-red-500 text-sm mb-4">
                            {serverError}
                        </p>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Role */}
                        <div>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                {...register("role_id", { required: "Role is required" })}
                            >
                                <option value="">Select Role</option>
                                <option value="3">Candidate</option>
                                <option value="2">Employer</option>
                            </select>
                            {errors.role_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.role_id.message}
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.name ? "border-red-300" : "border-gray-300"
                                    }`}
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.email ? "border-red-300" : "border-gray-300"
                                    }`}
                                {...register("email", { required: "Email is required" })}
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
                                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.password ? "border-red-300" : "border-gray-300"
                                    }`}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Minimum 6 characters"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.confirmPassword ? "border-red-300" : "border-gray-300"
                                    }`}
                                {...register("confirmPassword", {
                                    required: "Confirm your password",
                                    validate: (val) =>
                                        val === watch("password") || "Passwords do not match"
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white py-2 rounded-md text-sm font-semibold hover:bg-primary-dark transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Register"}
                        </button>
                    </form>

                    {/* Login */}
                    <p className="text-sm text-gray-600 mt-4 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountPage;