import axiosClient from "./axiosClient";

export const mentorApi = {
    // List mentors (for HR drop-downs)
    list: (params) => axiosClient.get("/api/mentors", { params }),

    // Create mentor profile
    create: (data) => axiosClient.post("/api/mentors", data),

    // Lấy danh sách intern được gán
    getAssignedInterns: (params) =>
        axiosClient.get("/api/mentors/assigned-interns", { params }),

    // Lấy thông tin chi tiết intern
    getInternDetail: (internId) =>
        axiosClient.get(`/api/mentors/interns/${internId}`),

    // Lấy workload của mentor
    getMyWorkload: () =>
        axiosClient.get("/api/mentors/me/workload"),

    // Lấy thống kê dashboard
    getDashboardStats: () =>
        axiosClient.get("/api/mentors/me/dashboard"),
};
