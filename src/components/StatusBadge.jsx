import React from "react";

const statusConfig = {
    // Application & Document Statuses
    DRAFT: { label: "Bản nháp", class: "bg-slate-100 text-slate-700 border-slate-200" },
    PENDING: { label: "Chờ duyệt", class: "bg-amber-100 text-amber-700 border-amber-200 shadow-sm shadow-amber-100/50" },
    SUBMITTED: { label: "Đã nộp", class: "bg-blue-100 text-blue-700 border-blue-200 shadow-sm shadow-blue-100/50" },
    APPROVED: { label: "Đã phê duyệt", class: "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100/50" },
    REJECTED: { label: "Từ chối", class: "bg-rose-100 text-rose-700 border-rose-200 shadow-sm shadow-rose-100/50" },

    // Contract & Lifecycle Statuses
    SENT: { label: "Đã gửi", class: "bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm shadow-indigo-100/50" },
    SIGNED: { label: "Đã ký kết", class: "bg-teal-100 text-teal-700 border-teal-200 shadow-sm shadow-teal-100/50" },
    CANCELLED: { label: "Đã hủy", class: "bg-slate-200 text-slate-500 border-slate-300" },

    // Task & Weekly Report Statuses
    OPEN: { label: "Mở", class: "bg-sky-100 text-sky-700 border-sky-200" },
    IN_PROGRESS: { label: "Đang làm", class: "bg-orange-100 text-orange-700 border-orange-200 shadow-sm shadow-orange-100/50" },
    NEEDS_CHANGES: { label: "Cần chỉnh sửa", class: "bg-orange-50 text-orange-800 border-orange-200" },
    DONE: { label: "Hoàn tất", class: "bg-green-100 text-green-700 border-green-200 shadow-sm shadow-green-100/50" },
    REVIEWED: { label: "Đã xem xét", class: "bg-purple-100 text-purple-700 border-purple-200 shadow-sm shadow-purple-100/50" },

    // Program Lifecycle Statuses (HR)
    ACTIVE: { label: "Đang hoạt động", class: "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100/50" },
    CLOSED: { label: "Đã đóng", class: "bg-rose-100 text-rose-700 border-rose-200 shadow-sm shadow-rose-100/50" },
};

export default function StatusBadge({ status }) {
    const config = statusConfig[status] || {
        label: status || "Không rõ",
        class: "bg-slate-50 text-slate-400 border-slate-100"
    };

    return (
        <span
            className={`inline-flex items-center px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border transition-all hover:scale-105 duration-300 ${config.class}`}
        >
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-pulse" />
            {config.label}
        </span>
    );
}
