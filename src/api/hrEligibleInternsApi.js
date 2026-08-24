import axiosClient from "@/api/axiosClient";

export const hrListEligibleInterns = async (params = {}) => {
    const { data } = await axiosClient.get("/api/v1/hr/applications", {
        params: { status: "APPROVED", ...params }
    });
    return data;
};

