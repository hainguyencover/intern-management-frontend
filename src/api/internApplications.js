import axios from "./axiosClient";

export const internGetMyApplications = async () => {
    const res = await axios.get("/api/applications/my");
    return res.data; // List<ApplicationResponse>
};
