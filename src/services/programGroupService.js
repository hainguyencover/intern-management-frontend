import axiosClient from "../api/axiosClient";

export const programGroupService = {
    list: (params) => axiosClient.get("/api/program-groups", { params }),
    create: (payload) => axiosClient.post("/api/program-groups", payload),
    update: (id, payload) => axiosClient.put(`/api/program-groups/${id}`, payload),
    assignIntern: (groupId, internId) =>
        axiosClient.post(`/api/program-groups/${groupId}/members`, { internId }),
    getMembers: (groupId) => axiosClient.get(`/api/program-groups/${groupId}/members`),
    removeMember: (groupId, internId) => axiosClient.delete(`/api/program-groups/${groupId}/members/${internId}`),
};
