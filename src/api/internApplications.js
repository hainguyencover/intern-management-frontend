import axios from "@/api/axiosClient";

export const internGetMyApplications = async () => {
    const res = await axiosClient.get("/api/v1/applications/my");
    return res.data; // List<ApplicationResponse>
};
