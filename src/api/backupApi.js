import axiosClient from "./axiosClient";

export const backupApi = {
    // Run manual backup
    runBackup: () => axiosClient.post('/api/v1/admin/system/backup'),

    // Get backup history
    getBackupHistory: (params) => axiosClient.get('/api/v1/admin/system/backups', { params }),
};
