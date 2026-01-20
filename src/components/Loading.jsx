import React from "react";

export default function Loading({ message = "Đang tải..." }) {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto"></div>
                <p className="text-sm text-slate-600">{message}</p>
            </div>
        </div>
    );
}
