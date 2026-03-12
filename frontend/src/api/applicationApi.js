import api from './axios';

export const getMyApplications = () => api.get('/my-applications');
export const getJobApplications = (jobId) => api.get(`/job-posts/${jobId}/applications`);
export const updateApplicationStatus = (appId, status) => api.put(`/applications/${appId}/status`, { status });
export const applyForJob = (jobId) => api.post(`/job-posts/${jobId}/apply`);
