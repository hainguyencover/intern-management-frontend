import axiosClient from "./axiosClient";

export const allowanceApi = {
    // HR actions
    search: (params) => {
        return axiosClient.get("/api/allowances", { params });
    },
    create: (data) => {
        return axiosClient.post("/api/allowances", data);
    },
    updateAllowance: (id, { amount, notes }) => {
        return axiosClient.put(`/api/allowances/${id}`, {
            amount,
            notes,
            allowanceMonth: '2000-01-01',
            internId: 0
        });
    },
    updateAllowanceSafe: (id, data) => {
        return axiosClient.put(`/api/allowances/${id}`, data);
    },
    makePayment: (id) => {
        return axiosClient.put(`/api/allowances/${id}/mark-paid`);
    },

    // Intern actions
    getMyHistory: () => {
        return axiosClient.get("/api/allowances/me");
    }
};
