import axiosClient from "./axiosClient";

export const userApi = {
    createUser: (userData) => axiosClient.post("/api/users", userData),

    getUserById: (id) => axiosClient.get(`/api/users/${id}`),

    updateUser: (id, userData) => axiosClient.put(`/api/users/${id}`, userData),

    getCurrentUser: () => axiosClient.get("/api/users/me"),

    searchUsers: (params) => axiosClient.get("/api/users", { params }),
};
