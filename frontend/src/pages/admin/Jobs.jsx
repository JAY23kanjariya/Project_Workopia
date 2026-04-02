import { useEffect, useState } from "react";
import * as jobApi from "../../api/jobApi";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";

export default function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);

    // ✅ NEW: separate input + debounced search
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    // ✅ NEW: delete loading per row
    const [deletingId, setDeletingId] = useState(null);

    // ✅ Debounce search
    useEffect(() => {
        const delay = setTimeout(() => {
            setSearch(searchInput);
        }, 500);

        return () => clearTimeout(delay);
    }, [searchInput]);

    // ✅ Reset page when search changes
    useEffect(() => {
        setPage(1);
    }, [search]);

    const fetchAllJobs = async (pageNumber = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: pageNumber,
                title: search
            };

            const response = await jobApi.getJobs(params);

            if (response.data.success) {
                setJobs(response.data.jobPosts?.data || []);
                setPagination({
                    current_page: response.data.jobPosts?.current_page || 1,
                    last_page: response.data.jobPosts?.last_page || 1,
                    total: response.data.jobPosts?.total || 0
                });
            }
        } catch (err) {
            console.error("Fetch jobs error:", err);
            setError("Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllJobs(page);
    }, [page, search]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this job?")) return;

        try {
            setDeletingId(id);

            const response = await jobApi.adminDeleteJob(id);

            if (response.data.success) {
                fetchAllJobs(page);
            }
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        } finally {
            setDeletingId(null);
        }
    };


    // Table
    const columns = [
        {
            header: "Title",
            accessor: "title",
            render: (job) => <span className="font-bold">{job.title}</span>,
        },
        {
            header: "Company",
            render: (job) => job.employer?.name || "Unknown",
        },
        {
            header: "Category",
            render: (job) => job.category?.name || "N/A",
        },
        {
            header: "Status",
            render: (job) => (
                <Badge
                    label={job.status ? "Active" : "Closed"}
                    variant={job.status ? "success" : "danger"}
                />
            ),
        },
        {
            header: "Actions",
            align: "right",
            render: (job) => (
                <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    className="text-red-600"
                >
                    {deletingId === job.id ? "..." : "Delete"}
                </button>
            ),
        },
    ];
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <h2 className="text-3xl font-black mb-6">Jobs</h2>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="mb-6 w-full px-4 py-3 border rounded-xl"
                />

                {/* Content */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">

                    {loading ? (
                        <Loader text="Loading jobs..." />
                    ) : error ? (
                        <div className="p-6 text-red-500">{error}</div>
                    ) : jobs.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No jobs found
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={jobs}
                            loading={loading}
                            emptyText="No jobs found"
                        />
                    )}

                    {/* Pagination */}
                    {!loading && pagination.last_page > 1 && (
                        <div className="p-4">
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