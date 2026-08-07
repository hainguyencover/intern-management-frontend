import axiosClient from "./axiosClient";

const aiApi = {
    chat: (message) => {
        return axiosClient.post("/api/v1/ai/chat", { message });
    },
    getMatchingScore: (internId, mentorId) => {
        return axiosClient.post(`/api/v1/ai/matching-score?internId=${internId}&mentorId=${mentorId}`);
    },
    analyzeSentiment: (text) => {
        return axiosClient.post("/api/v1/ai/analyze-sentiment", text);
    },
    generateInterviewQuestions: (applicationId) => {
        return axiosClient.post(`/api/v1/ai/applications/${applicationId}/interview-questions`);
    },
    getAnalytics: () => {
        return axiosClient.get("/api/v1/ai/analytics");
    }
};

export default aiApi;
