import axiosClient from "./axiosClient";

export const departmentApi = {
    getAll: () => axiosClient.get("/api/departments"),
    getById: (id) => axiosClient.get(`/api/departments/${id}`),
    create: (data) => axiosClient.post("/api/departments", data),
    update: (id, data) => axiosClient.put(`/api/departments/${id}`, data),
    delete: (id) => axiosClient.delete(`/api/departments/${id}`),
};
