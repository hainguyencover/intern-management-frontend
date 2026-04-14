import axiosClient from "@/api/axiosClient";

// TODO: đổi endpoint theo backend bạn đang có.
// Ví dụ nếu có: /api/hr/applications?status=APPROVED
export const hrListEligibleInterns = async (programId) => {
    // placeholder: bạn thay bằng endpoint thật
    const { data } = await axiosClient.get("/api/v1/hr/eligible-interns", { params: { programId } });
    return data;
};
