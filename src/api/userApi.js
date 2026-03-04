import axiosClient from "./axiosClient";

export const userApi = {
    createUser: (userData) => axiosClient.post("/api/v1/users", userData),

    updateUser: (userId, userData) => axiosClient.put(`/api/v1/users/${userId}`, userData),

    deleteUser: (userId) => axiosClient.delete(`/api/v1/users/${userId}`),

    getCurrentUser: () => axiosClient.get("/api/v1/users/me"),

    searchUsers: (params) => axiosClient.get("/api/v1/users", { params }),
};
