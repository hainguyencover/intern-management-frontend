export const appConfig = {
  apiBaseUrl: (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080',
  wsBaseUrl: (import.meta.env.VITE_WS_URL as string) || 'ws://localhost:8080/ws',
  featureFlags: {
    enable2FA: true,
    enableNotifications: true,
    experimentalDashboard: false
  }
};
