import axiosClient from "./axiosClient";

export const leaveApi = {
    // Intern actions
    createRequest: (data) => {
        return axiosClient.post("/api/leave-requests", data);
    },
    getMyRequests: (params) => {
        return axiosClient.get("/api/leave-requests/me", { params });
    },
    cancelRequest: (id) => {
        return axiosClient.delete(`/api/leave-requests/${id}`);
    },

    // HR actions
    getAllRequests: (params) => {
        return axiosClient.get("/api/leave-requests", { params });
    },
    approve: (id) => {
        return axiosClient.put(`/api/leave-requests/${id}/approve`);
    },
    reject: (id, reason) => {
        return axiosClient.put(`/api/leave-requests/${id}/reject`, { reason });
    }
};
