import axiosClient from "./axiosClient";

export const programApi = {
    list: (params) => axiosClient.get("/api/programs", { params }),
    create: (data) => axiosClient.post("/api/programs", data),
    update: (id, data) => axiosClient.put(`/api/programs/${id}`, data),
    getById: (id) => axiosClient.get(`/api/programs/${id}`),
    assignIntern: (id, internIds) => axiosClient.post(`/api/programs/${id}/assign-intern`, { internIds }),
    assignMentor: (id, mentorIds) => axiosClient.post(`/api/programs/${id}/assign-mentor`, { mentorIds }),
    participants: (id) => axiosClient.get(`/api/programs/${id}/participants`),
};
