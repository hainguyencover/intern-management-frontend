import axiosClient from "@/api/axiosClient";

export const programApi = {
    list: (params) => axiosClient.get("/api/v1/programs", { params }),
    create: (data) => axiosClient.post("/api/v1/programs", data),
    update: (id, data) => axiosClient.put(`/api/v1/programs/${id}`, data),
    getById: (id) => axiosClient.get(`/api/v1/programs/${id}`),
    assignIntern: (id, internIds) => axiosClient.post(`/api/v1/programs/${id}/assign-intern`, { internIds }),
    assignMentor: (id, mentorIds) => axiosClient.post(`/api/v1/programs/${id}/assign-mentor`, { mentorIds }),
    participants: (id) => axiosClient.get(`/api/v1/programs/${id}/participants`),
};

