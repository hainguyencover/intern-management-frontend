import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const isFormData = config.data instanceof FormData;
    if (isFormData) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
    } else {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

export default axiosClient;
