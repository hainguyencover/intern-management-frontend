import axiosClient from "@/api/axiosClient";

export const mentorApi = {
    // List mentors (for HR drop-downs)
    list: (params) => axiosClient.get("/api/v1/mentors", { params }),

    // Create mentor profile
    create: (data) => axiosClient.post("/api/v1/mentors", data),

    // Lấy danh sách intern được gán
    getAssignedInterns: (params) =>
        axiosClient.get("/api/v1/mentors/assigned-interns", { params }),

    // Lấy thông tin chi tiết intern
    getInternDetail: (internId) =>
        axiosClient.get(`/api/v1/mentors/interns/${internId}`),

    // Lấy workload của mentor
    getMyWorkload: () =>
        axiosClient.get("/api/v1/mentors/me/workload"),

    // Lấy thống kê dashboard
    getDashboardStats: () =>
        axiosClient.get("/api/v1/mentors/me/dashboard"),
};
