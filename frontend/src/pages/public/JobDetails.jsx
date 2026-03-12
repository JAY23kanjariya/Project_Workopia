import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as jobApi from "../../api/jobApi";
import * as applicationApi from "../../api/applicationApi";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../components/common/Loader";

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default function JobDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const response = await jobApi.getJobById(id);
                if (response.data.success) {
                    setJob(response.data.jobPost);
                }

                if (user && user.role_id === 3) {
                    const appResponse = await applicationApi.getMyApplications();
                    if (appResponse.data.success) {
                        const apps = appResponse.data.applications.data || appResponse.data.applications || [];
                        setIsApplied(apps.some(app => app.job_post_id === parseInt(id)));
                    }
                }
            } catch (err) {
                console.error("Error fetching job details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, user]);

    const handleApply = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.role_id !== 3) {
            alert("Only candidates can apply for jobs.");
            return;
        }

        try {
            setApplying(true);
            const response = await applicationApi.applyForJob(id);
            if (response.data.success) {
                setIsApplied(true);
                alert("Application submitted successfully!");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit application.");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <Loader text="Retrieving detailed intelligence..." />;
    if (!job) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div>
                <h2 className="text-4xl font-black text-gray-900 mb-4">Listing Not Found</h2>
                <p className="text-gray-500 mb-8">This opportunity may have expired or been removed.</p>
                <Link to="/jobs" className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-1">Back to Marketplace</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <header className="bg-gray-900 py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
                
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black tracking-widest text-primary-dark uppercase bg-accent rounded-full shadow-lg shadow-accent/20">
                        {job.category?.name || "Premium Opportunity"}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8 leading-tight">
                        {job.title}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-400">
                        <span className="flex items-center gap-2">
                            <span className="text-primary">🏢</span> {job.employer?.name}
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-primary">📍</span> {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-primary">💰</span> {job.salary_range}
                        </span>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-5xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2">
                        <section className="mb-12">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary text-sm">Description</span>
                                Detailed Brief
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed font-medium">
                                {job.description.split('\n').map((para, i) => (
                                    <p key={i} className="mb-4">{para}</p>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary text-sm">Requirements</span>
                                Candidate Profile
                            </h2>
                            <ul className="space-y-4">
                                {job.requirements?.split(',').map((req, i) => (
                                    <li key={i} className="flex gap-4 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100 group hover:border-primary/20 transition-all">
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] shrink-0 mt-1">✓</div>
                                        <span className="text-gray-700 font-bold">{req.trim()}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {/* Action Card */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-100 border border-gray-100 text-center">
                                <h3 className="text-xl font-black text-gray-900 mb-2">Ready to Apply?</h3>
                                <p className="text-gray-500 text-sm font-medium mb-8">Take the next step in your professional journey.</p>
                                
                                {isApplied ? (
                                    <div className="w-full py-5 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed">
                                        <span>✓</span> Application Submitted
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleApply}
                                        disabled={applying}
                                        className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {applying ? "Processing..." : "Submit Application"}
                                    </button>
                                )}
                                
                                {!user && (
                                    <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <IconLock /> Login Required to Apply
                                    </p>
                                )}
                            </div>

                            {/* Job Stats Card */}
                            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Listing Intelligence</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Remote Type</span>
                                        <span className="text-gray-900 font-black">{job.job_type}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Applied Count</span>
                                        <span className="text-gray-900 font-black">24 Candidates</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Listed Date</span>
                                        <span className="text-gray-900 font-black">
                                            {new Date(job.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
