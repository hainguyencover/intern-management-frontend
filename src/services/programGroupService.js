import axiosClient from "../api/axiosClient";

export const programGroupService = {
    list: (params) => axiosClient.get("/api/v1/program-groups", { params }),
    create: (payload) => axiosClient.post("/api/v1/program-groups", payload),
    update: (id, payload) => axiosClient.put(`/api/v1/program-groups/${id}`, payload),
    delete: (id) => axiosClient.delete(`/api/v1/program-groups/${id}`),
    assignMember: (groupId, internId) =>
        axiosClient.post(`/api/v1/program-groups/${groupId}/members`, { internId }),
    getMembers: (groupId) => axiosClient.get(`/api/v1/program-groups/${groupId}/members`),
    removeMember: (groupId, internId) => axiosClient.delete(`/api/v1/program-groups/${groupId}/members/${internId}`),
};
