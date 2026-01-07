import axiosClient from "../api/axiosClient.js";

export const scheduleService = {
    mySchedule: () => axiosClient.get("/api/interns/me/schedule"),
};
