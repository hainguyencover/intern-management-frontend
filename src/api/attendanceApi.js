import axiosClient from "./axiosClient";

export const attendanceApi = {
    // Intern actions
    checkIn: () => {
        return axiosClient.post("/api/attendance/check-in");
    },
    checkOut: () => {
        return axiosClient.post("/api/attendance/check-out");
    },
    getMyAttendance: (params) => {
        return axiosClient.get("/api/attendance/me", { params });
    },
    getTodayStatus: () => {
        return axiosClient.get("/api/attendance/today");
    },

    // HR/Admin actions
    getAllAttendance: (params) => {
        return axiosClient.get("/api/attendance/report", { params });
    },
    getStats: (params) => {
        return axiosClient.get("/api/attendance/stats", { params });
    }
};
