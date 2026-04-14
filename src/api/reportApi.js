import axiosClient from "@/api/axiosClient";

export const reportApi = {
    // Lấy báo cáo của một intern
    getInternReports: (internId, params) =>
        axiosClient.get(`/api/v1/reports/intern/${internId}`, { params }),

    // Lấy chi tiết báo cáo
    getReportDetail: (id) =>
        axiosClient.get(`/api/v1/reports/${id}`),

    // Thêm feedback vào báo cáo
    addFeedback: (id, payload) =>
        axiosClient.put(`/api/v1/reports/${id}/feedback`, payload),

    // Đánh dấu đã review
    markAsReviewed: (id) =>
        axiosClient.put(`/api/v1/reports/${id}/status`, { status: "REVIEWED" }),

    // Lấy báo cáo tổng kết cuối kỳ
    getFinalReport: (internId) =>
        axiosClient.get(`/api/v1/reports/final/${internId}`),

    // Lấy danh sách tổng hợp báo cáo (Dashboard)
    getDashboardSummary: () =>
        axiosClient.get("/api/v1/reports/dashboard-summary"),

    getReportsSummary: () =>
        axiosClient.get("/api/v1/reports/dashboard-summary"),

    getStatsAssessment: () =>
        axiosClient.get("/api/v1/reports/stats/assessment"),
};
