import api from "@/lib/axiosClient";

// Login
export const signIn = (credentials) => {
    return api.post('/login', credentials);
};

// Register
export const signUp = (userData) => {
    return api.post('/register', userData);
};

// Logout
export const signOut = () => {
    return api.post('/logout');
};

// Get current user
export const getMe = () => {
    return api.get('/me');
};

// Update profile (name, email)
export const updateProfile = (data) => {
    return api.put('/profile', data);
};

// Change password
export const changePassword = (data) => {
    return api.put('/change-password', data);
};

// Forgot password — send reset link
export const forgotPassword = (data) => {
    return api.post('/forgot-password', data);
};

// Reset password with token
export const resetPassword = (data) => {
    return api.post('/reset-password', data);
};

// Delete account (non-admin only)
export const deleteAccount = () => {
    return api.delete('/delete-account');
};