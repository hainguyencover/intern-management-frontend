import axiosClient from "./axiosClient";

export const internApi = {
    create: (payload) => axiosClient.post("/api/interns", payload),
    list: (params) => axiosClient.get("/api/interns", {params}),
    getById: (id) => axiosClient.get(`/api/interns/${id}`),
    update: (id, payload) => axiosClient.put(`/api/interns/${id}`, payload),

    // ====== NEW: HR assign mentor ======
    assignMentor: (internId, mentorId) =>
        axiosClient.post(`/api/interns/${internId}/assign-mentor`, { mentorId }),

    removeMentor: (internId) =>
        axiosClient.delete(`/api/interns/${internId}/assign-mentor`),
};
