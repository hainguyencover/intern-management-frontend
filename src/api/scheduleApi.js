import axiosClient from "./axiosClient";

export const scheduleApi = {
    getMySchedule: () => axiosClient.get("/api/interns/me/schedule"),
};
