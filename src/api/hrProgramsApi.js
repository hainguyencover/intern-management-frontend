import axiosClient from "./axiosClient";

export const hrCreateProgram = (payload) =>
    axiosClient.post("/api/v1/hr/programs", payload).then((r) => r.data);

export const hrListPrograms = (params) =>
    axiosClient.get("/api/v1/hr/programs", { params }).then((r) => r.data);

export const hrGetProgramDetail = (id) =>
    axiosClient.get(`/api/v1/hr/programs/${id}`).then((r) => r.data);

export const hrUpdateProgram = (id, payload) =>
    axiosClient.put(`/api/v1/hr/programs/${id}`, payload).then((r) => r.data);

export const hrPublishProgram = (id) =>
    axiosClient.put(`/api/hr/programs/${id}/publish`).then((r) => r.data);
