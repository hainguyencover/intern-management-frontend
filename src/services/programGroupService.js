import axiosClient from "../api/axiosClient";

export const programGroupService = {
    create: (payload) => axiosClient.post("/api/program-groups", payload),
    assignIntern: (groupId, internId) =>
        axiosClient.post(`/api/program-groups/${groupId}/members`, { internId }),
};
