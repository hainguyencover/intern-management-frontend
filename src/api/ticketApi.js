import axiosClient from "./axiosClient";

export const ticketApi = {
    // Shared
    create: (data) => {
        // Backend expects: category, title, content
        return axiosClient.post("/api/support-tickets", data);
    },
    reply: (id, content) => {
        // Backend expects: content (in TicketCommentRequest)
        return axiosClient.post(`/api/support-tickets/${id}/comments`, { content });
    },
    getComments: (id) => {
        return axiosClient.get(`/api/support-tickets/${id}/comments`);
    },

    // Intern actions
    getMyTickets: () => {
        return axiosClient.get("/api/support-tickets/me");
    },

    // HR actions
    getAllTickets: (params) => {
        return axiosClient.get("/api/support-tickets", { params });
    },
    updateStatus: (id, status) => {
        return axiosClient.put(`/api/support-tickets/${id}/status`, { status });
    }
};
