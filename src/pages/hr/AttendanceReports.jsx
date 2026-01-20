import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { attendanceApi } from "../../api/attendanceApi";

export default function AttendanceReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        date: new Date().toISOString().slice(0, 10),
        status: "",
    });

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                fromDate: filters.date,
                toDate: filters.date,
                page: 0,
                size: 100 // Load more for report
            };
            const res = await attendanceApi.getAllAttendance(params);
            setReports(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được báo cáo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Báo cáo chuyên cần
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Theo dõi nhật ký chấm công của thực tập sinh
                    </p>
                </div>
                <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Xuất Excel
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-600">Ngày</label>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-600">Trạng thái</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Tất cả</option>
                        <option value="PRESENT">Đúng giờ</option>
                        <option value="LATE">Đi muộn</option>
                        <option value="ABSENT">Vắng mặt</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Intern</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Check In</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Check Out</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="4" className="p-4 text-center">Đang tải...</td></tr>
                        ) : reports.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{row.internName}</div>
                                    <div className="text-xs text-slate-500">{row.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-green-700">
                                    {row.checkIn || "--:--"}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-orange-700">
                                    {row.checkOut || "--:--"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.status === "PRESENT" ? "bg-green-100 text-green-800" :
                                        row.status === "LATE" ? "bg-yellow-100 text-yellow-800" :
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
