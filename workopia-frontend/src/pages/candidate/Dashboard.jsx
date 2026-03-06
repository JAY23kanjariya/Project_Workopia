import { useState, useEffect } from "react";
import * as applicationService from "../../api/applications";

export default function CandidateDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await applicationService.getMyApplications();
                setApplications(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) return <div className="loading">Loading your applications...</div>;

    return (
        <div className="candidate-dashboard">
            <h2>Candidate Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Applications Sent</h3>
                    <p className="stat-number">{applications.length}</p>
                </div>
            </div>

            <section className="applications-section">
                <h3>My Applications</h3>
                {applications.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Applied On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id}>
                                    <td>{app.job?.title}</td>
                                    <td>{app.job?.employer?.company_name}</td>
                                    <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>You haven't applied to any jobs yet.</p>
                )}
            </section>
        </div>
    );
}
