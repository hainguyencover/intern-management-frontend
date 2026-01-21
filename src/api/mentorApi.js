import axiosClient from "./axiosClient";

export const mentorApi = {
    create: (data) => axiosClient.post("/api/mentors", data),

    list: (params) => axiosClient.get("/api/mentors", { params }),
    getAll: (params) => axiosClient.get("/api/mentors", { params }),
    workload: (params) => axiosClient.get("/api/hr/mentors/workload", { params }),

};

export default mentorApi;