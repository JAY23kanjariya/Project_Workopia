import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as jobApi from "../../api/jobApi";
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

const IconMapPin = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const IconUsers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export default function EmployerJobs() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchJobs = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const params = {
                page: pageNumber,
                title: search,
                employer_id: user?.id
            };

            const response = await jobApi.getJobs(params);
            if (response.data.success) {
                setJobs(response.data.jobPosts.data || []);
                setPagination({
                    current_page: response.data.jobPosts.current_page,
                    last_page: response.data.jobPosts.last_page,
                    total: response.data.jobPosts.total
                });
            }
        } catch (err) {
            console.error("Fetch jobs error:", err);
            setError("Failed to load your job portfolio. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchJobs(page);
        }
    }, [page, search, user?.id]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const response = await jobApi.deleteJob(deleteId);
            if (response.data.success) {
                setDeleteId(null);
                fetchJobs(page);
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.response?.data?.message || "Revocation failed.");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="md:flex md:items-end md:justify-between mb-12">
                    <div className="flex-1 min-w-0">
                        <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                            Portfolio Management
                        </span>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                            Your Job Listings
                        </h2>
                        <p className="mt-2 text-gray-500 font-medium">
                            Manage and hunt for the best talent from your active job inventory.
                        </p>
                    </div>
                    <div className="mt-6 flex md:mt-0 md:ml-4">
                        <Link
                            to="/employer/jobs/create"
                            className="inline-flex items-center px-8 py-4 border border-transparent rounded-2xl shadow-xl shadow-primary/10 text-xs font-black uppercase tracking-widest text-white bg-primary hover:bg-primary-dark transition-all active:scale-95"
                        >
                            <span className="mr-2"><IconPlus /></span> Post New Opportunity
                        </Link>
                    </div>
                </div>

                {/* Portfolio Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Assets</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{pagination.total || 0}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Market Presence</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">
                            {jobs.filter(j => j.status).length} Active
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Reach</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">
                            {[...new Set(jobs.map(j => j.location))].length} Cities
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-10 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <IconSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search listings by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold text-gray-900 shadow-sm"
                        />
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-white shadow-2xl shadow-gray-100 rounded-[2.5rem] overflow-hidden border border-gray-100">
                    {loading ? (
                        <Loader text="Retrieving your records..." />
                    ) : error ? (
                        <div className="py-24 text-center">
                            <p className="text-red-500 font-black text-lg">{error}</p>
                            <button
                                onClick={() => fetchJobs(page)}
                                className="mt-6 text-primary font-black hover:underline uppercase tracking-widest text-xs"
                            >
                                Reconnect
                            </button>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                                <IconBriefcase />
                            </div>
                            <p className="text-gray-500 text-xl font-black tracking-tight">Your portfolio is empty.</p>
                            <Link to="/employer/jobs/create" className="mt-4 inline-block text-primary font-black text-xs uppercase tracking-widest border-b-2 border-primary pb-1">
                                Create your first listing
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Role & Location
                                        </th>
                                        <th scope="col" className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Classification
                                        </th>
                                        <th scope="col" className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Status
                                        </th>
                                        <th scope="col" className="px-10 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Management
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-gray-900 tracking-tight leading-none mb-2">{job.title}</span>
                                                    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <span className="mr-1.5"><IconMapPin /></span>
                                                        {job.location}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border border-primary/10 shadow-sm">
                                                    {job.category?.name || "General"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none
                                                    ${job.status
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full mr-2 ${job.status ? "bg-green-500" : "bg-red-500"}`}></span>
                                                    {job.status ? "Public" : "Closed"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        to={`/employer/applications?job_id=${job.id}`}
                                                        className="text-primary hover:text-white hover:bg-primary border border-primary/10 p-2.5 rounded-xl transition-all shadow-sm"
                                                        title="Candidate Pipeline"
                                                    >
                                                        <IconUsers />
                                                    </Link>
                                                    <Link
                                                        to={`/employer/jobs/${job.id}`}
                                                        className="text-gray-600 hover:text-white hover:bg-gray-800 border border-gray-100 p-2.5 rounded-xl transition-all shadow-sm"
                                                        title="Refine Listing"
                                                    >
                                                        <IconEdit />
                                                    </Link>
                                                    <button
                                                        onClick={() => setDeleteId(job.id)}
                                                        className="text-red-600 hover:text-white hover:bg-red-600 border border-red-100 p-2.5 rounded-xl transition-all shadow-sm"
                                                        title="Revoke Post"
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
                        <div className="px-10 py-6 bg-gray-50/30 border-t border-gray-50">
                            <Pagination 
                                pagination={pagination} 
                                onPageChange={(p) => setPage(p)} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Revocation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setDeleteId(null)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-[2.5rem] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-10 pt-10 pb-8">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-2xl bg-red-100 sm:mx-0 sm:h-12 sm:w-12 text-red-600 shadow-inner">
                                        <IconTrash />
                                    </div>
                                    <div className="mt-6 text-center sm:mt-0 sm:ml-6 sm:text-left">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight" id="modal-title">
                                            Permanent Removal
                                        </h3>
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                                Are you absolutely sure you want to revoke this job listing? All associated candidate data and history will be cleared from our registry.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-10 py-8 sm:flex sm:flex-row-reverse gap-4">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full inline-flex justify-center rounded-2xl px-8 py-4 bg-red-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-95 sm:w-auto"
                                >
                                    Confirm Removal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteId(null)}
                                    className="mt-3 w-full inline-flex justify-center rounded-2xl px-8 py-4 bg-white text-[10px] font-black uppercase tracking-widest text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all active:scale-95 sm:mt-0 sm:w-auto"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
