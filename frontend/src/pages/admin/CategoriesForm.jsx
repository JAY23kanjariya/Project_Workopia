import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import * as categoryApi from "../../api/categoryApi";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import Loader from "../../components/common/Loader";

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
    const [error, setError] = useState("");

    // Restrict access
    useEffect(() => {
        if (user && user.role_id !== 1) {
            navigate("/admin/dashboard");
        }
    }, [user, navigate]);

    // Fetch data for edit
    useEffect(() => {
        if (isEdit) {
            const fetchCategory = async () => {
                try {
                    const res = await categoryApi.getCategoryById(id);
                    if (res.data.success) {
                        const c = res.data.category;
                        reset({
                            name: c.name,
                            description: c.description || "",
                            status: c.status
                        });
                    }
                } catch {
                    setError("Failed to load category");
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
            setError("");

            const payload = { ...data, status: Number(data.status) };

            if (isEdit) {
                await categoryApi.updateCategory(id, payload);
            } else {
                await categoryApi.createCategory(payload);
            }

            navigate("/admin/categories");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <Loader text="Loading..." />;

    return (
        <div className="max-w-xl mx-auto p-6">
            <Link to="/admin/categories" className="text-sm text-blue-600">
                ← Back
            </Link>

            <h2 className="text-2xl font-bold mt-4 mb-6">
                {isEdit ? "Edit Category" : "Create Category"}
            </h2>

            {error && (
                <p className="text-red-500 mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Name */}
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        rows="3"
                        {...register("description")}
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block mb-1">Status</label>
                    <select
                        className="w-full border p-2 rounded"
                        {...register("status")}
                    >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/categories")}
                        className="bg-gray-200 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}