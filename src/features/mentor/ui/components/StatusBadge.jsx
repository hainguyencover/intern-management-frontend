import React from "react";

const STATUS_COLORS = {
    // Task statuses
    OPEN: "bg-blue-50 text-blue-700 border-blue-200",
    IN_PROGRESS: "bg-yellow-50 text-yellow-700 border-yellow-200",
    SUBMITTED: "bg-purple-50 text-purple-700 border-purple-200",
    APPROVED: "bg-green-50 text-green-700 border-green-200",
    NEEDS_CHANGES: "bg-orange-50 text-orange-700 border-orange-200",
    DONE: "bg-emerald-50 text-emerald-700 border-emerald-200",

    // Report statuses
    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
    REVIEWED: "bg-green-50 text-green-700 border-green-200",
};

const STATUS_LABELS = {
    OPEN: "Mới",
    IN_PROGRESS: "Đang làm",
    SUBMITTED: "Đã nộp",
    APPROVED: "Đã duyệt",
    NEEDS_CHANGES: "Cần sửa",
    DONE: "Hoàn thành",
    DRAFT: "Nháp",
    REVIEWED: "Đã xem",
};

export default function StatusBadge({ status }) {
    const colorClass = STATUS_COLORS[status] || "bg-gray-50 text-gray-700 border-gray-200";
    const label = STATUS_LABELS[status] || status;

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}
        >
      {label}
    </span>
    );
}
