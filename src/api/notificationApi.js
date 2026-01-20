import axiosClient from "./axiosClient";

export const notificationApi = {
    getAll: (params) => axiosClient.get("/api/notifications", { params }),
    getUnread: () => axiosClient.get("/api/notifications/unread"),
    getUnreadCount: () => axiosClient.get("/api/notifications/unread-count"),
    markAsRead: (id) => axiosClient.put(`/api/notifications/${id}/read`),
    markAllAsRead: () => axiosClient.put("/api/notifications/read-all"),
};
