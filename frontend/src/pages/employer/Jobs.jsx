import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as jobApi from "../../api/jobApi";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";

// Icons
const IconBriefcase = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
);

export default function EmployerJobs() {
    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // ✅ debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(t);
    }, [search]);

    const fetchJobs = async () => {
        try {
            setLoading(true);

            const res = await jobApi.getJobs({
                page,
                title: debouncedSearch,
                employer_id: user?.id,
            });

            if (res.data.success) {
                const data = res.data.jobPosts;

                setJobs(data?.data || []);
                setPagination({
                    current_page: data?.current_page || 1,
                    last_page: data?.last_page || 1,
                    total: data?.total || 0,
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchJobs();
    }, [page, debouncedSearch, user?.id]);

    const handleDelete = async () => {
        try {
            await jobApi.deleteJob(deleteId);
            setDeleteId(null);
            fetchJobs();
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Jobs</h2>
                <Link
                    to="/employer/jobs/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    + New Job
                </Link>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-4 p-3 border rounded"
            />

            {/* Content */}
            {loading ? (
                <Loader />
            ) : jobs.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <IconBriefcase />
                    <p>No jobs found</p>
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="border rounded overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Title</th>
                                    <th className="p-3 text-left">Location</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job.id} className="border-t">
                                        <td className="p-3">{job.title}</td>
                                        <td className="p-3">{job.location}</td>

                                        <td className="p-3 text-center">
                                            <span
                                                className={
                                                    job.status
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {job.status ? "Active" : "Closed"}
                                            </span>
                                        </td>

                                        <td className="p-3 text-right space-x-2">
                                            <Link
                                                to={`/employer/applications?job_id=${job.id}`}
                                                className="text-blue-600"
                                            >
                                                Applicants
                                            </Link>

                                            <Link
                                                to={`/employer/jobs/${job.id}`}
                                                className="text-gray-600"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => setDeleteId(job.id)}
                                                className="text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination?.last_page > 1 && (
                        <div className="mt-4">
                            <Pagination
                                pagination={pagination}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow">
                        <p className="mb-4">Delete this job?</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}