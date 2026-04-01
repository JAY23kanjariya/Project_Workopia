import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as categoryApi from "../../api/categoryApi";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCategories = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const res = await categoryApi.getCategories({ page: pageNumber });

            if (res.data.success) {
                if (res.data.categories?.data) {
                    setCategories(res.data.categories.data);
                    setPagination({
                        current_page: res.data.categories.current_page,
                        last_page: res.data.categories.last_page,
                    });
                } else {
                    setCategories(res.data.categories);
                    setPagination({ last_page: 1 });
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;

        await categoryApi.deleteCategory(id);
        fetchCategories(page);
    };

    const filtered = categories.filter((c) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Categories</h1>

                <Link
                    to="/admin/categories/create"
                    className="px-3 py-2 bg-primary text-white text-sm rounded-md"
                >
                    Add Category
                </Link>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                {loading ? (
                    <Loader text="Loading..." />
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((cat) => (
                                    <tr key={cat.id} className="border-t">
                                        <td className="px-4 py-2">{cat.name}</td>
                                        <td className="px-4 py-2 text-gray-500">
                                            {cat.description || "-"}
                                        </td>
                                        <td className="px-4 py-2">
                                            {cat.status ? (
                                                <span className="text-green-600">Active</span>
                                            ) : (
                                                <span className="text-red-500">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-right space-x-2">
                                            <Link
                                                to={`/admin/categories/${cat.id}`}
                                                className="text-primary text-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="text-red-500 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {!loading && pagination.last_page > 1 && (
                    <div className="p-4 border-t">
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