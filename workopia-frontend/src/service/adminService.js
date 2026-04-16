import api from "@/lib/axiosClient";

// GET users (search + pagination)
export const adminGetUser = (search, page = 1) => {
    return api.get("/admin/users", {
        params: { search, page }
    });
};

// DELETE user
export const adminDeleteUser = (id) => {
    return api.delete(`/admin/users/${id}`);
};