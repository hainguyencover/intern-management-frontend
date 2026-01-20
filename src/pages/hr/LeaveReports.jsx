import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { leaveApi } from "../../api/leaveApi";

export default function LeaveReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: "",
    });

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                page: 0,
                size: 100
            };
            if (filters.status) params.status = filters.status;

            const res = await leaveApi.getAllRequests(params);
            setReports(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được báo cáo nghỉ phép");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Báo cáo nghỉ phép
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Danh sách yêu cầu nghỉ phép của thực tập sinh
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-600">Trạng thái</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Tất cả</option>
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="APPROVED">Đã duyệt</option>
                        <option value="REJECTED">Từ chối</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Intern</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Loại nghỉ</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Thời gian</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Lý do</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Đang tải...</td></tr>
                        ) : reports.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{row.internName}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-900">
                                    {row.leaveType}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {row.startDate} → {row.endDate}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                    {row.reason}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.status === "APPROVED" ? "bg-green-100 text-green-800" :
                                            row.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-red-100 text-red-800"
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
