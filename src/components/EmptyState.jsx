import React from "react";

export default function EmptyState({ message = "Không có dữ liệu", icon = "📭" }) {
    return (
        <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">{icon}</div>
                <p className="text-slate-600">{message}</p>
            </div>
        </div>
    );
}
