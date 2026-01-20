import axiosClient from "./axiosClient";

export const adminUserApi = {
  // Create user
  createUser: (data) => axiosClient.post('api/admin/users', data),

  // Get all users with pagination
  getUsers: (params) => axiosClient.get('api/admin/users', { params }),

  updateUserStatus: (id, status) => axiosClient.put(`/api/admin/users/${id}/status`, { status }),

  // Roles & Permissions
  listPermissions: () => axiosClient.get("/api/admin/permissions"),
  updateRolePermissions: (roleId, permissionIds) =>
    axiosClient.put(`/api/admin/roles/${roleId}/permissions`, { permissionIds }),

  // Audit Logs
  auditLogs: (params) => axiosClient.get("/api/audit-logs", { params }),

  // Backup
  runBackup: () => axiosClient.post("/api/admin/system/backup"),
  listBackups: (params) => axiosClient.get("/api/admin/system/backups", { params }),

  // Get user by ID
  getUserById: (id) => axiosClient.get(`api/admin/users/${id}`),

  // Update user
  updateUser: (id, data) => axiosClient.put(`api/admin/users/${id}`, data),

  // Lock user
  lockUser: (id) => axiosClient.put(`api/admin/users/${id}/status`, { status: 'LOCKED' }),

  // Unlock user
  unlockUser: (id) => axiosClient.put(`api/admin/users/${id}/status`, { status: 'ACTIVE' }),

  // Reset password
  resetPassword: (id) => axiosClient.post(`api/admin/users/${id}/reset-password`),

  // System Configs
  getSystemConfigs: () => axiosClient.get("/api/admin/system/configs"),
  updateSystemConfig: (key, data) => axiosClient.put(`/api/admin/system/configs/${key}`, data),
};
