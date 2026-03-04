import axiosClient from "./axiosClient";

export const notificationApi = {
    getAll: (params) => axiosClient.get("/api/v1/notifications", { params }),
    getUnread: () => axiosClient.get("/api/v1/notifications/unread"),
    getUnreadCount: () => axiosClient.get("/api/v1/notifications/unread-count"),
    markAsRead: (id) => axiosClient.put(`/api/v1/notifications/${id}/read`),
    markAllAsRead: () => axiosClient.put("/api/v1/notifications/read-all"),
};
