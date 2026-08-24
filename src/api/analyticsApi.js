import axiosClient from './axiosClient';

const analyticsApi = {
    getOverview: (params) => {
        return axiosClient.get('/api/v1/hr/analytics/overview', { params });
    },
    getBySchool: (params) => {
        return axiosClient.get('/api/v1/hr/analytics/interns/by-school', { params });
    },
    getByMajor: (params) => {
        return axiosClient.get('/api/v1/hr/analytics/interns/by-major', { params });
    },
    getCompletion: (params) => {
        return axiosClient.get('/api/v1/hr/analytics/completion', { params });
    }
};

export default analyticsApi;
