import axiosClient from "./axiosClient";

export const evaluationApi = {
    // Tạo đánh giá mới
    createEvaluation: (payload) =>
        axiosClient.post("/api/v1/evaluations", payload),

    // Lấy danh sách đánh giá đã tạo
    getMyEvaluations: (params) =>
        axiosClient.get("/api/v1/evaluations/me", { params }),

    // Lấy đánh giá của một intern
    getInternEvaluations: (internId) =>
        axiosClient.get(`/api/v1/evaluations/intern/${internId}`),

    // Cập nhật đánh giá
    updateEvaluation: (id, payload) =>
        axiosClient.put(`/api/v1/evaluations/${id}`, payload),

    // Submit đánh giá (finalize)
    submitEvaluation: (id) =>
        axiosClient.put(`/api/v1/evaluations/${id}/submit`),

    // Lấy chi tiết đánh giá
    getEvaluationDetail: (id) =>
        axiosClient.get(`/api/v1/evaluations/${id}`),
};
