import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as jobApi from "../../api/jobApi";
import * as categoryApi from "../../api/categoryApi";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../components/common/Loader";

// Icons
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const IconSave = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);

const IconAlertCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

export default function EmployerJobsForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { user } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        // Fetch categories for dropdown
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.getCategories({ all: 'true' });
                if (res.data.success) {
                    // Check if categories are paginated or just a list
                    setCategories(res.data.categories.data || res.data.categories || []);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();

        if (isEdit) {
            const fetchJob = async () => {
                try {
                    setFetching(true);
                    const res = await jobApi.getJobById(id);
                    if (res.data.success) {
                        const job = res.data.jobPost;
                        reset({
                            title: job.title,
                            category_id: job.category_id,
                            location: job.location,
                            description: job.description,
                            status: job.status ? 1 : 0
                        });
                    }
                } catch (err) {
                    console.error("Error fetching job:", err);
                    setServerError("Failed to retrieve advertisement details.");
                } finally {
                    setFetching(false);
                }
            };
            fetchJob();
        }
    }, [id, isEdit, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setServerError(null);
            
            const payload = {
                ...data,
                status: Number(data.status),
                category_id: Number(data.category_id)
            };

            if (isEdit) {
                await jobApi.updateJob(id, payload);
            } else {
                await jobApi.createJob(payload);
            }
            navigate('/employer/jobs');
        } catch (err) {
            console.error("Submission error:", err);
            const msg = err.response?.data?.message || "Action failed. Please try again later.";
            setServerError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <Loader text="Preparing your desk..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/employer/jobs" className="inline-flex items-center text-sm font-black text-gray-500 hover:text-primary mb-6 transition-all">
                    <span className="mr-2"><IconArrowLeft /></span> Back to Management
                </Link>

                <div className="bg-white shadow-2xl shadow-primary/30 rounded-[2rem] overflow-hidden border border-gray-100">
                    <div className="px-10 py-8 bg-white border-b border-gray-50">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {isEdit ? "Refine Job Post" : "Draft New Opportunity"}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 font-medium">
                            {isEdit ? "Modify your listing to better attract talent." : "Define the role and requirements to begin your search."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
                        {serverError && (
                            <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start shadow-sm shadow-red-100">
                                <span className="text-red-500 mr-4 shrink-0"><IconAlertCircle /></span>
                                <span className="text-sm text-red-700 font-bold tracking-tight">{serverError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Professional Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Lead Frontend Architect"
                                    {...register("title", { required: "A title is required" })}
                                    className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold text-gray-900 ${errors.title ? 'border-red-200' : 'border-gray-100'}`}
                                />
                                {errors.title && <p className="mt-2 text-xs text-red-500 font-black">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Market Sector</label>
                                <div className="relative">
                                    <select
                                        {...register("category_id", { required: "Please select a category" })}
                                        className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold text-gray-900 appearance-none ${errors.category_id ? 'border-red-200' : 'border-gray-100'}`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                                {errors.category_id && <p className="mt-2 text-xs text-red-500 font-black">{errors.category_id.message}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Workplace Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Global Remote / London"
                                    {...register("location", { required: "Location is required" })}
                                    className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold text-gray-900 ${errors.location ? 'border-red-200' : 'border-gray-100'}`}
                                />
                                {errors.location && <p className="mt-2 text-xs text-red-500 font-black">{errors.location.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Role Overview & Requirements</label>
                                <textarea
                                    rows="8"
                                    placeholder="Detail the mission, stack, and expectations..."
                                    {...register("description", { required: "A description is essential" })}
                                    className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-medium text-gray-600 resize-none ${errors.description ? 'border-red-200' : 'border-gray-100'}`}
                                />
                                {errors.description && <p className="mt-2 text-xs text-red-500 font-black">{errors.description.message}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Post Visibility</label>
                                <div className="relative">
                                    <select
                                        {...register("status")}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold text-gray-900 appearance-none"
                                    >
                                        <option value={1}>Publicly Available</option>
                                        <option value={0}>Unlisted / Closed</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col md:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/10 hover:bg-primary-dark hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving Changes...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <span className="mr-3"><IconSave /></span>
                                        {isEdit ? "Update Registry" : "Publish Listing"}
                                    </div>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/employer/jobs')}
                                className="px-10 py-5 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


