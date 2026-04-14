import axiosClient from "@/api/axiosClient.js";

export const programService = {
    list: (params) => axiosClient.get("/api/v1/programs", { params }),
    create: (payload) => axiosClient.post("/api/v1/programs", payload),
    update: (id, payload) => axiosClient.put(`/api/v1/programs/${id}`, payload),
    updateStatus: (id, status) => axiosClient.put(`/api/v1/programs/${id}/status`, null, { params: { status } }),
    getById: (id) => axiosClient.get(`/api/v1/programs/${id}`),
    delete: (id) => axiosClient.delete(`/api/v1/programs/${id}`),
};
