import axiosClient from "./axiosClient.js";

export const taskApi = {
    // Mentor: tạo task
    create: (payload) => axiosClient.post("/api/v1/tasks", payload),

    // Mentor: task đã giao (có thể filter groupId/status)
    getAssigned: (params = {}) => axiosClient.get("/api/v1/tasks/assigned", { params }),

    // Intern: task của tôi
    getAssignedToMe: (params = {}) => axiosClient.get("/api/v1/tasks/assigned-to-me", { params }),

    // Intern: cập nhật tiến độ task
    updateProgress: (taskId, payload) =>
        axiosClient.post(`/api/v1/tasks/${taskId}/updates`, payload),

    // Lịch sử cập nhật
    getHistory: (taskId) => axiosClient.get(`/api/v1/tasks/${taskId}/history`),

    // Lấy danh sách task đã giao
    getAssignedTasks: (params) =>
        axiosClient.get("/api/v1/tasks/assigned", { params }),

    // Tạo task mới
    createTask: (payload) =>
        axiosClient.post("/api/v1/tasks", payload),

    // Cập nhật task
    updateTask: (id, payload) =>
        axiosClient.put(`/api/v1/tasks/${id}`, payload),

    // Lấy chi tiết task
    getTaskDetail: (id) =>
        axiosClient.get(`/api/v1/tasks/${id}`),

    // Lấy lịch sử cập nhật task
    getTaskHistory: (id) =>
        axiosClient.get(`/api/v1/tasks/${id}/history`),

    // Thêm comment vào task
    addComment: (taskId, payload) =>
        axiosClient.post(`/api/v1/tasks/${taskId}/comments`, payload),

    // Xóa task
    deleteTask: (id) =>
        axiosClient.delete(`/api/v1/tasks/${id}`),
};
