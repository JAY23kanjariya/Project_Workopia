import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as jobService from "../../api/jobs";
import * as applicationService from "../../api/applications";
import { AuthContext } from "../../context/AuthContext";

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await jobService.getJob(id);
                setJob(response.data.data);
            } catch (error) {
                console.error("Failed to fetch job details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role_id !== 3) {
            setMessage({ type: "error", text: "Only candidates can apply for jobs." });
            return;
        }

        setApplying(true);
        setMessage(null);
        try {
            await applicationService.applyToJob(id);
            setMessage({ type: "success", text: "Application submitted successfully!" });
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to apply. You might have already applied."
            });
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="loading">Loading job details...</div>;
    if (!job) return <div className="error">Job not found.</div>;

    return (
        <div className="job-details-container">
            <header className="job-header">
                <div className="job-header-main">
                    <h1>{job.title}</h1>
                    <p className="company-name">{job.employer?.company_name}</p>
                </div>
                <div className="job-header-meta">
                    <span className="salary">{job.salary ? `$${job.salary}` : "Salary Not Disclosed"}</span>
                    <span className="category-badge">{job.category?.name}</span>
                </div>
            </header>

            {message && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}

            <section className="job-content">
                <div className="description-box">
                    <h3>Job Description</h3>
                    <div className="content-text">{job.description}</div>
                </div>

                <div className="job-sidebar">
                    <div className="apply-card">
                        <h4>Interested in this role?</h4>
                        <p>Apply now to get noticed by the employer.</p>
                        <button
                            onClick={handleApply}
                            disabled={applying || (user && user.role_id !== 3)}
                            className="btn-apply btn-primary"
                        >
                            {applying ? "Applying..." : "Apply Now"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
