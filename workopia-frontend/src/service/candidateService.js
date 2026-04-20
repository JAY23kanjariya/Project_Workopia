import api from "@/lib/axiosClient";

// GET candidate profile
export const getCandidateProfile = () => {
    return api.get('/candidate/profile');
};

// Create or Update candidate profile
export const updateCandidateProfile = (data) => {
    return api.post('/candidate/profile', data);
};
