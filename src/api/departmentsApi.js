import axiosClient from "./axiosClient";

export const listDepartments = () =>
    axiosClient.get("/api/v1/departments").then((r) => r.data);

export const getDepartment = (id) =>
    axiosClient.get(`/api/v1/departments/${id}`).then((r) => r.data);

export const createDepartment = (data) =>
    axiosClient.post("/api/v1/departments", data).then((r) => r.data);

export const updateDepartment = (id, data) =>
    axiosClient.put(`/api/v1/departments/${id}`, data).then((r) => r.data);

export const deleteDepartment = (id) =>
    axiosClient.delete(`/api/v1/departments/${id}`).then((r) => r.data);
