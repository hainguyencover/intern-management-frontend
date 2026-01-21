// src/api/supportTicketApi.js
import axiosClient from "./axiosClient";

export const supportTicketApi = {
    // ===== INTERN =====
    internCreate: (payload) => axiosClient.post("/api/intern/support-tickets", payload),
    internList: (page = 0, size = 10) =>
        axiosClient.get(`/api/intern/support-tickets?page=${page}&size=${size}`),
    internDetail: (id) => axiosClient.get(`/api/intern/support-tickets/${id}`),
    internAddComment: (id, payload) =>
        axiosClient.post(`/api/intern/support-tickets/${id}/comments`, payload),

    // ===== HR =====
    hrList: (page = 0, size = 10) =>
        axiosClient.get(`/api/hr/support-tickets?page=${page}&size=${size}`),
    hrDetail: (id) => axiosClient.get(`/api/hr/support-tickets/${id}`),
    hrAddComment: (id, payload) =>
        axiosClient.post(`/api/hr/support-tickets/${id}/comments`, payload),
    hrUpdateStatus: (id, payload) =>
        axiosClient.patch(`/api/hr/support-tickets/${id}/status`, payload),
};
