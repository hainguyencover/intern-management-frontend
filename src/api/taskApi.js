import axiosClient from "./axiosClient.js";

export const taskApi = {
    // Mentor: tạo task
    create: (payload) => axiosClient.post("/api/tasks", payload),

    // Mentor: task đã giao (có thể filter groupId/status)
    getAssigned: (params = {}) => axiosClient.get("/api/tasks/assigned", { params }),

    // Intern: task của tôi
    getAssignedToMe: (params = {}) => axiosClient.get("/api/tasks/assigned-to-me", { params }),

    // Intern: cập nhật tiến độ task
    updateProgress: (taskId, payload) =>
        axiosClient.post(`/api/tasks/${taskId}/updates`, payload),

    // Lịch sử cập nhật
    getHistory: (taskId) => axiosClient.get(`/api/tasks/${taskId}/history`),

    // Lấy danh sách task đã giao
    getAssignedTasks: (params) =>
        axiosClient.get("/api/tasks/assigned", { params }),

    // Tạo task mới
    createTask: (payload) =>
        axiosClient.post("/api/tasks", payload),

    // Cập nhật task
    updateTask: (id, payload) =>
        axiosClient.put(`/api/tasks/${id}`, payload),

    // Lấy chi tiết task
    getTaskDetail: (id) =>
        axiosClient.get(`/api/tasks/${id}`),

    // Lấy lịch sử cập nhật task
    getTaskHistory: (id) =>
        axiosClient.get(`/api/tasks/${id}/history`),

    // Thêm comment vào task
    addComment: (taskId, payload) =>
        axiosClient.post(`/api/tasks/${taskId}/comments`, payload),

    // Xóa task
    deleteTask: (id) =>
        axiosClient.delete(`/api/tasks/${id}`),
};
