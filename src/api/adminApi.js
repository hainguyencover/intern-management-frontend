import axiosClient from "./axiosClient";

export const adminUserApi = {
  // Create user
  createUser: (data) => axiosClient.post('api/admin/users', data),

  // Get all users with pagination
  getUsers: (params) => axiosClient.get('api/admin/users', { params }),

  // Get user by ID
  getUserById: (id) => axiosClient.get(`api/admin/users/${id}`),

  // Update user
  updateUser: (id, data) => axiosClient.put(`api/admin/users/${id}`, data),

  // Lock user
  lockUser: (id) => axiosClient.put(`api/admin/users/${id}/lock`),

  // Unlock user
  unlockUser: (id) => axiosClient.put(`api/admin/users/${id}/unlock`),

  // Reset password
  resetPassword: (id) => axiosClient.post(`api/admin/users/${id}/reset-password`),
};
