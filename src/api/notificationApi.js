import axiosClient from "@/api/axiosClient";

export const notificationApi = {
    getAll: (params) => axiosClient.get("/api/v1/notifications", { params }),
    getUnreadCount: () => axiosClient.get("/api/v1/notifications/unread-count"),
    markAsRead: (id) => axiosClient.patch(`/api/v1/notifications/${id}/read`),
    markAllAsRead: () => axiosClient.patch("/api/v1/notifications/read-all"),
    deleteNotification: (id) => axiosClient.delete(`/api/v1/notifications/${id}`),
    getPreferences: () => axiosClient.get("/api/v1/notifications/preferences"),
    updatePreference: (data) => axiosClient.put("/api/v1/notifications/preferences", data),
};
