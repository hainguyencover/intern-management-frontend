import axiosClient from "@/api/axiosClient.js";

function handleAxiosError(err) {
    // Normalize axios error into thrown Error with codes for caller
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

        // If backend indicates profile not found (message text), surface a specific error
        if (status === 404 && /profile/i.test(backendMessage)) {
            const e = new Error(backendMessage || "Profile not found");
            e.code = "PROFILE_NOT_FOUND";
            e.status = status;
            e.backendMessage = backendMessage;
            throw e;
        }

        // Generic 404 -> return a NOT_FOUND error (do not conflate with profile-specific error)
        if (status === 404) {
            const e = new Error(backendMessage || "Not Found");
            e.code = "NOT_FOUND";
            e.status = status;
            e.backendMessage = backendMessage;
            throw e;
        }

        if (status === 413) {
            const e = new Error(backendMessage || "File too large");
            e.code = "PAYLOAD_TOO_LARGE";
            e.status = status;
            e.backendMessage = backendMessage;
            throw e;
        }

        const e = new Error(
            backendMessage || `Request failed with status ${status}`
        );
        e.status = status;
        e.backendMessage = backendMessage;
        throw e;
    }
    throw err;
}

async function tryEndpoints(method, endpoints, options = {}) {
    // endpoints: array of {url, config?}
    let lastErr = null;
    for (const ep of endpoints) {
        const url = typeof ep === "string" ? ep : ep.url;
        const baseCfg = options.config || {};
        const epCfg = (typeof ep === "object" && ep.config) ? ep.config : {};
        const cfg = { ...baseCfg, ...epCfg };
        // merge sâu params (rất quan trọng)
        cfg.params = { ...(baseCfg.params || {}), ...(epCfg.params || {}) };
        try {
            if (method === "get") return await axiosClient.get(url, cfg);
            if (method === "post") return await axiosClient.post(url, options.body, cfg);
            if (method === "put") return await axiosClient.put(url, options.body || null, cfg);
            if (method === "delete") return await axiosClient.delete(url, cfg);
        } catch (err) {
            // If error is 404/405/413 we may try next endpoint; rethrow on 401/profile-not-found or other fatal errors
            if (err && err.response) {
                const status = err.response.status;
                const data = err.response.data || {};
                const backendMessage =
                    (typeof data === "string"
                        ? data
                        : data.message || data.error || "") || "";
                // fatal cases: unauthorized, profile not found
                // Fatal cases: unauthorized, or a profile-specific 404 (don't treat generic "Not Found" as fatal)
                if (
                    status === 401 ||
                    (status === 404 && /profile/i.test(backendMessage))
                ) {
                    handleAxiosError(err);
                }
                // if 404 or 405 or 413 -> capture and try next
                if ([404, 405, 413].includes(status)) {
                    lastErr = err;
                    continue; // try next endpoint
                }
                // other statuses -> normalized throw
                handleAxiosError(err);
            } else {
                lastErr = err;
            }
        }
    }
    // If we exhausted endpoints, throw the last error normalized
    if (lastErr) handleAxiosError(lastErr);
    return null;
}

export const internDocumentApi = {
    // ========== INTERN ==========
    // Backend often reads the current intern from the JWT / security context.
    // Try common endpoint patterns and fall back if the backend uses a different path.
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

    // uploadDocument: backend expects a multipart/form-data with fields:
    // - type (string)
    // - file (the uploaded file)
    // - internId (optional, required if user is HR/ADMIN)
    uploadDocument: async ({ type, file, internId }) => {
        try {
            const form = new FormData();
            // ensure expected field names
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

            const res = await tryEndpoints("post", endpoints, { body: form });
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    // ========== HR ==========
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
                    url: `/api/v1/documents/${id}/approve`,
                    config: { params: { hrUserId } },
                },
                {
                    url: `/api/v1/hr/documents/${id}/approve`,
                    config: { params: { hrUserId } },
                },
                {
                    url: `/api/v1/hr/documents/${id}`,
                    config: { params: { action: "approve", hrUserId } },
                },
            ];

            const res = await tryEndpoints("put", endpoints);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    rejectDocument: async ({ id, hrUserId, note }) => {
        try {
            const endpoints = [
                {
                    url: `/api/v1/documents/${id}/reject`,
                    config: { params: { hrUserId, note } },
                },
                {
                    url: `/api/v1/hr/documents/${id}/reject`,
                    config: { params: { hrUserId, note } },
                },
                {
                    url: `/api/v1/hr/documents/${id}`,
                    config: { params: { action: "reject", hrUserId, note } },
                },
            ];

            const res = await tryEndpoints("put", endpoints);
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

    // HR upload internship contract for a given internId
    uploadContractForIntern: async (internId, file) => {
        const form = new FormData();
        form.append("file", file);
        const res = await axiosClient.post(`/api/v1/hr/interns/${internId}/documents/contracts`, form);
        return res.data;
    },

    // HR list documents of an intern
    getDocumentsOfIntern: async (internId) => {
        try {
            const res = await axiosClient.get(`/api/v1/hr/interns/${internId}/documents`);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    // HR download (alias endpoint)
    downloadAsBlob: (documentId) => {
        return axiosClient.get(`/api/v1/hr/documents/download/${documentId}`, {
            responseType: "blob",
        });
    },

    confirmMyContract: async (documentId) => {
        // backend: @PostMapping("/api/v1/intern/documents/{id}/confirm")
        try {
            const res = await axiosClient.post(`/api/v1/intern/documents/${documentId}/confirm`);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    downloadMyAsBlob: (documentId) => {
        // Phổ biến: /api/v1/documents/{id}/download
        return axiosClient.get(`/api/v1/documents/${documentId}/download`, {
            responseType: "blob",
        });
    },
};
