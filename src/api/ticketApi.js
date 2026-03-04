import axiosClient from "./axiosClient";

export const ticketApi = {
    // Shared
    create: (data) => {
        // Backend expects: category, title, content
        return axiosClient.post("/api/v1/support-tickets", data);
    },
    createTicket: (data) => {
        return axiosClient.post("/api/v1/support-tickets", data);
    },
    updateTicket: (id, data) => {
        return axiosClient.put(`/api/v1/support-tickets/${id}`, data);
    },
    deleteTicket: (id) => {
        return axiosClient.delete(`/api/v1/support-tickets/${id}`);
    },
    reply: (id, content) => {
        // Backend expects: content (in TicketCommentRequest)
        return axiosClient.post(`/api/v1/support-tickets/${id}/comments`, { content });
    },
    getComments: (id) => {
        return axiosClient.get(`/api/v1/support-tickets/${id}/comments`);
    },

    // Intern actions
    getMyTickets: () => {
        return axiosClient.get("/api/v1/support-tickets/me");
    },

    // HR actions
    getAllTickets: (params) => {
        return axiosClient.get("/api/v1/support-tickets", { params });
    },
    updateStatus: (id, status) => {
        return axiosClient.put(`/api/v1/support-tickets/${id}/status`, { status });
    }
};
