import { useState, useEffect } from "react";
import * as jobService from "../../api/jobs";
import { Link } from "react-router-dom";

export default function EmployerDashboard() {
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobService.getJobs();
                setMyJobs(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return <div className="loading">Loading your dashboard...</div>;

    return (
        <div className="employer-dashboard">
            <h2>Employer Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Active Jobs</h3>
                    <p className="stat-number">{myJobs.length}</p>
                </div>
            </div>

            <section className="jobs-section">
                <div className="section-header">
                    <h3>My Posted Jobs</h3>
                    <Link to="/employer/post-job" className="btn-primary">Post New Job</Link>
                </div>
                {myJobs.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Applications</th>
                                <th>Posted On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myJobs.map(job => (
                                <tr key={job.id}>
                                    <td>{job.title}</td>
                                    <td>{job.applications_count || 0}</td>
                                    <td>{new Date(job.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/employer/jobs/${job.id}/applications`} className="btn-small">View Apps</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>You haven't posted any jobs yet.</p>
                )}
            </section>
        </div>
    );
}
