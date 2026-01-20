import axiosClient from "./axiosClient";

export const backupApi = {
    // Run manual backup
    runBackup: () => axiosClient.post('api/admin/system/backup'),

    // Get backup history
    getBackupHistory: (params) => axiosClient.get('api/admin/system/backups', { params }),
};
