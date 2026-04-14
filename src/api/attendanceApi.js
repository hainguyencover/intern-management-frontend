import axiosClient from "@/api/axiosClient";

export const attendanceApi = {
    // Intern actions
    checkIn: () => {
        return axiosClient.post("/api/v1/attendance/check-in");
    },
    checkOut: () => {
        return axiosClient.post("/api/v1/attendance/check-out");
    },
    getMyAttendance: (params) => {
        return axiosClient.get("/api/v1/attendance/me", { params });
    },
    getTodayStatus: () => {
        return axiosClient.get("/api/v1/attendance/today");
    },

    // HR/Admin actions
    getAllAttendance: (params) => {
        return axiosClient.get("/api/v1/attendance/report", { params });
    },
    getStats: (params) => {
        return axiosClient.get("/api/v1/attendance/stats", { params });
    }
};
