import axiosClient from "@/api/axiosClient.js";

export const taskApi = {
    // Mentor: tạo task hàng loạt hoặc cá nhân
    createMentorTasks: (payload) => axiosClient.post("/api/v1/mentor/tasks", payload),

    // Tạo single task
    createTask: (payload) => axiosClient.post("/api/v1/tasks", payload),

    // Lấy danh sách task (HR / Mentor / Admin / Intern)
    getTasks: (params = {}) => axiosClient.get("/api/v1/tasks", { params }),

    // Mentor: danh sách task theo group
    getMentorTasks: (params = {}) => axiosClient.get("/api/v1/mentor/tasks", { params }),

    // Mentor: chi tiết 1 task
    getMentorTaskDetail: (taskId) => axiosClient.get(`/api/v1/mentor/tasks/${taskId}`),

    // Mentor: cập nhật task
    updateMentorTask: (taskId, payload) => axiosClient.put(`/api/v1/mentor/tasks/${taskId}`, payload),

    // Mentor: xóa task
    deleteMentorTask: (taskId) => axiosClient.delete(`/api/v1/mentor/tasks/${taskId}`),

    // Intern: danh sách task được giao cho tôi
    getAssignedToMe: (params = {}) => axiosClient.get("/api/v1/interns/me/tasks", { params }),

    // Intern: chi tiết 1 task
    getInternTaskDetail: (taskId) => axiosClient.get(`/api/v1/interns/me/tasks/${taskId}`),

    // Intern: cập nhật tiến độ công việc
    updateProgress: (taskId, payload) => axiosClient.patch(`/api/v1/tasks/${taskId}/progress`, payload),

    // Intern: nộp báo cáo hoàn thành
    submitTask: (taskId, note) => axiosClient.post(`/api/v1/tasks/${taskId}/submit`, null, { params: { note } }),

    // Mentor: phê duyệt hoàn thành
    approveTask: (taskId, note) => axiosClient.post(`/api/v1/tasks/${taskId}/approve`, null, { params: { note } }),

    // Mentor: yêu cầu sửa lại (Reject)
    rejectTask: (taskId, reason) => axiosClient.post(`/api/v1/tasks/${taskId}/reject`, null, { params: { reason } }),

    // Mentor: hủy nhiệm vụ (Cancel)
    cancelTask: (taskId, reason) => axiosClient.patch(`/api/v1/tasks/${taskId}/cancel`, null, { params: { reason } }),

    // Mentor: danh sách nhiệm vụ quá hạn
    getOverdueTasks: () => axiosClient.get("/api/v1/tasks/overdue"),

    // Lấy lịch sử cập nhật tiến độ công việc (Timeline)
    getProgressHistory: (taskId) => axiosClient.get(`/api/v1/tasks/${taskId}/progress-history`),

    // Lấy chi tiết task
    getTaskDetail: (id) => axiosClient.get(`/api/v1/tasks/${id}`),

    // Cập nhật thông tin task
    updateTask: (id, payload) => axiosClient.put(`/api/v1/tasks/${id}`, payload),

    // Xóa task
    deleteTask: (id) => axiosClient.delete(`/api/v1/tasks/${id}`),

    // Mentor: Lấy danh sách TTS trong group để chọn giao việc
    getGroupInterns: (groupId) => axiosClient.get(`/api/v1/mentor/groups/${groupId}/interns`),
};
