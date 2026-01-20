import axiosClient from "./axiosClient";

export const dashboardApi = {
    getOverview: () => {
        return axiosClient.get("/api/dashboard/overview");
    },
    getHrDashboard: () => {
        return axiosClient.get("/api/dashboard/hr");
    },
    getUniversityStats: () => {
        return axiosClient.get("/api/dashboard/university-stats");
    }
};
