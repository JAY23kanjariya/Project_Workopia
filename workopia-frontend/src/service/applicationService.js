import api from "@/lib/axiosClient";

// GET logged-in user's applications
export const getMyApplications = () => {
    return api.get('/my-applications');
};

// GET applications for a job
export const getJobApplications = (jobId) => {
    return api.get(`/job-posts/${jobId}/applications`);
};

// UPDATE application status
export const updateApplicationStatus = (appId, status) => {
    return api.put(`/applications/${appId}/status`, { status });
};

// APPLY for job
export const applyForJob = (jobId) => {
    return api.post(`/job-posts/${jobId}/apply`);
};