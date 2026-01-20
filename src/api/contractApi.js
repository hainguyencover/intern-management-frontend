import axiosClient from "./axiosClient";

export const documentApi = {
    // Intern endpoints
    upload: (formData) => axiosClient.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
    myDocuments: () => axiosClient.get("/api/documents/me"),
    delete: (id) => axiosClient.delete(`/api/documents/${id}`),

    // HR endpoints
    pending: (params) => axiosClient.get("/api/documents/pending", { params }),
    verify: (id, decision) => axiosClient.post(`/api/documents/${id}/verify`, decision),
    getByIntern: (internId) => axiosClient.get(`/api/documents/intern/${internId}`),
    download: (id) => axiosClient.get(`/api/documents/${id}/download`, {
        responseType: 'blob'
    }),
    getMyContracts: () => axiosClient.get("/api/contracts/me"),
    confirmContract: (id) => axiosClient.post(`/api/intern/documents/${id}/confirm`),
};

export const contractApi = documentApi;
