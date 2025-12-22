import axiosClient from "./axiosClient";

export const authApi = {
    login: (payload) => axiosClient.post("/api/auth/login", payload),
    register: (payload) => axiosClient.post("/api/auth/register", payload),
    me: () => axiosClient.get("/api/auth/me"), // nếu BE bạn có endpoint này
};
