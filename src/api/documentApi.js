import axiosClient from "@/api/axiosClient";

export const documentApi = {
    // Intern endpoints
    upload: (formData) => axiosClient.post("/api/v1/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
    getMyDocuments: () => axiosClient.get("/api/v1/documents/me"),
    deleteDocument: (id) => axiosClient.delete(`/api/v1/documents/${id}`),

    // HR endpoints
    pending: (params) => axiosClient.get("/api/v1/documents/pending", { params }),
    verify: (id, decision) => axiosClient.post(`/api/v1/documents/${id}/verify`, decision),
    getByIntern: (internId) => axiosClient.get(`/api/v1/documents/intern/${internId}`),
    download: (id) => axiosClient.get(`/api/v1/documents/${id}/download`, {
        responseType: 'blob'
    }),
};
