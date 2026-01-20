import axiosClient from "./axiosClient";

export const groupApi = {
    list: (params) => axiosClient.get("/api/program-groups", { params }),
    create: (data) => axiosClient.post("/api/program-groups", data),
    update: (id, data) => axiosClient.put(`/api/program-groups/${id}`, data),
    assignIntern: (groupId, internId) => axiosClient.post(`/api/program-groups/${groupId}/members`, { internId }),
};
