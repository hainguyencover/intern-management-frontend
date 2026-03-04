import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

// Request interceptor: attach access token
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor: handle ApiResponse unwrapping and 401 / refresh token
axiosClient.interceptors.response.use(
    (response) => {
        // Automatically unwrap ApiResponse data field if present
        if (response.data && Object.prototype.hasOwnProperty.call(response.data, 'success')) {
            return response.data;
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                // No refresh token, logout
                handleLogout();
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh token
                const res = await axios.post(`${axiosClient.defaults.baseURL}/api/v1/auth/refresh`, {
                    refreshToken: refreshToken
                });

                // Note: axios.post here returns full response, so we check res.data
                if (res.data.success) {
                    const { token: newAccessToken, refreshToken: newRefreshToken } = res.data.data;
                    localStorage.setItem("accessToken", newAccessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);

                    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosClient(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                handleLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    // Only redirect if not already on login page to avoid loops
    if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
    }
}

export default axiosClient;
