import axiosClient from "./axiosClient";

export const reportApi = {
    // Lấy báo cáo của một intern
    getInternReports: (internId, params) =>
        axiosClient.get(`/api/reports/intern/${internId}`, { params }),

    // Lấy chi tiết báo cáo
    getReportDetail: (id) =>
        axiosClient.get(`/api/reports/${id}`),

    // Thêm feedback vào báo cáo
    addFeedback: (id, payload) =>
        axiosClient.put(`/api/reports/${id}/feedback`, payload),

    // Đánh dấu đã review
    markAsReviewed: (id) =>
        axiosClient.put(`/api/reports/${id}/status`, { status: "REVIEWED" }),

    // Lấy báo cáo tổng kết cuối kỳ
    getFinalReport: (internId) =>
        axiosClient.get(`/api/reports/final/${internId}`),

    // Lấy danh sách tổng hợp báo cáo (Dashboard)
    getReportsSummary: () =>
        axiosClient.get("/api/reports/dashboard-summary"),

    getStatsAssessment: () =>
        axiosClient.get("/api/reports/stats/assessment"),
};
