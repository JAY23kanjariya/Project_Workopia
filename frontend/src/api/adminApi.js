import api from "./axios";

export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);