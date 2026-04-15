import { useEffect, useState } from "react";
import * as categoryApi from "../../api/categoryApi";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import SearchInput from "../../components/ui/SearchInput";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch categories
    const fetchCategories = async (pageNumber = 1, searchQuery = "") => {
        try {
            setLoading(true);
            const res = await categoryApi.getCategories({ 
                page: pageNumber,
                search: searchQuery 
            });
            if (res.data.success) {
                if (res.data.categories?.data) {
                    setCategories(res.data.categories.data);
                    setPagination({
                        current_page: res.data.categories.current_page,
                        last_page: res.data.categories.last_page,
                    });
                } else {
                    setCategories(res.data.categories || []);
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
        const delayDebounceFn = setTimeout(() => {
            setPage(1); // reset to page 1 on new search
            fetchCategories(1, searchInput);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]);

    useEffect(() => {
        fetchCategories(page, searchInput);
    }, [page]);

    // Delete category
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;

        try {
            setDeletingId(id);
            await categoryApi.deleteCategory(id);
            fetchCategories(page);
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        } finally {
            setDeletingId(null);
        }
    };



    // table
    const columns = [
        {
            header: "Name",
            accessor: "name",
            render: (category) => <span className="font-bold">{category.name}</span>,
        },
        {
            header: "Description",
            accessor: "description",
            render: (category) => <span className="font-bold">{category.description}</span>,
        },
        {
            header: "Status",
            accessor: "status",
            render: (category) => <span className="font-bold">{category.status === 1 ? "Active" : "Inactive"}</span>,
        },
        {
            header: "Created At",
            accessor: "created_at",
            render: (category) => <span className="font-bold">{category.created_at.split('T')[0]}</span>,
        },
        {
            header: "Actions",
            align: "right",
            render: (category) => (
                <button
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="text-red-600"
                >
                    {deletingId === category.id ? "..." : "Delete"}
                </button>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* Header */}

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Categories</h1>
                <button
                    onClick={() => navigate("/admin/categories/create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Create Category
                </button>
            </div>


            {/* Search */}
            <SearchInput
                placeholder="Search categories..."
                value={searchInput}
                onChange={(val) => setSearchInput(val)}
            />

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                {loading ? (
                    <Loader />
                ) : (
                    <DataTable
                        columns={columns}
                        data={categories}
                        loading={loading}
                        emptyText="No categories found"
                    />
                )}

                {/* Pagination */}
                {!loading && pagination.last_page > 1 && (
                    <div className="p-4 border-t">
                        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
                    </div>
                )}
            </div>
        </div>
    );
}