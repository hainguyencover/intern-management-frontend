import dayjs from "dayjs";
import { DATE_FORMAT, DATETIME_FORMAT } from "@/utils/constants";

export const formatDate = (date, format = DATE_FORMAT) => {
    if (!date) return "";
    return dayjs(date).format(format);
};

export const formatDateTime = (date) => {
    return formatDate(date, DATETIME_FORMAT);
};

export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

export const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone.replace(/\s/g, ""));
};

export const normalizeRole = (role) => {
    if (!role) return "";
    const upper = String(role).toUpperCase();
    if (upper.startsWith("ROLE_")) return upper.substring(5);
    return upper;
};

export const hasRole = (user, requiredRole) => {
    if (!user || !user.roles) return false;
    return user.roles.some(r => normalizeRole(r) === normalizeRole(requiredRole));
};

export const hasAnyRole = (user, requiredRoles = []) => {
    if (!user || !user.roles) return false;
    return requiredRoles.some(role => hasRole(user, role));
};

export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return "Đã xảy ra lỗi không xác định";
};

export const buildQueryString = (params) => {
    const cleanParams = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    return new URLSearchParams(cleanParams).toString();
};
