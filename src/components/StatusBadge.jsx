import React from "react";

const statusConfig = {
    DRAFT: { bg: "bg-gray-50", text: "text-gray-700", ring: "ring-gray-200" },
    PENDING: { bg: "bg-yellow-50", text: "text-yellow-700", ring: "ring-yellow-200" },
    SUBMITTED: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
    APPROVED: { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200" },
    REJECTED: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
    SENT: { bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-200" },
    SIGNED: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
};

export default function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.DRAFT;

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}
        >
            {status}
        </span>
    );
}
