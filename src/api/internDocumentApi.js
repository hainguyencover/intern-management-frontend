import axiosClient from "@/api/axiosClient.js";

function handleAxiosError(err) {
    if (err && err.response) {
        const status = err.response.status;
        const data = err.response.data || {};
        const backendMessage =
            (typeof data === "string" ? data : data.message || data.error || "") ||
            "";

        if (status === 401) {
            const e = new Error("Unauthorized");
            e.code = "UNAUTHORIZED";
            e.status = 401;
            e.backendMessage = backendMessage;
            throw e;
        }

        if (status === 404 && /profile/i.test(backendMessage)) {
            const e = new Error(backendMessage || "Profile not found");
            e.code = "PROFILE_NOT_FOUND";
            e.status = status;
            e.backendMessage = backendMessage;
            throw e;
        }

        if (status === 404) {
            const e = new Error(backendMessage || "Not Found");
            e.code = "NOT_FOUND";
            e.status = status;
            e.backendMessage = backendMessage;
            throw e;
        }

        if (status === 413) {
            const e = new Error(backendMessage || "Dung lượng file quá lớn (Tối đa 10MB).");
            e.code = "PAYLOAD_TOO_LARGE";
            e.status = status;
            e.backendMessage = backendMessage;
            throw e;
        }

        const e = new Error(
            backendMessage || `Yêu cầu thất bại với mã lỗi ${status}`
        );
        e.status = status;
        e.backendMessage = backendMessage;
        throw e;
    }
    throw err;
}

async function tryEndpoints(method, endpoints, options = {}) {
    let lastErr = null;
    for (const ep of endpoints) {
        const url = typeof ep === "string" ? ep : ep.url;
        const baseCfg = options.config || {};
        const epCfg = (typeof ep === "object" && ep.config) ? ep.config : {};
        const cfg = { ...baseCfg, ...epCfg };
        cfg.params = { ...(baseCfg.params || {}), ...(epCfg.params || {}) };
        try {
            if (method === "get") return await axiosClient.get(url, cfg);
            if (method === "post") return await axiosClient.post(url, options.body, cfg);
            if (method === "patch") return await axiosClient.patch(url, options.body, cfg);
            if (method === "put") return await axiosClient.put(url, options.body || null, cfg);
            if (method === "delete") return await axiosClient.delete(url, cfg);
        } catch (err) {
            if (err && err.response) {
                const status = err.response.status;
                const data = err.response.data || {};
                const backendMessage =
                    (typeof data === "string"
                        ? data
                        : data.message || data.error || "") || "";

                if (
                    status === 401 ||
                    (status === 404 && /profile/i.test(backendMessage))
                ) {
                    handleAxiosError(err);
                }
                if ([404, 405, 413].includes(status)) {
                    lastErr = err;
                    continue;
                }
                handleAxiosError(err);
            } else {
                lastErr = err;
            }
        }
    }
    if (lastErr) handleAxiosError(lastErr);
    return null;
}

export const internDocumentApi = {
    // ========== INTERN ==========
    getMyDocuments: async () => {
        try {
            const endpoints = [
                "/api/v1/intern/documents",
                "/api/v1/me/documents",
                "/api/v1/documents",
            ];

            const eps = endpoints.map((u) => ({ url: u }));
            const res = await tryEndpoints("get", eps);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    uploadDocument: async ({ type, file, internId, onUploadProgress }) => {
        try {
            const form = new FormData();
            form.append("type", type);
            form.append("file", file);
            if (internId) {
                form.append("internId", internId);
            }

            const endpoints = [
                { url: "/api/v1/intern/documents" },
                { url: "/api/v1/me/documents" },
                { url: "/api/v1/documents/upload" },
                { url: "/api/v1/documents" },
            ];

            const res = await tryEndpoints("post", endpoints, {
                body: form,
                config: {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress
                }
            });
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    // ========== HR ==========
    getPendingDocuments: async (params) => {
        try {
            const res = await axiosClient.get("/api/v1/hr/documents", { params });
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    getInternDocuments: async ({ internId }) => {
        try {
            const endpoints = [
                `/api/v1/hr/interns/${internId}/documents`,
                `/api/v1/interns/${internId}/documents`,
                `/api/v1/documents?internId=${internId}`,
            ];
            const eps = endpoints.map((u) => ({ url: u }));
            const res = await tryEndpoints("get", eps);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    approveDocument: async ({ id, hrUserId }) => {
        try {
            const endpoints = [
                {
                    url: `/api/v1/hr/documents/${id}/approve`,
                    config: { params: { hrUserId } },
                },
                {
                    url: `/api/v1/documents/${id}/approve`,
                    config: { params: { hrUserId } },
                },
            ];

            const res = await tryEndpoints("patch", endpoints);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    rejectDocument: async ({ id, hrUserId, note, reason }) => {
        try {
            const rejectionReason = (reason || note || "").trim();
            const body = { reason: rejectionReason, note: rejectionReason };

            const endpoints = [
                {
                    url: `/api/v1/hr/documents/${id}/reject`,
                    config: { params: { hrUserId, note: rejectionReason, reason: rejectionReason } },
                },
                {
                    url: `/api/v1/documents/${id}/reject`,
                    config: { params: { hrUserId, note: rejectionReason, reason: rejectionReason } },
                },
            ];

            const res = await tryEndpoints("patch", endpoints, { body });
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    // ========== DOWNLOAD ==========
    downloadDocument: async ({ id, requesterUserId, isHr }) => {
        try {
            const urls = isHr
                ? [
                    `/api/v1/hr/documents/download/${id}`,
                    `/api/v1/hr/documents/${id}/download`,
                    `/api/v1/documents/download/${id}`,
                    `/api/v1/documents/${id}/download`,
                ]
                : [
                    `/api/v1/documents/download/${id}`,
                    `/api/v1/documents/${id}/download`,
                ];

            const baseConfig = {
                responseType: "blob",
                params: { requesterUserId },
            };

            const endpoints = urls.map((u) => ({ url: u, config: baseConfig }));

            return await tryEndpoints("get", endpoints, { config: baseConfig });
        } catch (err) {
            handleAxiosError(err);
        }
    },

    uploadContractForIntern: async (internId, file) => {
        const form = new FormData();
        form.append("file", file);
        const res = await axiosClient.post(`/api/v1/hr/interns/${internId}/documents/contracts`, form);
        return res.data;
    },

    getDocumentsOfIntern: async (internId) => {
        try {
            const res = await axiosClient.get(`/api/v1/hr/interns/${internId}/documents`);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    downloadAsBlob: (documentId) => {
        return axiosClient.get(`/api/v1/hr/documents/download/${documentId}`, {
            responseType: "blob",
        });
    },

    confirmMyContract: async (documentId) => {
        try {
            const res = await axiosClient.post(`/api/v1/intern/documents/${documentId}/confirm`);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    downloadMyAsBlob: (documentId) => {
        return axiosClient.get(`/api/v1/documents/${documentId}/download`, {
            responseType: "blob",
        });
    },
};
