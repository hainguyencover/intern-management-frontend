import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { weeklyReportApi } from "@/api/weeklyReportApi";
import { Clock, FileText, CheckCircle, AlertCircle, Calendar } from "lucide-react";

export default function WeeklyReportSubmitPage() {
    const [activeTab, setActiveTab] = useState("create"); // 'create' | 'history'
    const [saving, setSaving] = useState(false);

    // History State
    const [reports, setReports] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0 });

    const [form, setForm] = useState({
        weekStart: "", // yyyy-mm-dd
        weekEnd: "",   // yyyy-mm-dd
        summary: "",
        done: "",
        blockers: "",
        nextWeekPlan: "",
    });

    const submit = async (e) => {
        e.preventDefault();
        if (!form.weekStart || !form.weekEnd) {
            toast.warning("Vui lòng chọn weekStart và weekEnd.");
            return;
        }
        if (!form.done.trim()) {
            toast.warning("Complete work is required.");
            return;
        }

        setSaving(true);
        try {
            // Helper to get week number
            const date = new Date(form.weekStart);
            const startDate = new Date(date.getFullYear(), 0, 1);
            const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
            const weekNumber = Math.ceil((days + 1) / 7);

            const payload = {
                weekNumber: weekNumber,
                reportDate: form.weekEnd,
                weekStart: form.weekStart,
                weekEnd: form.weekEnd,
                completedWork: form.done,
                plannedWork: form.nextWeekPlan,
                challenges: form.blockers,
                learnings: form.summary,
            };
            await weeklyReportApi.submit(payload);
            toast.success("Nộp báo cáo tuần thành công.");
            setForm({ weekStart: "", weekEnd: "", summary: "", done: "", blockers: "", nextWeekPlan: "" });
            setActiveTab("history"); // Switch to history after submit
        } catch (e) {
            console.error(e);
            toast.error("Nộp báo cáo thất bại.");
        } finally {
            setSaving(false);
        }
    };

    const fetchHistory = async (page = 0) => {
        try {
            setLoadingHistory(true);
            const res = await weeklyReportApi.myReports({ page, size: 10 });
            setReports(res.data.content || []);
            setPagination({
                page: res.data.number,
                size: res.data.size,
                totalPages: res.data.totalPages
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Báo cáo tuần</h1>
                <p className="text-sm text-slate-600">Theo dõi và báo cáo tiến độ thực tập hàng tuần.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("create")}
                        className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === "create"
                            ? "border-slate-900 text-slate-900"
                            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Nộp báo cáo mới
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${activeTab === "history"
                            ? "border-slate-900 text-slate-900"
                            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Lịch sử báo cáo
                        </span>
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === "create" ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="grid gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-sm font-semibold text-slate-700">Ngày bắt đầu (Week Start) *</label>
                                <input
                                    type="date"
                                    value={form.weekStart}
                                    onChange={(e) => setForm((s) => ({ ...s, weekStart: e.target.value }))}
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-semibold text-slate-700">Ngày kết thúc (Week End) *</label>
                                <input
                                    type="date"
                                    value={form.weekEnd}
                                    onChange={(e) => setForm((s) => ({ ...s, weekEnd: e.target.value }))}
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Tổng quan / Bài học (Summary) *</label>
                            <textarea
                                value={form.summary}
                                onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
                                className="min-h-[100px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                placeholder="Tóm tắt những gì bạn đã học/làm được trong tuần..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Công việc đã hoàn thành (Done) *</label>
                            <textarea
                                value={form.done}
                                onChange={(e) => setForm((s) => ({ ...s, done: e.target.value }))}
                                className="min-h-[100px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                placeholder="- Task A&#10;- Task B"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Khó khăn / Vướng mắc (Blockers)</label>
                            <textarea
                                value={form.blockers}
                                onChange={(e) => setForm((s) => ({ ...s, blockers: e.target.value }))}
                                className="min-h-[80px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                placeholder="Vướng mắc cần hỗ trợ..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-semibold text-slate-700">Kế hoạch tuần tới (Next Week Plan)</label>
                            <textarea
                                value={form.nextWeekPlan}
                                onChange={(e) => setForm((s) => ({ ...s, nextWeekPlan: e.target.value }))}
                                className="min-h-[80px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                placeholder="Dự định làm gì tiếp theo..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                disabled={saving}
                                className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 transition-all"
                            >
                                {saving ? "Đang gửi..." : "Nộp báo cáo"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {loadingHistory ? (
                        <div className="text-center py-12 text-slate-500">Đang tải dữ liệu...</div>
                    ) : reports.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                            <p className="text-slate-500">Chưa có báo cáo nào được nộp.</p>
                            <button
                                onClick={() => setActiveTab("create")}
                                className="mt-4 text-sm font-medium text-slate-900 hover:underline"
                            >
                                Nộp báo cáo đầu tiên ngay
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 font-semibold text-slate-900">
                                    <tr>
                                        <th className="px-4 py-3 w-20">Tuần</th>
                                        <th className="px-4 py-3">Thời gian</th>
                                        <th className="px-4 py-3">Trạng thái</th>
                                        <th className="px-4 py-3 text-center w-24">Điểm</th>
                                        <th className="px-4 py-3">Nhận xét của Mentor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reports.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-bold text-slate-900">#{r.weekNumber}</td>
                                            <td className="px-4 py-3 text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {r.weekStart} - {r.weekEnd}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-700' :
                                                    r.status === 'SUBMITTED' ? 'bg-blue-50 text-blue-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-slate-900">
                                                {r.rating !== null ? r.rating : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 italic">
                                                {r.mentorFeedback || "Chưa có nhận xét"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Simple Pagination if needed */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center border-t p-4">
                                    <div className="flex gap-2">
                                        <button
                                            disabled={pagination.page === 0}
                                            onClick={() => fetchHistory(pagination.page - 1)}
                                            className="px-3 py-1 text-xs border rounded hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Trước
                                        </button>
                                        <span className="text-xs self-center">Trang {pagination.page + 1} / {pagination.totalPages}</span>
                                        <button
                                            disabled={pagination.page >= pagination.totalPages - 1}
                                            onClick={() => fetchHistory(pagination.page + 1)}
                                            className="px-3 py-1 text-xs border rounded hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Sau
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
