import api from "@/lib/axiosClient";

// GET all categories
export const getCategories = (params) => {
    return api.get('/categories', { params });
};

// GET category by ID
export const getCategoryById = (id) => {
    return api.get(`/categories/${id}`);
};

// Create category
export const createCategory = (data) => {
    return api.post('/categories', data);
};

// Update category
export const updateCategory = (id, data) => {
    return api.put(`/categories/${id}`, data);
};

// Delete category
export const deleteCategory = (id) => {
    return api.delete(`/categories/${id}`);
};