import axiosClient from "../api/axiosClient.js";

export const programService = {
    list: () => axiosClient.get("/api/programs"),
    create: (payload) => axiosClient.post("/api/programs", payload),
    update: (id, payload) => axiosClient.put(`/api/programs/${id}`, payload),
};
