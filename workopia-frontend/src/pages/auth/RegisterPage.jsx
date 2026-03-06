import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
    const { register, handleSubmit, getValues, formState: { isSubmitting, errors } } = useForm();
    const navigate = useNavigate();
    const { register: registerUser } = useContext(AuthContext);
    const [serverErrors, setServerErrors] = useState(null);

    const onSubmit = async (data) => {
        setServerErrors(null);
        try {
            await registerUser(data);
            navigate("/dashboard");
        } catch (error) {
            setServerErrors(
                error.response?.data?.errors || { _form: ["Registration failed. Please try again."] }
            );
        }
    };

    return (
        <div className="register-page">
            <h1>Register</h1>
            <div className="form-box">
                <form onSubmit={handleSubmit(onSubmit)} className="form register-form">
                    {serverErrors?._form && <p className="error main-error">{serverErrors._form[0]}</p>}

                    <div className="field">
                        <input type="text" placeholder="Name" {...register("name", {
                            required: "Name is required",
                            minLength: { value: 3, message: "Name must be at least 3 characters" }
                        })} />
                        {errors.name && <p className="error">{errors.name.message}</p>}
                        {serverErrors?.name && <p className="error">{serverErrors.name[0]}</p>}
                    </div>

                    <div className="field">
                        <input type="email" placeholder="Email" {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
                        })} />
                        {errors.email && <p className="error">{errors.email.message}</p>}
                        {serverErrors?.email && <p className="error">{serverErrors.email[0]}</p>}
                    </div>

                    <div className="field">
                        <select {...register("role_id", { required: "Please select a role" })}>
                            <option value="">Select Role</option>
                            <option value="3">Candidate (Looking for work)</option>
                            <option value="2">Employer (Hiring)</option>
                        </select>
                        {errors.role_id && <p className="error">{errors.role_id.message}</p>}
                    </div>

                    <div className="field">
                        <input type="password" placeholder="Password" {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 characters" }
                        })} />
                        {errors.password && <p className="error">{errors.password.message}</p>}
                    </div>

                    <div className="field">
                        <input type="password" placeholder="Confirm Password" {...register("password_confirmation", {
                            required: "Please confirm password",
                            validate: (val) => val === getValues("password") || "Passwords don't match"
                        })} />
                        {errors.password_confirmation && <p className="error">{errors.password_confirmation.message}</p>}
                    </div>

                    <div className="field">
                        <button className="submit-btn" disabled={isSubmitting} type="submit">
                            {isSubmitting ? "Submitting..." : "Register"}
                        </button>
                    </div>
                </form>
            </div>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}
