import axiosClient from "./axiosClient";

export const permissionApi = {
    // Get all permissions
    getAllPermissions: () => axiosClient.get('api/admin/permissions'),

    // Get role with permissions
    getRolePermissions: (roleId) => axiosClient.get(`api/admin/roles/${roleId}/permissions`),

    // Update role permissions
    updateRolePermissions: (roleId, data) =>
        axiosClient.put(`api/admin/roles/${roleId}/permissions`, data),
};
