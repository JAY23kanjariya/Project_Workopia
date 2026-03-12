import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as categoryApi from "../../api/categoryApi";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";

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
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCategories = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await categoryApi.getCategories({ page: pageNumber });
            if (response.data.success) {
                // Check if categories are paginated or just a list
                if (response.data.categories?.data) {
                    setCategories(response.data.categories.data || []);
                    setPagination({
                        current_page: response.data.categories.current_page,
                        last_page: response.data.categories.last_page,
                        total: response.data.categories.total
                    });
                } else {
                    setCategories(response.data.categories || []);
                    setPagination({ last_page: 1 });
                }
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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            setLoading(true);
            const response = await categoryApi.deleteCategory(id);
            if (response.data.success) {
                if (page > 1 && categories.length === 1) {
                    setPage(page - 1);
                } else {
                    fetchCategories(page);
                }
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.response?.data?.message || "Failed to delete category.");
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between mb-12">
                    <div className="flex-1 min-w-0">
                        <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                            Industry Taxonomy
                        </span>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                            Market Categories
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            Organize job listings by defining high-level sectors.
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <Link
                            to="/admin/categories/create"
                            className="inline-flex items-center px-8 py-4 border border-transparent rounded-2xl shadow-xl shadow-primary/10 text-xs font-black uppercase tracking-widest text-white bg-primary hover:bg-primary-dark transition-all active:scale-95"
                        >
                            <span className="mr-2"><IconPlus /></span> New Sector
                        </Link>
                    </div>
                </div>

                {/* Taxonomy Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Sectors</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{pagination.total || categories.length}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Market Reach</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">
                            {categories.filter(c => c.status).length} Functional
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <IconSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter categories by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    {loading ? (
                        <Loader text="Organizing categories..." />
                    ) : error ? (
                        <div className="py-20 text-center">
                            <p className="text-red-500 font-bold">{error}</p>
                            <button
                                onClick={() => fetchCategories(page)}
                                className="mt-4 text-primary font-black hover:underline"
                            >
                                Reload Data
                            </button>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 text-lg font-black tracking-tight">No results found.</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or create a new category.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Name & ID
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Description
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Status
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Manage
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="text-sm font-black text-gray-900 tracking-tight">{category.name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">#{category.id}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm text-gray-500 max-w-xs truncate font-medium">
                                                    {category.description || <span className="text-gray-300 italic">No description provided</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none
                                                    ${category.status
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full mr-2 ${category.status ? "bg-green-500" : "bg-red-500"}`}></span>
                                                    {category.status ? "Visible" : "Hidden"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        to={`/admin/categories/${category.id}`}
                                                        className="text-primary hover:text-white hover:bg-primary border border-primary/10 p-2 rounded-xl transition-all"
                                                        title="Edit Category"
                                                    >
                                                        <IconEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="text-red-600 hover:text-white hover:bg-red-600 border border-red-100 p-2 rounded-xl transition-all"
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
                    {!loading && pagination.last_page > 1 && (
                        <div className="px-8 py-5 bg-white border-t border-gray-100">
                            <Pagination 
                                pagination={pagination} 
                                onPageChange={(p) => setPage(p)} 
                            />
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}

