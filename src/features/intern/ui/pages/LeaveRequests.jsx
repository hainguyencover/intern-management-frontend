import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { leaveApi } from "@/api/leaveApi";

export default function LeaveRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
        reason: "",
        leaveType: "SICK",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await leaveApi.getMyRequests({ sort: "createdAt,desc" });
            setRequests(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được dữ liệu nghỉ phép");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await leaveApi.createRequest(form);
            toast.success("Đã gửi đơn xin nghỉ");
            setOpenForm(false);
            setForm({ startDate: "", endDate: "", reason: "", leaveType: "SICK" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gửi đơn thất bại");
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Nghỉ phép
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Quản lý đơn xin nghỉ phép cá nhân
                    </p>
                </div>
                <button
                    onClick={() => setOpenForm(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Tạo đơn mới
                </button>
            </div>

            {/* List */}
            <div className="rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Loại</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Thời gian</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Lý do</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Lý do</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Ghi chú</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{req.leaveType}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {req.startDate} → {req.endDate}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{req.reason}</td>
                                <td className="px-6 py-4 text-sm">
                                    {req.status === 'REJECTED' && (
                                        <div className="text-red-600">
                                            <span className="font-semibold">Lý do từ chối:</span> {req.rejectedReason}
                                        </div>
                                    )}
                                    {req.status === 'APPROVED' && req.approverName && (
                                        <div className="text-green-600 text-xs">
                                            Duyệt bởi: {req.approverName}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${req.status === "APPROVED" ? "bg-green-100 text-green-800" :
                                        req.status === "PENDING" ? "bg-blue-100 text-blue-800" :
                                            "bg-red-100 text-red-800"
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {openForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Tạo đơn xin nghỉ</h3>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Loại nghỉ</label>
                                <select
                                    value={form.leaveType}
                                    onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                >
                                    <option value="SICK">Nghỉ ốm (Sick)</option>
                                    <option value="CASUAL">Việc riêng (Casual)</option>
                                    <option value="ANNUAL">Nghỉ phép năm (Annual)</option>
                                    <option value="UNPAID">Nghỉ không lương (Unpaid)</option>
                                    <option value="OTHER">Lý do khác (Other)</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">Từ ngày</label>
                                    <input
                                        type="date"
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-semibold text-slate-700">Đến ngày</label>
                                    <input
                                        type="date"
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Lý do</label>
                                <textarea
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenForm(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                                >
                                    Gửi đơn
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
