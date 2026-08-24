export const appConfig = {
  title: 'HoLaHo Intern Management System',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  dateFormat: 'YYYY-MM-DD',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss'
};
