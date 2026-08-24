import axiosClient from "@/api/axiosClient";

export const ticketApi = {
    // Shared & Intern actions
    create: (data) => {
        return axiosClient.post("/api/v1/support-tickets", data);
    },
    createTicket: (data) => {
        return axiosClient.post("/api/v1/support-tickets", data);
    },
    getMyTickets: (params) => {
        return axiosClient.get("/api/v1/support-tickets/me", { params });
    },
    getById: (id) => {
        return axiosClient.get(`/api/v1/support-tickets/${id}`);
    },

    // HR & Admin actions
    getAllTickets: (params) => {
        return axiosClient.get("/api/v1/support-tickets", { params });
    },
    assign: (id, assignedToId) => {
        return axiosClient.post(`/api/v1/support-tickets/${id}/assign`, { assignedToId });
    },
    updateStatus: (id, status) => {
        return axiosClient.put(`/api/v1/support-tickets/${id}/status`, { status });
    },
    resolve: (id, resolution) => {
        return axiosClient.post(`/api/v1/support-tickets/${id}/resolve`, { resolution });
    },
    close: (id) => {
        return axiosClient.post(`/api/v1/support-tickets/${id}/close`);
    },

    // Discussion & Attachments
    reply: (id, content, isInternal = false) => {
        return axiosClient.post(`/api/v1/support-tickets/${id}/comments`, { content, isInternal });
    },
    getComments: (id) => {
        return axiosClient.get(`/api/v1/support-tickets/${id}/comments`);
    },
    addAttachment: (id, params) => {
        return axiosClient.post(`/api/v1/support-tickets/${id}/attachments`, null, { params });
    }
};
