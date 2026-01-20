import axiosClient from "../api/axiosClient.js";

export const programService = {
    list: (params) => axiosClient.get("/api/programs", { params }),
    create: (payload) => axiosClient.post("/api/programs", payload),
    update: (id, payload) => axiosClient.put(`/api/programs/${id}`, payload),
};
