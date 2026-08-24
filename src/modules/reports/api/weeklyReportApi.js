import axiosClient from "@/api/axiosClient.js";

export const weeklyReportApi = {
  // Intern APIs
  createDraft: (payload) => axiosClient.post("/api/v1/interns/me/weekly-reports", payload),
  updateDraft: (id, payload) => axiosClient.put(`/api/v1/interns/me/weekly-reports/${id}`, payload),
  submitReport: (id) => axiosClient.post(`/api/v1/interns/me/weekly-reports/${id}/submit`),
  getMyReports: (params = {}) => axiosClient.get("/api/v1/interns/me/weekly-reports", { params }),
  getMyReportDetail: (id) => axiosClient.get(`/api/v1/interns/me/weekly-reports/${id}`),

  // Mentor APIs
  getMentorReports: (params = {}) => axiosClient.get("/api/v1/mentor/weekly-reports", { params }),
  getMentorReportDetail: (id) => axiosClient.get(`/api/v1/mentor/weekly-reports/${id}`),
  addFeedback: (id, payload) => axiosClient.post(`/api/v1/mentor/weekly-reports/${id}/feedback`, payload),
};
