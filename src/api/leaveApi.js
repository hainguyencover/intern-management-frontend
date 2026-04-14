import axiosClient from "@/api/axiosClient";

export const leaveApi = {
    // Intern actions
    createRequest: (data) => {
        return axiosClient.post("/api/v1/leave-requests", data);
    },
    getMyRequests: (params) => {
        return axiosClient.get("/api/v1/leave-requests/me", { params });
    },
    getById: (id) => {
        return axiosClient.get(`/api/v1/leave-requests/${id}`);
    },
    // HR actions
    getAllRequests: (params) => {
        return axiosClient.get("/api/v1/leave-requests", { params });
    },
    updateStatus: (id, status, reason = "") => {
        return axiosClient.put(`/api/v1/leave-requests/${id}/status`, { status, reason });
    },
};
