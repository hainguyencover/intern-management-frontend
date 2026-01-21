import React, { useEffect, useMemo, useState } from "react";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - ticketId: number | null
 * - role: "INTERN" | "HR"
 * - api: supportTicketApi (pass from caller)
 * - onAfterAction: () => void   // reload list after comment/status change
 */
export default function TicketDetailModal({ open, onClose, ticketId, role, api, onAfterAction }) {
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null); // { ticket, comments }
    const [comment, setComment] = useState("");
    const [statusDraft, setStatusDraft] = useState("");

    const isHr = role === "HR";
    const STATUSES = useMemo(() => ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"], []);
    const canLoad = open && ticketId != null;

    const normalizeDetail = (data) => {
        // Backend trả dạng: { ticket, comments }
        // Nếu sau này bạn đổi backend trả phẳng, vẫn chạy vì fallback
        const ticket = data?.ticket ?? data ?? null;
        const comments = data?.comments ?? [];
        return { ticket, comments };
    };

    const loadDetail = async () => {
        if (!canLoad) return;
        setLoading(true);
        try {
            const res = isHr ? await api.hrDetail(ticketId) : await api.internDetail(ticketId);
            const normalized = normalizeDetail(res.data);
            setDetail(normalized);
            setStatusDraft(normalized.ticket?.status || "");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, ticketId]);

    const submitComment = async () => {
        const content = comment.trim();
        if (!content) return;

        setLoading(true);
        try {
            if (isHr) await api.hrAddComment(ticketId, { content });
            else await api.internAddComment(ticketId, { content });

            setComment("");
            await loadDetail();    // refresh comments in modal
            onAfterAction?.();     // refresh list page
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async () => {
        if (!isHr) return;
        const status = (statusDraft || "").trim();
        if (!status) return;

        setLoading(true);
        try {
            await api.hrUpdateStatus(ticketId, { status });
            await loadDetail();
            onAfterAction?.();
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const ticket = detail?.ticket;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div className="text-sm font-extrabold text-slate-900">
                        Ticket Detail {ticketId != null ? `#${ticketId}` : ""}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-sm font-bold text-slate-600 hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    {loading && !detail ? (
                        <div className="text-sm text-slate-500">Loading...</div>
                    ) : !detail || !ticket ? (
                        <div className="text-sm text-slate-500">No data.</div>
                    ) : (
                        <div className="grid gap-4">
                            {/* Ticket info */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-lg font-extrabold text-slate-900">{ticket.title}</div>
                                <div className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{ticket.content}</div>

                                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="font-semibold">Category:</span> {ticket.category}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Status:</span> {ticket.status}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Created:</span>{" "}
                                        {ticket.createdAt ? String(ticket.createdAt).replace("T", " ") : "-"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Created by:</span> {ticket.createdByEmail || "-"}
                                    </div>
                                </div>

                                {/* HR actions */}
                                {isHr && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <select
                                            className="w-[190px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                            value={statusDraft || ticket.status}
                                            onChange={(e) => setStatusDraft(e.target.value)}
                                        >
                                            {STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            disabled={loading}
                                            onClick={updateStatus}
                                            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            Cập nhật trạng thái
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Comments */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="text-sm font-extrabold text-slate-900">Trao đổi</div>

                                <div className="mt-3 grid max-h-[260px] gap-2 overflow-auto pr-1">
                                    {(detail.comments || []).length ? (
                                        detail.comments.map((c) => (
                                            <div key={c.id} className="rounded-xl border border-slate-200 p-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="text-xs font-bold text-slate-900">
                                                        {c.authorEmail || c.createdByEmail || "User"}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {c.createdAt ? String(c.createdAt).replace("T", " ") : ""}
                                                    </div>
                                                </div>
                                                <div className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{c.content}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-slate-500">Chưa có phản hồi.</div>
                                    )}
                                </div>

                                <div className="mt-4 grid gap-2">
                  <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder={isHr ? "Nhập phản hồi cho intern..." : "Nhập phản hồi của bạn cho HR..."}
                  />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            disabled={loading}
                                            onClick={submitComment}
                                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            Gửi phản hồi
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {loading && detail && <div className="text-sm text-slate-500">Đang xử lý...</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
