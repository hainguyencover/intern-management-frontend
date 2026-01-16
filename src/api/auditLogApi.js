import axiosClient from "./axiosClient";

export const auditLogApi = {
    // Get audit logs with filters
    getAuditLogs: (params) => axiosClient.get('api/admin/audit-logs', { params }),

    // Get audit log detail
    getAuditLogById: (id) => axiosClient.get(`api/admin/audit-logs/${id}`),
};
