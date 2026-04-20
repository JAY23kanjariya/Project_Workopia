"use client";

import { useEffect, useState } from "react";
import { adminGetUser, adminDeleteUser } from "@/service/adminService";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { toast } from "react-hot-toast";
import { FiSearch, FiTrash2, FiUser, FiMail, FiShield, FiMoreVertical } from "react-icons/fi";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // 🔍 Debounce search
    useEffect(() => {
        const delay = setTimeout(() => setSearch(searchInput), 600);
        return () => clearTimeout(delay);
    }, [searchInput]);

    // Reset page on search
    useEffect(() => setPage(1), [search]);

    // 📡 Fetch users
    const fetchUsers = async (pageNumber = 1) => {
        try {
            setLoading(true);
            setError(null);

            const res = await adminGetUser(search, pageNumber); 

            if (res.data.success) {
                // The backend returns a paginated 'users' object
                const usersData = res.data.users;
                
                setUsers(usersData.data || []); 
                setPagination({
                    current_page: usersData.current_page || 1,
                    last_page: usersData.last_page || 1,
                    total: usersData.total || 0,
                });
            } else {
                setError("Failed to fetch users");
            }
        } catch (err) {
            console.error("Fetch Users Error:", err);
            setError("Could not load users. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page, search]);

    // ❌ Delete user
    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to permanently delete user "${name}"? This action cannot be undone.`)) return;

        try {
            setDeletingId(id);
            await adminDeleteUser(id);
            toast.success("User account deleted successfully");
            fetchUsers(page);
        } catch (err) {
            console.error("Delete Error:", err);
            toast.error("Failed to delete user. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage accounts, roles, and system access.</p>
                </div>
                
                <div className="relative w-full md:w-80 group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Table Card Container */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {loading && users.length === 0 ? (
                    <Loader text="Retrieving user database..." />
                ) : error ? (
                    <div className="p-20 text-center">
                        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full mb-4">
                            <FiShield className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{error}</h3>
                        <button onClick={() => fetchUsers(page)} className="mt-4 text-indigo-600 font-bold hover:underline">Try Again</button>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="inline-flex p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
                            <FiUser className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-500 italic">No matching users found</h3>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 uppercase tracking-widest text-[10px] font-black text-gray-400">
                                    <th className="px-8 py-5">User Information</th>
                                    <th className="px-8 py-5">Role & Permission</th>
                                    <th className="px-8 py-5">Joined Date</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => (
                                    <tr key={user?.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-50 to-blue-50 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100 shadow-sm transition-transform group-hover:scale-105">
                                                    {user?.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors leading-none mb-1">
                                                        {user?.name}
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                                        <FiMail className="w-3 h-3 shrink-0" />
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge 
                                                variant={user.role_id === 1 ? "purple" : user.role_id === 2 ? "info" : "success"}
                                                className="uppercase tracking-widest text-[9px] font-black"
                                            >
                                                {user.role_id === 1 ? "Super Admin" : user.role_id === 2 ? "Employer" : "Candidate"}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-gray-400 italic">
                                            {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    disabled={deletingId === user.id || user.role_id === 1}
                                                    className={`p-2 rounded-xl transition-all duration-200 ${
                                                        user.role_id === 1 
                                                        ? "text-gray-200 cursor-not-allowed" 
                                                        : "text-red-500 hover:text-red-600 hover:bg-red-100 hover:shadow-lg hover:shadow-red-100"
                                                    }`}
                                                    title={user.role_id === 1 ? "Cannot delete admin account" : "Delete User"}
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                                {/* <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                    <FiMoreVertical className="w-5 h-5" />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 📄 Pagination Section */}
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