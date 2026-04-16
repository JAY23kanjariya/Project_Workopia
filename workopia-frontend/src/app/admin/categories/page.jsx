"use client";

import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "@/service/categoriesService";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiPlus, FiSearch, FiTrash2, FiEdit3, FiLayers, FiInfo, FiTag } from "react-icons/fi";

export default function CategoriesPage() {
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // 📡 fetch categories
    const fetchCategories = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await getCategories({
                page: pageNumber,
                search: search,
            });

            if (res.data.success) {
                const data = res.data.categories;
                // Support both paginated and flat data
                setCategories(data.data || data || []);
                setPagination({
                    current_page: data.current_page || 1,
                    last_page: data.last_page || 1,
                    total: data.total || 0
                });
            }
        } catch (err) {
            console.error("Fetch Categories Error:", err);
            toast.error("Failed to load categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 🔍 debounce search
    useEffect(() => {
        const delay = setTimeout(() => setSearch(searchInput), 600);
        return () => clearTimeout(delay);
    }, [searchInput]);

    // Reset page on search
    useEffect(() => setPage(1), [search]);

    // Refetch on page/search change
    useEffect(() => {
        fetchCategories(page);
    }, [page, search]);

    // ❌ delete
    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete the category "${name}"? This will affect jobs listed under this category.`)) return;

        try {
            setDeletingId(id);
            await deleteCategory(id);
            toast.success("Category removed successfully");
            fetchCategories(page);
        } catch (err) {
            console.error("Delete Error:", err);
            toast.error("Could not delete category. It might be in use.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Job Categories</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Organize and manage industry classifications.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search bar */}
                    <div className="relative w-full sm:w-80 group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none shadow-sm"
                        />
                    </div>

                    <button
                        onClick={() => router.push("/admin/categories/create")}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                    >
                        <FiPlus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Content card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                {loading && categories.length === 0 ? (
                    <Loader text="Initializing category catalog..." />
                ) : categories.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4">
                            <FiTag className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No Categories Found</h3>
                        <p className="text-sm text-gray-400 max-w-xs mt-1 italic">There aren't any categories matching your criteria. Try adding a new one or broadening your search.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 uppercase tracking-widest text-[10px] font-black text-gray-400">
                                    <th className="px-8 py-5">Category Detail</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Created On</th>
                                    <th className="px-8 py-5 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {categories.map((category) => (
                                    <tr key={category.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 shadow-sm group-hover:rotate-6 transition-transform">
                                                    <FiLayers className="w-5 h-5" />
                                                </div>
                                                <div className="max-w-xs">
                                                    <p className="text-sm font-extrabold text-gray-900 leading-none mb-1.5">{category.name}</p>
                                                    <p className="text-xs text-gray-400 line-clamp-1 italic">{category.description || "No description provided."}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={category.status ? "success" : "disabled"}>
                                                {category.status ? "Active" : "Archived"}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-gray-400 flex items-center gap-1.5 mt-2">
                                            <FiInfo className="w-3.5 h-3.5" />
                                            {new Date(category.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 translate-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                <button
                                                    onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                                                    className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Category"
                                                >
                                                    <FiEdit3 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    disabled={deletingId === category.id}
                                                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-20"
                                                    title="Delete Category"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && pagination.last_page > 1 && (
                    <div className="border-t border-gray-50 bg-slate-50/20 py-4">
                        <Pagination
                            pagination={pagination}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}