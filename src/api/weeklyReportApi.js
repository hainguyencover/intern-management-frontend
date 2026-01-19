import axiosClient from "./axiosClient.js";

export const weeklyReportApi = {
    // Intern: nộp báo cáo tuần
    submit: (payload) => axiosClient.post("/api/reports/weekly", payload),

    // Mentor: danh sách báo cáo
    list: (params = {}) => axiosClient.get("/api/mentor/weekly-reports", { params }),

    // Intern: báo cáo của tôi
    myReports: (params = {}) => axiosClient.get("/api/interns/me/weekly-reports", { params }),

    // Mentor: phản hồi báo cáo
    feedback: (reportId, payload) =>
        axiosClient.put(`/api/reports/${reportId}/feedback`, payload),
};
