import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import * as jobApi from "../../api/jobApi";
import * as categoryApi from "../../api/categoryApi";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../components/common/Loader";

export default function EmployerJobsForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            status: 1
        }
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [serverError, setServerError] = useState("");

    // Fetch categories + job (edit)
    useEffect(() => {
        const loadData = async () => {
            try {
                // categories
                const catRes = await categoryApi.getCategories({ all: "true" });
                if (catRes.data.success) {
                    setCategories(catRes.data.categories?.data || catRes.data.categories || []);
                }

                // edit job
                if (isEdit) {
                    const jobRes = await jobApi.getJobById(id);
                    if (jobRes.data.success) {
                        const job = jobRes.data.jobPost;

                        reset({
                            title: job?.title || "",
                            category_id: job?.category_id || "",
                            location: job?.location || "",
                            description: job?.description || "",
                            status: job?.status ? 1 : 0
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                setServerError("Failed to load data");
            } finally {
                setFetching(false);
            }
        };

        loadData();
    }, [id]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setServerError("");

            const payload = {
                ...data,
                employer_id: user?.id, // ✅ FIX
                category_id: Number(data.category_id),
                status: Number(data.status)
            };

            if (isEdit) {
                await jobApi.updateJob(id, payload);
            } else {
                await jobApi.createJob(payload);
            }

            navigate("/employer/jobs");
        } catch (err) {
            console.error(err);
            setServerError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    {isEdit ? "Edit Job" : "Create Job"}
                </h2>
                <Link to="/employer/jobs" className="text-blue-600">
                    Back
                </Link>
            </div>

            {/* Error */}
            {serverError && (
                <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Title */}
                <input
                    placeholder="Job Title"
                    {...register("title", { required: "Title required" })}
                    className="w-full p-3 border rounded"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                {/* Category */}
                <select
                    {...register("category_id", { required: "Category required" })}
                    className="w-full p-3 border rounded"
                >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}

                {/* Location */}
                <input
                    placeholder="Location"
                    {...register("location", { required: "Location required" })}
                    className="w-full p-3 border rounded"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}

                {/* Description */}
                <textarea
                    placeholder="Job Description"
                    rows={5}
                    {...register("description", { required: "Description required" })}
                    className="w-full p-3 border rounded"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

                {/* Status */}
                <select {...register("status")} className="w-full p-3 border rounded">
                    <option value={1}>Active</option>
                    <option value={0}>Closed</option>
                </select>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white p-3 rounded"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/employer/jobs")}
                        className="flex-1 border p-3 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}