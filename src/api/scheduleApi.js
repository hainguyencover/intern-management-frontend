import axiosClient from "@/api/axiosClient";

export const scheduleApi = {
    getMySchedule: () => axiosClient.get("/api/v1/interns/me/schedule"),
};
