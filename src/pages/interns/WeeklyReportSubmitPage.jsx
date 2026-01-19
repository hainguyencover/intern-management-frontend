import React, { useState } from "react";
import { toast } from "sonner";
import { weeklyReportApi } from "../../api/weeklyReportApi";

export default function WeeklyReportSubmitPage() {
    const [saving, setSaving] = useState(false);
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
        } catch (e) {
            console.error(e);
            toast.error("Nộp báo cáo thất bại.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="text-xl font-extrabold text-slate-900">Intern • Weekly Report</div>
                <div className="mt-1 text-sm text-slate-600">Nộp báo cáo tuần để mentor review.</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <form onSubmit={submit} className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="grid gap-1">
                            <div className="text-xs font-bold text-slate-600">Week Start *</div>
                            <input
                                type="date"
                                value={form.weekStart}
                                onChange={(e) => setForm((s) => ({ ...s, weekStart: e.target.value }))}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="grid gap-1">
                            <div className="text-xs font-bold text-slate-600">Week End *</div>
                            <input
                                type="date"
                                value={form.weekEnd}
                                onChange={(e) => setForm((s) => ({ ...s, weekEnd: e.target.value }))}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Summary *</div>
                        <textarea
                            value={form.summary}
                            onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
                            className="min-h-[110px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Tổng quan tuần này..."
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Done</div>
                        <textarea
                            value={form.done}
                            onChange={(e) => setForm((s) => ({ ...s, done: e.target.value }))}
                            className="min-h-[90px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="- Task A\n- Task B"
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Blockers</div>
                        <textarea
                            value={form.blockers}
                            onChange={(e) => setForm((s) => ({ ...s, blockers: e.target.value }))}
                            className="min-h-[90px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Vướng mắc / rủi ro..."
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Next Week Plan</div>
                        <textarea
                            value={form.nextWeekPlan}
                            onChange={(e) => setForm((s) => ({ ...s, nextWeekPlan: e.target.value }))}
                            className="min-h-[90px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Kế hoạch tuần tới..."
                        />
                    </div>

                    <button
                        disabled={saving}
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {saving ? "Đang gửi..." : "Nộp báo cáo"}
                    </button>
                </form>
            </div>
        </div>
    );
}
