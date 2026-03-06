import axios from "axios";

// create axios instance and set base url
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// add token to request coming from frontend to backend
api.interceptors.request.use((config) => {
    // get token from local storage
    const token = localStorage.getItem("token");
    // set token to request headers
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// export axios instance
export default api;