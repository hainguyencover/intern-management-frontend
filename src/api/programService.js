import axiosClient from "@/api/axiosClient.js";

export const programService = {
    // Programs
    list: (params) => axiosClient.get("/api/v1/programs", { params }),

    getById: (id) => axiosClient.get(`/api/v1/programs/${id}`),

    create: (data) => axiosClient.post("/api/v1/programs", data),

    update: (id, data) => axiosClient.put(`/api/v1/programs/${id}`, data),

    delete: (id) => axiosClient.delete(`/api/v1/programs/${id}`),

    // Groups
    getGroups: (programId) =>
        axiosClient.get("/api/v1/program-groups", { params: { programId } }),

    getGroup: (id) => axiosClient.get(`/api/v1/program-groups/${id}`),

    createGroup: (data) => axiosClient.post("/api/v1/program-groups", data),

    updateGroup: (id, data) => axiosClient.put(`/api/v1/program-groups/${id}`, data),

    deleteGroup: (id) => axiosClient.delete(`/api/v1/program-groups/${id}`),

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
