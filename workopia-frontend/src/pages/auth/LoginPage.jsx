import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function LoginPage() {
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [serverErrors, setServerErrors] = useState(null);

    const onSubmit = async (data) => {
        setServerErrors(null);
        try {
            await login(data.email, data.password);
            navigate("/dashboard");
        } catch (error) {
            setServerErrors(
                error.response?.data?.errors || { _form: ["Login failed. Please check your credentials."] }
            );
        }
    };

    return (
        <div className="login-page">
            <h1>Login</h1>
            <div className="form-box">
                <form onSubmit={handleSubmit(onSubmit)} className="form login-form">
                    {serverErrors?._form && <p className="error main-error">{serverErrors._form[0]}</p>}

                    <div className="field">
                        <input type="email" placeholder="Email" {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email is invalid" }
                        })} />
                        {errors.email && <p className="error">{errors.email.message}</p>}
                        {serverErrors?.email && <p className="error">{serverErrors.email[0]}</p>}
                    </div>

                    <div className="field">
                        <input type="password" placeholder="Password" {...register("password", {
                            required: "Password is required",
                        })} />
                        {errors.password && <p className="error">{errors.password.message}</p>}
                        {serverErrors?.password && <p className="error">{serverErrors.password[0]}</p>}
                    </div>

                    <div className="field">
                        <button className="submit-btn" disabled={isSubmitting} type="submit">
                            {isSubmitting ? "Submitting..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}
