import axiosClient from "./axiosClient";

export const scheduleApi = {
    getMySchedule: () => axiosClient.get("/api/v1/interns/me/schedule"),
};
