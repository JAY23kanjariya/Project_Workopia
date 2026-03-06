import api from "./axios";

export const getJobs = async () => {
    const response = await api.get("/job-posts");
    return response.data;
};

export const getJob = async (id) => {
    const response = await api.get(`/job-posts/${id}`);
    return response.data;
};

export const createJob = async (data) => {
    const response = await api.post("/job-posts", data);
    return response.data;
};

export const updateJob = async (id, data) => {
    const response = await api.put(`/job-posts/${id}`, data);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await api.delete(`/job-posts/${id}`);
    return response.data;
};
