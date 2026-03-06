import { useState, useEffect } from "react";
import * as jobService from "../../api/jobs";
import { Link } from "react-router-dom";

export default function JobPosts() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobService.getJobs();
                setJobs(response.data.data);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div className="loading">Finding openings...</div>;

    return (
        <div className="jobs-container">
            <header className="page-header">
                <h1>Available Positions</h1>
                <p>Browse the latest job openings from top employers.</p>
            </header>

            <div className="jobs-list">
                {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="job-card">
                        <div className="job-info">
                            <h3>{job.title}</h3>
                            <p className="company">{job.employer?.company_name || "Confidential Employer"}</p>
                            <p className="description">{job.description?.substring(0, 150)}...</p>
                        </div>
                        <div className="job-actions">
                            <span className="salary">{job.salary ? `$${job.salary}` : "Not Disclosed"}</span>
                            <Link to={`/job-posts/${job.id}`} className="btn-view">View Details</Link>
                        </div>
                    </div>
                )) : (
                    <p>No jobs available at the moment.</p>
                )}
            </div>
        </div>
    );
}
