import axiosClient from "@/api/axiosClient";

export const dashboardApi = {
    getOverview: () => {
        return axiosClient.get("/api/v1/dashboard/overview");
    },
    getHrDashboard: () => {
        return axiosClient.get("/api/v1/dashboard/hr");
    },
    getUniversityStats: () => {
        return axiosClient.get("/api/v1/dashboard/university-stats");
    }
};
