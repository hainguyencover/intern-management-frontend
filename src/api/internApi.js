import axiosClient from "./axiosClient";

export const internApi = {
    // HR endpoints
    list: (params) => axiosClient.get("/api/interns/profiles", { params }),
    search: (params) => axiosClient.get("/api/interns/search", { params }),
    create: (data) => axiosClient.post("/api/interns/profiles", data),
    getById: (id) => axiosClient.get(`/api/interns/profiles/${id}`),
    update: (id, data) => axiosClient.put(`/api/interns/profiles/${id}`, data),
    assignMentor: (id, mentorUserId) => axiosClient.put(`/api/interns/profiles/${id}/assign-mentor`, null, { params: { mentorUserId } }),
    delete: (id) => axiosClient.delete(`/api/interns/profiles/${id}`),

    getStatsUniversity: () => axiosClient.get("/api/interns/stats/university"),
    getStatsMajor: () => axiosClient.get("/api/interns/stats/major"),

    // Intern endpoints
    getMyProfile: () => axiosClient.get("/api/interns/me"),
    updateMyProfile: (payload) => axiosClient.put("/api/interns/me", payload),
};
