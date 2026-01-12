import axiosClient from "./axiosClient";

export const mentorApi = {
    create: (data) => axiosClient.post("/api/mentors", data),

    // (tuỳ chọn) nếu BE bạn có GET list mentors
    list: (params) => axiosClient.get("/api/mentors", { params }),
    getAll: (params) => axiosClient.get("/api/mentors", { params }),
};

export default mentorApi;