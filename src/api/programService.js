import axiosClient from "./axiosClient.js";

export const programService = {
    // Programs
    list: (params) => axiosClient.get("/api/programs", { params }),

    getById: (id) => axiosClient.get(`/api/programs/${id}`),

    create: (data) => axiosClient.post("/api/programs", data),

    update: (id, data) => axiosClient.put(`/api/programs/${id}`, data),

    delete: (id) => axiosClient.delete(`/api/programs/${id}`),

    // Groups
    getGroups: (programId) =>
        axiosClient.get("/api/program-groups", { params: { programId } }),

    getGroup: (id) => axiosClient.get(`/api/program-groups/${id}`),

    createGroup: (data) => axiosClient.post("/api/program-groups", data),

    updateGroup: (id, data) => axiosClient.put(`/api/program-groups/${id}`, data),

    deleteGroup: (id) => axiosClient.delete(`/api/program-groups/${id}`),

    // Group Members
    getGroupMembers: (groupId) =>
        axiosClient.get(`/api/program-groups/${groupId}/members`),

    assignIntern: (groupId, internId) =>
        axiosClient.post(`/api/program-groups/${groupId}/members`, { internId }),

    assignInterns: (groupId, internIds) =>
        axiosClient.post(`/api/program-groups/${groupId}/members/bulk`, { internIds }),

    removeIntern: (groupId, internId) =>
        axiosClient.delete(`/api/program-groups/${groupId}/members/${internId}`),
};
