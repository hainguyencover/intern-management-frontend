import axiosClient from "@/api/axiosClient";

export const permissionApi = {
    // Get all permissions
    getAllPermissions: () => axiosClient.get('/api/v1/admin/permissions'),

    // Get role with permissions
    getRolePermissions: (roleId) => axiosClient.get(`/api/v1/admin/roles/${roleId}/permissions`),

    // Update role permissions
    updateRolePermissions: (roleId, data) =>
        axiosClient.put(`/api/v1/admin/roles/${roleId}/permissions`, data),
};
