import axiosClient from "./axiosClient";

export const evaluationApi = {
    // Tạo đánh giá mới
    createEvaluation: (payload) =>
        axiosClient.post("/api/evaluations", payload),

    // Lấy danh sách đánh giá đã tạo
    getMyEvaluations: (params) =>
        axiosClient.get("/api/evaluations/me", { params }),

    // Lấy đánh giá của một intern
    getInternEvaluations: (internId) =>
        axiosClient.get(`/api/evaluations/intern/${internId}`),

    // Cập nhật đánh giá
    updateEvaluation: (id, payload) =>
        axiosClient.put(`/api/evaluations/${id}`, payload),

    // Submit đánh giá (finalize)
    submitEvaluation: (id) =>
        axiosClient.put(`/api/evaluations/${id}/submit`),

    // Lấy chi tiết đánh giá
    getEvaluationDetail: (id) =>
        axiosClient.get(`/api/evaluations/${id}`),
};
