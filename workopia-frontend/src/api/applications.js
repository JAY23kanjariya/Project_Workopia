import api from "./axios";

export const applyToJob = async (jobId) => {
    const response = await api.post(`/job-posts/${jobId}/apply`);
    return response.data;
};

export const getMyApplications = async () => {
    const response = await api.get("/my-applications");
    return response.data;
};

export const getJobApplications = async (jobId) => {
    const response = await api.get(`/job-posts/${jobId}/applications`);
    return response.data;
};

export const updateApplicationStatus = async (id, status) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
};
