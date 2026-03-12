import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as jobApi from "../../api/jobApi";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";

// Inline Icons
const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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

const IconBriefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

export default function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchAllJobs = async (pageNumber = 1) => {
        try {
            setLoading(true);
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
            setError("Platform record retrieval encountered an error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllJobs(page);
    }, [page, search]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to revoke this job listing administratively?")) return;
        try {
            setLoading(true);
            const response = await jobApi.adminDeleteJob(id);
            if (response.data.success) {
                fetchAllJobs(page);
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Administrative revocation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="md:flex md:items-end md:justify-between mb-12">
                    <div className="flex-1 min-w-0">
                        <span className="text-primary font-black text-xs uppercase tracking-widest mb-2 block">
                            Global Oversight
                        </span>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                            Marketplace Listings
                        </h2>
                        <p className="mt-2 text-gray-500 font-medium">
                            Administrative control over all active and historical job postings.
                        </p>
                    </div>
                </div>

                {/* Listing Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Live Inventory</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{pagination.total || 0}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Open Roles</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">
                            {jobs.filter(j => j.status).length} Listings
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-transparent hover:border-primary/10 transition-all group">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Categories</h3>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">
                            {[...new Set(jobs.map(j => j.category?.id))].length} Main
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
                            placeholder="Search marketplace by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 border border-gray-100 rounded-2xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold text-gray-900 shadow-sm"
                        />
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-white shadow-2xl shadow-gray-100 rounded-[2.5rem] overflow-hidden border border-gray-100">
                    {loading ? (
                        <Loader text="Auditing marketplace inventory..." />
                    ) : error ? (
                        <div className="py-24 text-center">
                            <p className="text-red-500 font-black text-lg">{error}</p>
                            <button
                                onClick={() => fetchAllJobs(page)}
                                className="mt-6 text-primary font-black hover:underline uppercase tracking-widest text-xs"
                            >
                                Try Refresh
                            </button>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                                <IconBriefcase />
                            </div>
                            <p className="text-gray-500 text-xl font-black tracking-tight">Zero active listings found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Role & Employer
                                        </th>
                                        <th scope="col" className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Classification
                                        </th>
                                        <th scope="col" className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Status
                                        </th>
                                        <th scope="col" className="px-10 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Administration
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
                                                        <span className="text-primary mr-2">{job.employer?.name}</span>
                                                        <span className="mr-1.5"><IconMapPin /></span>
                                                        {job.location}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-100 shadow-sm">
                                                    {job.category?.name || "Unassigned"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none
                                                    ${job.status
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full mr-2 ${job.status ? "bg-green-500" : "bg-red-500"}`}></span>
                                                    {job.status ? "Active" : "Closed"}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        to={`/jobs/${job.id}`}
                                                        className="text-primary hover:text-white hover:bg-primary border border-primary/10 p-2.5 rounded-xl transition-all shadow-sm"
                                                        title="Preview Public Listing"
                                                    >
                                                        <IconBriefcase />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(job.id)}
                                                        className="text-red-600 hover:text-white hover:bg-red-600 border border-red-100 p-2.5 rounded-xl transition-all shadow-sm"
                                                        title="Administrative Removal"
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


        </div>
    );
}

