import axiosClient from "./axiosClient";

export const hrCreateProgram = (payload) =>
    axiosClient.post("/api/hr/programs", payload).then((r) => r.data);

export const hrListPrograms = (params) =>
    axiosClient.get("/api/hr/programs", { params }).then((r) => r.data);

export const hrGetProgramDetail = (id) =>
    axiosClient.get(`/api/hr/programs/${id}`).then((r) => r.data);

export const hrUpdateProgram = (id, payload) =>
    axiosClient.put(`/api/hr/programs/${id}`, payload).then((r) => r.data);

export const hrPublishProgram = (id) =>
    axiosClient.put(`/api/hr/programs/${id}/publish`).then((r) => r.data);
