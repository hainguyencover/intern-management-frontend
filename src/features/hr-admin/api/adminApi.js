import axiosClient from "@/api/axiosClient";

export const adminUserApi = {
  // Create user
  createUser: (data) => axiosClient.post('/api/v1/admin/users', data),

  // Get all users with pagination
  getUsers: (params) => axiosClient.get('/api/v1/admin/users', { params }),

  updateUserStatus: (id, status) => axiosClient.put(`/api/v1/admin/users/${id}/status`, { status }),

  // Roles & Permissions
  listPermissions: () => axiosClient.get("/api/v1/admin/permissions"),
  updateRolePermissions: (roleId, permissionIds) =>
    axiosClient.put(`/api/v1/admin/roles/${roleId}/permissions`, { permissionIds }),

  // Audit Logs
  auditLogs: (params) => axiosClient.get("/api/v1/audit-logs", { params }),

  // Backup
  runBackup: () => axiosClient.post("/api/v1/admin/system/backup"),
  listBackups: (params) => axiosClient.get("/api/v1/admin/system/backups", { params }),

  // Get user by ID
  getUserById: (id) => axiosClient.get(`/api/v1/admin/users/${id}`),

  // Update user
  updateUser: (id, data) => axiosClient.put(`/api/v1/admin/users/${id}`, data),

  // Lock user
  lockUser: (id) => axiosClient.put(`/api/v1/admin/users/${id}/status`, { status: 'LOCKED' }),

  // Unlock user
  unlockUser: (id) => axiosClient.put(`/api/v1/admin/users/${id}/status`, { status: 'ACTIVE' }),

  // Reset password
  resetPassword: (id) => axiosClient.post(`/api/v1/admin/users/${id}/reset-password`),

  // Delete user
  deleteUser: (id) => axiosClient.delete(`/api/v1/admin/users/${id}`),

  // Assign roles
  assignRoles: (id, roleCodes) => axiosClient.put(`/api/v1/admin/users/${id}/roles`, { roleCodes }),

  // System Configs
  getSystemConfigs: () => axiosClient.get("/api/v1/admin/system/configs"),
  updateSystemConfig: (key, data) => axiosClient.put(`/api/v1/admin/system/configs/${key}`, data),
};
