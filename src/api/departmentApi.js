import axiosClient from "./axiosClient";

export const departmentApi = {
    getAll: () => axiosClient.get("/api/v1/departments"),
    getById: (id) => axiosClient.get(`/api/v1/departments/${id}`),
    create: (data) => axiosClient.post("/api/v1/departments", data),
    update: (id, data) => axiosClient.put(`/api/v1/departments/${id}`, data),
    delete: (id) => axiosClient.delete(`/api/v1/departments/${id}`),
};

// Compatibility exports
export const listDepartments = () => departmentApi.getAll().then(r => r.data);
export const getDepartment = (id) => departmentApi.getById(id).then(r => r.data);
export const createDepartment = (data) => departmentApi.create(data).then(r => r.data);
export const updateDepartment = (id, data) => departmentApi.update(id, data).then(r => r.data);
export const deleteDepartment = (id) => departmentApi.delete(id).then(r => r.data);
