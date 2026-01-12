import axiosClient from "./axiosClient";

export const listDepartments = () =>
    axiosClient.get("/api/departments").then((r) => r.data);

export const getDepartment = (id) =>
    axiosClient.get(`/api/departments/${id}`).then((r) => r.data);

export const createDepartment = (data) =>
    axiosClient.post("/api/departments", data).then((r) => r.data);

export const updateDepartment = (id, data) =>
    axiosClient.put(`/api/departments/${id}`, data).then((r) => r.data);

export const deleteDepartment = (id) =>
    axiosClient.delete(`/api/departments/${id}`).then((r) => r.data);
