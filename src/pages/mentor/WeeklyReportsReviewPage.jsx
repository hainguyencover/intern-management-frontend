import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { weeklyReportApi } from "../../api/weeklyReportApi";

function Modal({ open, title, children, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 p-4">
                    <div className="text-base font-extrabold text-slate-900">{title}</div>
                    <button
                        onClick={onClose}
                        className="rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Đóng
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default function WeeklyReportsReviewPage() {
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({ internId: "", status: "" });

    const [openFb, setOpenFb] = useState(false);
    const [selected, setSelected] = useState(null);
    const [fb, setFb] = useState({ feedback: "", rating: "" });
    const [saving, setSaving] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await weeklyReportApi.list({
                ...(filters.internId ? { internId: filters.internId } : {}),
                ...(filters.status ? { status: filters.status } : {}),
            });
            setReports(res.data.content || res.data || []);
        } catch (e) {
            toast.error("Không tải được danh sách báo cáo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.internId, filters.status]);

    const openFeedback = (r) => {
        setSelected(r);
        setFb({
            feedback: r.mentorFeedback || "",
            rating: r.rating != null ? String(r.rating) : "",
        });
        setOpenFb(true);
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        if (!selected) return;
        if (!fb.feedback.trim()) {
            toast.warning("Vui lòng nhập feedback.");
            return;
        }

        if (fb.rating !== "" && (Number(fb.rating) < 0 || Number(fb.rating) > 10)) {
            toast.warning("Điểm đánh giá phải từ 0 đến 10.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                feedback: fb.feedback,
                ...(fb.rating !== "" ? { rating: Number(fb.rating) } : {}),
            };
            await weeklyReportApi.feedback(selected.id, payload);
            toast.success("Gửi phản hồi thành công.");
            setOpenFb(false);
            setSelected(null);
            fetchReports();
        } catch (e) {
            toast.error("Gửi phản hồi thất bại.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="text-xl font-extrabold text-slate-900">Mentor • Weekly Reports</div>
                <div className="mt-1 text-sm text-slate-600">
                    Xem báo cáo tuần và phản hồi để hỗ trợ thực tập sinh.
                </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
                <div className="grid gap-1">
                    <div className="text-xs font-bold text-slate-600">Intern ID</div>
                    <input
                        value={filters.internId}
                        onChange={(e) => setFilters((s) => ({ ...s, internId: e.target.value }))}
                        placeholder="VD: 101"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                </div>

                <div className="grid gap-1">
                    <div className="text-xs font-bold text-slate-600">Status</div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả</option>
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="REVIEWED">REVIEWED</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={fetchReports}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50"
                    >
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-4 text-sm font-extrabold text-slate-900">
                    Danh sách báo cáo
                </div>

                {loading ? (
                    <div className="p-4 text-sm text-slate-600">Đang tải...</div>
                ) : reports.length === 0 ? (
                    <div className="p-4 text-sm text-slate-600">Chưa có báo cáo.</div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {reports.map((r) => (
                            <div key={r.id} className="p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="text-base font-extrabold text-slate-900">
                                                {r.weekStart ? String(r.weekStart).slice(0, 10) : "?"} →{" "}
                                                {r.weekEnd ? String(r.weekEnd).slice(0, 10) : "?"}
                                            </div>
                                            {r.internId ? (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                                    Intern: {r.internId} - {r.internName}
                                                </span>
                                            ) : null}
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                                {(r.status || "SUBMITTED").toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">
                                            {r.summary || "(no summary)"}
                                        </div>

                                        {(r.mentorFeedback || r.rating !== null) ? (
                                            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="text-xs font-extrabold text-slate-700">Mentor feedback</div>
                                                    {r.rating !== null && (
                                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                            Rating: {r.rating}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-slate-800 whitespace-pre-wrap">{r.mentorFeedback || <i>(No text feedback)</i>}</div>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => openFeedback(r)}
                                            className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-extrabold text-white hover:bg-slate-800"
                                        >
                                            Phản hồi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal open={openFb} title="Phản hồi báo cáo tuần" onClose={() => setOpenFb(false)}>
                <form onSubmit={submitFeedback} className="grid gap-3">
                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Feedback *</div>
                        <textarea
                            value={fb.feedback}
                            onChange={(e) => setFb((s) => ({ ...s, feedback: e.target.value }))}
                            className="min-h-[120px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Gợi ý cải thiện, nhận xét tuần này..."
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Rating (0-10)</div>
                        <input
                            type="number"
                            min="0"
                            max="10"
                            value={fb.rating}
                            onChange={(e) => {
                                let val = e.target.value;
                                if (Number(val) > 10) val = "10";
                                if (Number(val) < 0) val = "0";
                                setFb((s) => ({ ...s, rating: val }));
                            }}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="VD: 8"
                        />
                    </div>

                    <button
                        disabled={saving}
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {saving ? "Đang gửi..." : "Gửi phản hồi"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
