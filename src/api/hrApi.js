import axiosClient from "./axiosClient";

export const hrApi = {
    dashboard: () => axiosClient.get("/api/dashboard/hr"),
    statistics: {
        universityDistribution: () => axiosClient.get("/api/statistics/university-distribution"),
        programCompletion: () => axiosClient.get("/api/statistics/program-completion"),
    },
};
