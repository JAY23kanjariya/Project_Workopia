import { useEffect, useState } from "react";
import { adminGetUser, adminDeleteUser } from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);

  // Search input
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Row deletion loading
  const [deletingId, setDeletingId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  // Reset page on search
  useEffect(() => setPage(1), [search]);

  // Fetch users
  const fetchUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = { page: pageNumber, search };
      const res = await adminGetUser(params);

      if (res.data.success) {
        setUsers(res.data.users?.data || res.data.users || []);
        setPagination({
          current_page: res.data.users?.current_page || 1,
          last_page: res.data.users?.last_page || 1,
          total: res.data.users?.total || res.data.users?.length || users.length,
        });
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page, search]);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingId(id);
      await adminDeleteUser(id);
      fetchUsers(page);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-black mb-6">Users</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="mb-6 w-full px-4 py-3 border rounded-xl"
        />

        {/* Content */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {loading ? (
            <Loader text="Loading users..." />
          ) : error ? (
            <div className="p-6 text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No users found</div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-4 font-bold">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role_id === 1 ? "Admin" : "User"}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id || user.role_id === 1}
                        className="text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === user.id || user.role_id === 1 ? "" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {!loading && pagination.last_page > 1 && (
            <div className="p-4">
              <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}