import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { leaveApi } from "../../api/leaveApi";

export default function LeaveApprovals() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await leaveApi.getAllRequests({
                status: 'PENDING',
                sort: 'createdAt,desc'
            });
            setRequests(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được danh sách đơn");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm("Duyệt đơn này?")) return;
        try {
            await leaveApi.approve(id);
            toast.success("Đã duyệt đơn");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Nhập lý do từ chối:");
        if (reason === null) return; // Cancelled
        if (!reason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }

        try {
            await leaveApi.reject(id, reason);
            toast.success("Đã từ chối đơn");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Duyệt nghỉ phép
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Xử lý các đơn xin nghỉ phép từ thực tập sinh
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Intern</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Loại/Lý do</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Thời gian</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="4" className="p-4 text-center">Đang tải...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan="4" className="p-8 text-center text-slate-500">Không có đơn nào chờ duyệt</td></tr>
                        ) : requests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{req.internName}</td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-700">{req.leaveType}</div>
                                    <div className="text-sm text-slate-500">{req.reason}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {req.startDate} → {req.endDate}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleApprove(req.id)}
                                        className="mr-2 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.id)}
                                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                                    >
                                        Từ chối
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
