import axiosClient from "./axiosClient";

export const internApi = {
    // HR endpoints
    list: (params) => axiosClient.get("/api/v1/interns/profiles", { params }),
    search: (params) => axiosClient.get("/api/v1/interns/search", { params }),
    create: (data) => axiosClient.post("/api/v1/interns/profiles", data),
    getById: (id) => axiosClient.get(`/api/v1/interns/profiles/${id}`),
    update: (id, data) => axiosClient.put(`/api/v1/interns/profiles/${id}`, data),
    assignMentor: (id, mentorUserId) => axiosClient.put(`/api/v1/interns/profiles/${id}/assign-mentor`, null, { params: { mentorUserId } }),
    delete: (id) => axiosClient.delete(`/api/v1/interns/profiles/${id}`),

    getStatsUniversity: () => axiosClient.get("/api/v1/interns/stats/university"),
    getStatsMajor: () => axiosClient.get("/api/v1/interns/stats/major"),

    // Intern endpoints
    getMyProfile: () => axiosClient.get("/api/v1/interns/me"),
    updateMyProfile: (payload) => axiosClient.put("/api/v1/interns/me", payload),
    getDashboard: () => axiosClient.get("/api/v1/dashboard/intern"),
};
