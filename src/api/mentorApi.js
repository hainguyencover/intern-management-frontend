import axiosClient from "./axiosClient";

// API để lấy danh sách mentors
export const listMentors = () =>
    axiosClient.get("/api/mentors").then((r) => r.data);

export const getMentorById = (id) =>
    axiosClient.get(`/api/mentors/${id}`).then((r) => r.data);

export const mentorApi = {
    list: () => axiosClient.get("/api/mentors").then((r) => r.data),
    get: (id) => axiosClient.get(`/api/mentors/${id}`).then((r) => r.data),
    create: (payload) => axiosClient.post("/api/mentors", payload),
    update: (id, payload) => axiosClient.put(`/api/mentors/${id}`, payload),
    delete: (id) => axiosClient.delete(`/api/mentors/${id}`),
};
