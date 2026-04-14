import axiosClient from "@/api/axiosClient.js";

export const scheduleService = {
    mySchedule: () => axiosClient.get("/api/v1/interns/me/schedule"),
};
