import { useEffect, useState } from "react";
import * as jobApi from "../../api/jobApi";
import * as categoryApi from "../../api/categoryApi";
import * as applicationApi from "../../api/applicationApi";
import { useAuth } from "../../auth/AuthContext";
import JobCard from "../../components/jobs/JobCard";
import JobFilter from "../../components/jobs/JobFilter";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";

export default function JobList() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const fetchJobs = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const params = {
                page: pageNumber,
                title: search,
                category_id: categoryId
            };
            
            const response = await jobApi.getJobs(params);
            if (response.data.success) {
                // Show all jobs initially (or as per backend response)
                // If you want to restrict to only active jobs, keep the filter.
                // Re-enabling all jobs as per user request "display all jobs"
                setJobs(response.data.jobPosts.data || []);
                setPagination({
                    current_page: response.data.jobPosts.current_page,
                    last_page: response.data.jobPosts.last_page,
                    total: response.data.jobPosts.total
                });
            }
        } catch (err) {
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getCategories({ all: 'true' });
            if (response.data.success) {
                setCategories(response.data.categories?.data || response.data.categories || []);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const fetchAppliedJobs = async () => {
        if (user && user.role_id === 3) {
            try {
                const response = await applicationApi.getMyApplications();
                if (response.data.success) {
                    const apps = response.data.applications.data || response.data.applications || [];
                    setAppliedJobs(apps.map(app => app.job_post_id));
                }
            } catch (err) {
                console.error("Error fetching applied jobs:", err);
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchJobs(page);
        fetchAppliedJobs();
    }, [page, search, categoryId, user]);

    const handleApply = async (jobId) => {
        try {
            const response = await applicationApi.applyForJob(jobId);
            if (response.data.success) {
                alert("Application submitted successfully!");
                fetchAppliedJobs(); // Refresh applied status
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to apply. Make sure you are logged in as a candidate.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <span className="text-primary font-black text-xs uppercase tracking-widest mb-4 block animate-bounce">
                        Marketplace Live
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-6">
                        Discover Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Next Mission</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                        Workopia connects the world's most ambitious talent with high-impact opportunities in global technology and beyond.
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <JobFilter 
                    search={search} 
                    setSearch={setSearch} 
                    categoryId={categoryId} 
                    setCategoryId={setCategoryId} 
                    categories={categories} 
                />

                {/* Job Grid */}
                {loading ? (
                    <Loader text="Finding the best jobs for you..." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <JobCard 
                                    key={job.id} 
                                    job={job} 
                                    onApply={handleApply} 
                                    isApplied={appliedJobs.includes(job.id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 font-medium text-lg italic">No jobs match your current search criteria.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!loading && (
                    <div className="mt-16">
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

