import api from "./axios";

// GET users with optional search & pagination
export const adminGetUser = (params) => api.get("/admin/users", { params });

// DELETE user by ID
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);