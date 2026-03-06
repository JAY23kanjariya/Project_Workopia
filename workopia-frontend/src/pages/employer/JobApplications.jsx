import { useState, useEffect } from "react";
import * as applicationService from "../../api/applications";
import { useParams } from "react-router-dom";

export default function JobApplications() {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await applicationService.getJobApplications(id);
                setApplications(response.data.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [id]);

    const handleStatusUpdate = async (appId, status) => {
        try {
            await applicationService.updateApplicationStatus(appId, status);
            setApplications(applications.map(app =>
                app.id === appId ? { ...app, status } : app
            ));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div>Loading applications...</div>;

    return (
        <div className="job-applications">
            <h2>Applications for Job #{id}</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Candidate</th>
                        <th>Email</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(app => (
                        <tr key={app.id}>
                            <td>{app.candidate?.name}</td>
                            <td>{app.candidate?.email}</td>
                            <td>{new Date(app.created_at).toLocaleDateString()}</td>
                            <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                            <td>
                                <button onClick={() => handleStatusUpdate(app.id, 'approved')} className="btn-small">Approve</button>
                                <button onClick={() => handleStatusUpdate(app.id, 'rejected')} className="btn-small btn-danger">Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
