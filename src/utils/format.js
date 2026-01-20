export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
