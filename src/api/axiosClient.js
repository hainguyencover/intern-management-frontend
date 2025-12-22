import axios from "axios";

// Prefer VITE_API_URL, fallback to VITE_API_BASE_URL, otherwise default to localhost:8080
const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
// Remove any trailing '/api' segment to avoid double '/api' when endpoints already include it
const baseURL = String(rawApiUrl).replace(/\/api\/?$/i, "").replace(/\/+$/g, "");

const axiosClient = axios.create({
    baseURL,
    // Do not set a global Content-Type here so axios can auto-detect multipart/form-data boundaries
    headers: { Accept: "application/json" },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default axiosClient;
