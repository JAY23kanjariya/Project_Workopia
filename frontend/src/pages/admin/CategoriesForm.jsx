import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";

// Inline Icons to avoid extra dependencies
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const IconSave = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);

const IconAlertCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

export default function CategoriesForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            status: 1
        }
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [serverError, setServerError] = useState(null);

    // Authorization check
    useEffect(() => {
        if (user && user.role_id !== 1) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    // Fetch existing category data for edit mode
    useEffect(() => {
        if (isEdit) {
            setFetching(true);
            api.get(`/categories/${id}`)
                .then(response => {
                    const category = response.data.category;
                    reset({
                        name: category.name,
                        description: category.description || "",
                        status: category.status
                    });
                })
                .catch(error => {
                    console.error("Error fetching category: ", error);
                    setServerError("Failed to fetch category details.");
                })
                .finally(() => setFetching(false));
        }
    }, [id, isEdit, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setServerError(null);

            // Ensure status is sent as number/boolean as expected by backend
            const payload = {
                ...data,
                status: Number(data.status)
            };

            if (isEdit) {
                await api.put(`/categories/${id}`, payload);
            } else {
                await api.post('/categories', payload);
            }
            navigate('/admin/categories');
        } catch (error) {
            console.error("Submission error:", error);
            if (error.response?.data?.errors) {
                // Handle Laravel validation errors if needed, or generic message
                const firstError = Object.values(error.response.data.errors)[0][0];
                setServerError(firstError);
            } else {
                setServerError(error.response?.data?.message || 'Something went wrong while saving.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Back Link */}
                <Link
                    to="/admin/categories"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <span className="mr-2"><IconArrowLeft /></span> Back to Categories
                </Link>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="px-8 py-6 bg-white border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isEdit ? "Update Category" : "Create New Category"}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {isEdit ? "Modify the details of the existing category." : "Fill in the details to add a new job category."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                        {/* Server Error Alert */}
                        {serverError && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                                <span className="text-red-500 mt-0.5 mr-3 flex-shrink-0"><IconAlertCircle /></span>
                                <span className="text-sm text-red-700 font-medium">{serverError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    disabled={loading}
                                    placeholder="e.g. Software Development"
                                    {...register("name", {
                                        required: "Category name is required",
                                        maxLength: { value: 100, message: "Maximum 100 characters" }
                                    })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition
                                        ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                                        disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Category Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    disabled={loading}
                                    placeholder="Brief description of this category..."
                                    rows="4"
                                    {...register("description")}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                                />
                            </div>

                            {/* Category Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Availability Status
                                </label>
                                <select
                                    disabled={loading}
                                    {...register("status", { required: true })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                                <p className="mt-2 text-xs text-gray-500 italic">
                                    Inactive categories won't be visible to users when posting or searching jobs.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <span className="mr-2"><IconSave /></span>
                                        {isEdit ? "Save Changes" : "Create Category"}
                                    </div>
                                )}
                            </button>

                            {!loading && (
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/categories')}
                                    className="px-6 py-3 border border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}