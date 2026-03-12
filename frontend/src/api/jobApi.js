import api from './axios';

export const getJobs = (params) => api.get('/job-posts', { params });
export const getJobById = (id) => api.get(`/job-posts/${id}`);
export const getJob = (id) => api.get(`/job-posts/${id}`);
export const createJob = (data) => api.post('/job-posts', data);
export const updateJob = (id, data) => api.put(`/job-posts/${id}`, data);
export const deleteJob = (id) => api.delete(`/job-posts/${id}`);
export const adminDeleteJob = (id) => api.delete(`/admin/job-posts/${id}`);
