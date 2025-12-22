import axiosClient from "./axiosClient.js";

function handleAxiosError(err) {
    // Normalize axios error into thrown Error with codes for caller
    if (err && err.response) {
        const status = err.response.status;
        const data = err.response.data || {};
        const backendMessage = (typeof data === "string" ? data : data.message || data.error || "") || "";

        if (status === 401) {
            const e = new Error("Unauthorized");
            e.code = "UNAUTHORIZED";
            e.status = 401;
            e.backendMessage = backendMessage;
            throw e;
        }

        // If backend indicates profile not found (message text or 404), surface a specific error
        if (status === 404 || /profile/i.test(backendMessage) || /not found/i.test(backendMessage)) {
            const e = new Error(backendMessage || "Profile not found");
            e.code = "PROFILE_NOT_FOUND";
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

        const e = new Error(backendMessage || `Request failed with status ${status}`);
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
        const cfg = typeof ep === "object" && ep.config ? ep.config : options.config || {};
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
                const backendMessage = (typeof data === "string" ? data : data.message || data.error || "") || "";
                // fatal cases: unauthorized, profile not found
                if (status === 401 || status === 404 && /profile/i.test(backendMessage) || /not found/i.test(backendMessage)) {
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
                "/api/intern/documents",
                "/api/me/documents",
                "/api/documents",
            ];

            const eps = endpoints.map((u) => ({url: u}));
            const res = await tryEndpoints("get", eps);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    // uploadDocument: backend expects a multipart/form-data with fields:
    // - type (string)
    // - file (the uploaded file)
    // Do NOT send internId; backend uses authenticated user.
    uploadDocument: async ({type, file}) => {
        try {
            const form = new FormData();
            // ensure expected field names
            form.append("type", type);
            form.append("file", file);

            const endpoints = [
                {url: "/api/intern/documents"},
                {url: "/api/me/documents"},
                {url: "/api/documents/upload"},
                {url: "/api/documents"},
            ];

            const res = await tryEndpoints("post", endpoints, {body: form});
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    // ========== HR ==========
    getInternDocuments: async ({internId}) => {
        try {
            const endpoints = [
                `/api/hr/interns/${internId}/documents`,
                `/api/interns/${internId}/documents`,
                `/api/documents?internId=${internId}`,
            ];
            const eps = endpoints.map((u) => ({url: u}));
            const res = await tryEndpoints("get", eps);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    approveDocument: async ({id, hrUserId}) => {
        try {
            const endpoints = [
                {url: `/api/documents/${id}/approve`, config: {params: {hrUserId}}},
                {url: `/api/hr/documents/${id}/approve`, config: {params: {hrUserId}}},
                {url: `/api/hr/documents/${id}`, config: {params: {action: "approve", hrUserId}}},
            ];

            const res = await tryEndpoints("put", endpoints);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    rejectDocument: async ({id, hrUserId, note}) => {
        try {
            const endpoints = [
                {url: `/api/documents/${id}/reject`, config: {params: {hrUserId, note}}},
                {url: `/api/hr/documents/${id}/reject`, config: {params: {hrUserId, note}}},
                {url: `/api/hr/documents/${id}`, config: {params: {action: "reject", hrUserId, note}}},
            ];

            const res = await tryEndpoints("put", endpoints);
            return res.data;
        } catch (err) {
            handleAxiosError(err);
        }
    },

    // ========== DOWNLOAD ==========
    downloadDocument: async ({id, requesterUserId, isHr}) => {
        try {
            const hrEndpoints = [
                `/api/hr/documents/download/${id}`,
                `/api/hr/documents/${id}/download`,
                `/api/documents/download/${id}`,
                `/api/documents/${id}/download`,
            ];
            const userEndpoints = [
                `/api/documents/download/${id}`,
                `/api/documents/${id}/download`,
                `/api/download/documents/${id}`,
                `/api/download/documents/${id}`,
            ];

            const endpoints = (isHr ? hrEndpoints : userEndpoints).map((u) => ({url: u, config: {params: {requesterUserId}}}));

            const res = await tryEndpoints("get", endpoints, {config: {responseType: "blob", params: {requesterUserId}}});
            return res;
        } catch (err) {
            handleAxiosError(err);
        }
    },
};
