import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import * as categoryApi from "../../api/categoryApi";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

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

export default function AdminCategoriesForm() {
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
            const fetchCategory = async () => {
                try {
                    setFetching(true);
                    const response = await categoryApi.getCategoryById(id);
                    if (response.data.success) {
                        const category = response.data.category;
                        reset({
                            name: category.name,
                            description: category.description || "",
                            status: category.status
                        });
                    }
                } catch (error) {
                    console.error("Error fetching category:", error);
                    setServerError("Failed to retrieve category details.");
                } finally {
                    setFetching(false);
                }
            };
            fetchCategory();
        }
    }, [id, isEdit, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setServerError(null);

            const payload = {
                ...data,
                status: Number(data.status)
            };

            if (isEdit) {
                await categoryApi.updateCategory(id, payload);
            } else {
                await categoryApi.createCategory(payload);
            }
            navigate('/admin/categories');
        } catch (error) {
            console.error("Submission error:", error);
            if (error.response?.data?.errors) {
                const firstError = Object.values(error.response.data.errors)[0][0];
                setServerError(firstError);
            } else {
                setServerError(error.response?.data?.message || 'Action failed. Please check your network.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <Loader text="Retrieving category details..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <Link
                    to="/admin/categories"
                    className="inline-flex items-center text-sm font-black text-gray-500 hover:text-primary mb-6 transition-all"
                >
                    <span className="mr-2"><IconArrowLeft /></span> Back to Management
                </Link>

                <div className="bg-white shadow-2xl shadow-primary/10 rounded-[2rem] overflow-hidden border border-gray-100">
                    <div className="px-10 py-8 bg-white border-b border-gray-50">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {isEdit ? "Update Sector" : "Initialize New Category"}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 font-medium">
                            {isEdit ? "Edit the classification details." : "Add a new vertical to the job marketplace."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
                        {serverError && (
                            <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start shadow-sm shadow-red-100">
                                <span className="text-red-500 mr-4 shrink-0"><IconAlertCircle /></span>
                                <span className="text-sm text-red-700 font-bold tracking-tight">{serverError}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    disabled={loading}
                                    placeholder="e.g. Engineering & Technology"
                                    {...register("name", {
                                        required: "Name is essential",
                                        maxLength: { value: 100, message: "Limit reached (100 chars)" }
                                    })}
                                    className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-bold text-gray-900
                                        ${errors.name ? 'border-red-200' : 'border-gray-100'}
                                        disabled:opacity-50`}
                                />
                                {errors.name && (
                                    <p className="mt-2 text-xs text-red-500 font-black">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                    Market Description
                                </label>
                                <textarea
                                    disabled={loading}
                                    placeholder="Describe the scope of this industry..."
                                    rows="4"
                                    {...register("description")}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-medium text-gray-600 disabled:opacity-50 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                    Platform Visibility
                                </label>
                                <div className="relative">
                                    <select
                                        disabled={loading}
                                        {...register("status", { required: true })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-bold text-gray-900 appearance-none disabled:opacity-50"
                                    >
                                        <option value={1}>Public / Active</option>
                                        <option value={0}>Internal / Hidden</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col md:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/10 hover:bg-primary-dark hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <span className="mr-2"><IconSave /></span>
                                        {isEdit ? "Update Registry" : "Initialize Category"}
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/admin/categories')}
                                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Discard
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
