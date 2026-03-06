import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

// Inline Icons
const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const IconEdit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="12" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export default function Categories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);

    const fetchCategories = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/categories?page=${pageNumber}`);
            if (response.data.success) {
                setCategories(response.data.categories.data || []);
                setPagination({
                    current_page: response.data.categories.current_page,
                    last_page: response.data.categories.last_page,
                    total: response.data.categories.total,
                    from: response.data.categories.from,
                    to: response.data.categories.to
                });
            }
        } catch (err) {
            console.error("Fetch categories error:", err);
            setError("Failed to load categories. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/categories/${deleteId}`);
            setDeleteId(null);
            fetchCategories(page);
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete category.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-3xl font-extrabold leading-7 text-gray-900 sm:text-4xl sm:truncate">
                            Job Categories
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage the industries and sectors available for job listings.
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <Link
                            to="/admin/categories/create"
                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                        >
                            <span className="mr-2"><IconPlus /></span> Add New Category
                        </Link>
                    </div>
                </div>

                {/* Stats / Search Row (Optional Placeholder) */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <IconSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                            <p className="mt-4 text-gray-500 font-medium">Loading categories...</p>
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <p className="text-red-500 font-semibold">{error}</p>
                            <button
                                onClick={() => fetchCategories(page)}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Try Refreshing
                            </button>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 text-lg">No categories found.</p>
                            <Link to="/admin/categories/create" className="text-indigo-600 font-semibold hover:underline">
                                Create your first one now
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Category Info
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{category.name}</div>
                                                <div className="text-xs text-gray-400">ID: #{category.id}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm text-gray-600 max-w-xs truncate">
                                                    {category.description || <span className="text-gray-300 italic">No description</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold leading-4 transition-colors
                                                    ${category.status
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"}`}>
                                                    <span className={`h-2 w-2 rounded-full mr-2 ${category.status ? "bg-green-500" : "bg-red-500"}`}></span>
                                                    {category.status ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        to={`/admin/categories/${category.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors"
                                                        title="Edit Category"
                                                    >
                                                        <IconEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(category.id)}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Bar */}
                    {!loading && !error && categories.length > 0 && pagination.last_page > 1 && (
                        <div className="px-8 py-5 bg-white border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-semibold text-gray-900">{pagination.from}-{pagination.to}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={page === pagination.last_page}
                                    onClick={() => setPage(page + 1)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setDeleteId(null)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-red-600">
                                        <IconTrash />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                            Delete Category
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this category? This action cannot be undone. Any jobs associated with this category might be affected.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-2 bg-red-600 text-base font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm transition-all"
                                >
                                    Delete Forever
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteId(null)}
                                    className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
