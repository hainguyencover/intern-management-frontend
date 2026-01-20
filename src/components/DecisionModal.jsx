import React, { useState } from "react";
import { createPortal } from "react-dom";

export default function DecisionModal({ open, onClose, onSubmit, mode = "APPROVE" }) {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const title = mode === "APPROVE" ? "Duyệt hồ sơ" : "Từ chối hồ sơ";
    const hint = mode === "APPROVE"
        ? "Xác nhận duyệt hồ sơ này."
        : "Vui lòng nhập lý do từ chối (khuyến nghị).";

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await onSubmit({ decision: mode, comment });
            onClose();
            setComment("");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <div className="border-b px-5 py-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{hint}</p>
                </div>

                <div className="px-5 py-4">
                    <label className="text-sm font-medium text-slate-700">Ghi chú / Lý do</label>
                    <textarea
                        className="mt-2 w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        rows={5}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={mode === "APPROVE" ? "Ghi chú (tùy chọn)" : "Lý do từ chối..."}
                    />
                </div>

                <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
                    <button
                        className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
                            mode === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                        }`}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : mode === "APPROVE" ? "Duyệt" : "Từ chối"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
