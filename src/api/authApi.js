import axiosClient from "./axiosClient";

export const authApi = {
    login: (payload) => axiosClient.post("/api/v1/auth/login", payload),
    register: (data) => axiosClient.post("/api/v1/auth/register", data),
    refresh: (refreshToken) => axiosClient.post("/api/v1/auth/refresh", { refreshToken }),
    me: () => axiosClient.get("/api/v1/auth/me"),
    logout: () => axiosClient.post("/api/v1/auth/logout"),
};
