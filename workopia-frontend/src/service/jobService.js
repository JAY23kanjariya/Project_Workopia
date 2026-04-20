import api from "@/lib/axiosClient";

// GET all jobs (search + pagination)
export const getJobs = (params) => {
    return api.get('/job-posts', {
        params
    });
};

// GET employer's job posts
export const getEmployerJobPosts = (params) => {
    return api.get('/employer/job-posts', {
        params
    });
};

// GET job by ID
export const getJobById = (id) => {
    return api.get(`/job-posts/${id}`);
};

// Create job
export const createJob = (data) => {
    return api.post('/job-posts', data);
};

// Update job
export const updateJob = (id, data) => {
    return api.put(`/job-posts/${id}`, data);
};

// Delete job
export const deleteJob = (id) => {
    return api.delete(`/job-posts/${id}`);
};

// Admin delete job
export const adminDeleteJob = (id) => {
    return api.delete(`/admin/job-posts/${id}`);
};

// Candidate: Apply for a job
export const applyToJob = (jobId) => {
    return api.post(`/job-posts/${jobId}/apply`);
};