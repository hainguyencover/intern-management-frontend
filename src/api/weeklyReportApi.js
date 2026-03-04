import axiosClient from "./axiosClient.js";

export const weeklyReportApi = {
    // Intern: nộp báo cáo tuần
    submit: (payload) => axiosClient.post("/api/v1/reports/weekly", payload),

    // Mentor: danh sách báo cáo
    list: (params = {}) => axiosClient.get("/api/v1/mentor/weekly-reports", { params }),

    // Intern: báo cáo của tôi
    myReports: (params = {}) => axiosClient.get("/api/v1/interns/me/weekly-reports", { params }),

    // Mentor/Intern: Xem chi tiết báo cáo
    getById: (id) => axiosClient.get(`/api/v1/reports/${id}`),

    // Mentor: phản hồi báo cáo
    submitFeedback: (reportId, payload) =>
        axiosClient.put(`/api/v1/reports/${reportId}/feedback`, payload),
};
