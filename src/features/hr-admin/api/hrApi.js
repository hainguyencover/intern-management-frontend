import axiosClient from "@/api/axiosClient";

export const hrApi = {
    dashboard: () => axiosClient.get("/api/v1/dashboard/hr"),
    statistics: {
        universityDistribution: () => axiosClient.get("/api/v1/statistics/university-distribution"),
        programCompletion: () => axiosClient.get("/api/v1/statistics/program-completion"),
    },
};
