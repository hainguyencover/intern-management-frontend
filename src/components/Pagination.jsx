import React from "react";

export default function Pagination({ current, total, pageSize, onChange }) {
    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="flex items-center justify-between border-t px-4 py-3">
            <button
                disabled={current <= 0}
                onClick={() => onChange(current - 1)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-slate-50"
            >
                ← Previous
            </button>
            <span className="text-sm text-slate-600">
        Page {current + 1} of {totalPages || 1}
      </span>
            <button
                disabled={current >= totalPages - 1}
                onClick={() => onChange(current + 1)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-50 hover:bg-slate-50"
            >
                Next →
            </button>
        </div>
    );
}
