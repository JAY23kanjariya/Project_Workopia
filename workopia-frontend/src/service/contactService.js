import api from "@/lib/axiosClient";

/**
 * Send contact form data to the backend.
 */
export const sendContactMessage = (data) => {
    return api.post('/contact-us', data);
};
