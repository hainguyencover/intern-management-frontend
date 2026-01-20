import axiosClient from "./axiosClient";

export const authApi = {
    login: (payload) => axiosClient.post("/api/auth/login", payload),
    register: (data) => axiosClient.post("/api/auth/register", data),
    me: () => axiosClient.get("/api/auth/me"),
    logout: () => axiosClient.post("/api/auth/logout"),
};
