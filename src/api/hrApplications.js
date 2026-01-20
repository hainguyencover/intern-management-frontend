import axios from "./axiosClient";

export const hrListApplications = async ({ page = 0, size = 10, status = "", q = "" }) => {
    const params = { page, size };
    if (status) params.status = status;
    if (q) params.q = q;
    const res = await axios.get("/api/hr/applications", { params });
    return res.data;
};

export const hrGetApplicationDetail = async (id) => {
    const res = await axios.get(`/api/hr/applications/${id}`);
    return res.data;
};

export const hrReviewApplication = async (id, payload) => {
    const res = await axios.post(`/api/hr/applications/${id}/review`, payload);
    return res.data;
};
