import axiosClient from "@/api/axiosClient";

export const documentApi = {
    // Intern document endpoints
    upload: (formData) => axiosClient.post("/api/v1/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }),
    myDocuments: () => axiosClient.get("/api/v1/documents/me"),
    delete: (id) => axiosClient.delete(`/api/v1/documents/${id}`),

    // HR document endpoints
    pending: (params) => axiosClient.get("/api/v1/documents/pending", { params }),
    verify: (id, decision) => axiosClient.post(`/api/v1/documents/${id}/verify`, decision),
    getByIntern: (internId) => axiosClient.get(`/api/v1/documents/intern/${internId}`),
    download: (id) => axiosClient.get(`/api/v1/documents/${id}/download`, {
        responseType: 'blob'
    }),
};

export const contractApi = {
    // HR Contract Endpoints (US-009 / US-048 / US-051)
    uploadByHr: (applicationId, formData) => axiosClient.post(`/api/v1/hr/applications/${applicationId}/contract`, formData),
    replaceByHr: (applicationId, formData) => axiosClient.post(`/api/v1/hr/applications/${applicationId}/contract`, formData),
    confirmByHr: (id) => axiosClient.post(`/api/v1/hr/contracts/${id}/confirm`),
    getAll: () => axiosClient.get("/api/v1/contracts"),

    // Intern Contract Endpoints (US-010 / US-060)
    getCurrent: () => axiosClient.get("/api/v1/intern/contracts/current"),
    confirmByIntern: (id) => axiosClient.post(`/api/v1/intern/contracts/${id}/confirm`),
    requestRevision: (id, reason) => axiosClient.post(`/api/v1/intern/contracts/${id}/request-revision`, { reason }),
    getMyContracts: () => axiosClient.get("/api/v1/contracts/me"),

    // Shared Preview & Download Endpoints (US-047 / US-056)
    getById: (id) => axiosClient.get(`/api/v1/contracts/${id}`),
    downloadFile: (id) => axiosClient.get(`/api/v1/contracts/${id}/download`, {
        responseType: 'blob'
    }),
    previewFile: (id) => axiosClient.get(`/api/v1/contracts/${id}/preview`, {
        responseType: 'blob'
    }),

    // Compatibility aliases
    upload: (applicationId, formData) => axiosClient.post(`/api/v1/hr/applications/${applicationId}/contract`, formData),
    confirmContract: (id) => axiosClient.post(`/api/v1/intern/contracts/${id}/confirm`),
};
