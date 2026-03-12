import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";

// Inline Icons
const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="12" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export default function Users() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/users?page=${pageNumber}`);
            if (response.data.success) {
                setUsers(response.data.users?.data || []);
                setPagination({
                    current_page: response.data.users?.current_page || 1,
                    last_page: response.data.users?.last_page || 1,
                    total: response.data.users?.total || 0,
                    from: response.data.users?.from,
                    to: response.data.users?.to
                });
            }
        } catch (err) {
            console.error("Fetch users error:", err);
            setError("Failed to load users. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            setLoading(true);
            const response = await api.delete(`/admin/users/${id}`);
            if (response.data.success) {
                fetchUsers(page);
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.response?.data?.message || "Failed to delete user.");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between mb-12">
                    <div className="flex-1 min-w-0">
                        <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                            User Governance
                        </span>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                            Platform Members
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            Manage all platform members and maintain ecosystem integrity.
                        </p>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Registers</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{pagination.total || 0}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Active Employers</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">
                            {users.filter(u => u.role_id === 2).length}/20
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Talent Pool</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">
                            {users.filter(u => u.role_id === 3).length}/45
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
                            placeholder="Search by name or email identity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white shadow-xl rounded-[2rem] overflow-hidden border border-gray-100">
                    {loading ? (
                        <Loader text="Retrieving member records..." />
                    ) : error ? (
                        <div className="py-20 text-center">
                            <p className="text-red-500 font-black">{error}</p>
                            <button
                                onClick={() => fetchUsers(page)}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                Reload Records
                            </button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 text-lg font-black tracking-tight">No members match your criteria</p>
                            <p className="text-gray-400 text-sm mt-2">Adjust your search filters to find who you're looking for.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            User Profile
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Access Level
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Registration Date
                                        </th>
                                        <th scope="col" className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Operations
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-black text-lg border border-primary/10">
                                                            {u.name?.substring(0, 1)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-black text-gray-900 tracking-tight">{u.name}</div>
                                                        <div className="text-xs font-bold text-gray-400 mt-0.5">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none
                                                    ${u.role_id === 1 ? "bg-red-100 text-red-600" :
                                                        u.role_id === 2 ? "bg-primary/10 text-primary" :
                                                            "bg-teal-100 text-teal-600"}`}>
                                                    {u.role_id === 1 ? "Administrator" :
                                                        u.role_id === 2 ? "Employer" : "Candidate"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-500">
                                                {new Date(u.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                {currentUser?.id !== u.id && (
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="text-red-600 hover:text-white hover:bg-red-600 border border-red-50 p-2 rounded-xl transition-all ml-auto flex items-center justify-center shadow-sm"
                                                        title="Revoke Access"
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                )}
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

