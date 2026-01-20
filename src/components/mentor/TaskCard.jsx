import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function TaskCard({ task, onEdit, onDelete }) {
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null;
        const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days;
    };

    const daysLeft = getDaysUntilDue(task.dueDate);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{task.title}</h3>
                        <StatusBadge status={task.status} />
                    </div>

                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {task.description || "Không có mô tả"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                        <div>
                            <span className="font-medium">Người làm:</span>{" "}
                            {task.assigneeName || `ID: ${task.assigneeId}`}
                        </div>
                        <div>
                            <span className="font-medium">Deadline:</span> {formatDate(task.dueDate)}
                            {daysLeft !== null && (
                                <span
                                    className={`ml-1 ${
                                        daysLeft < 0
                                            ? "text-red-600"
                                            : daysLeft <= 3
                                                ? "text-orange-600"
                                                : "text-green-600"
                                    }`}
                                >
                  ({daysLeft < 0 ? `Trễ ${Math.abs(daysLeft)} ngày` : `Còn ${daysLeft} ngày`})
                </span>
                            )}
                        </div>
                        {task.progressPercent !== undefined && (
                            <div>
                                <span className="font-medium">Tiến độ:</span> {task.progressPercent}%
                            </div>
                        )}
                    </div>
                </div>

                <div className="ml-4 flex gap-2">
                    <Link
                        to={`/mentor/tasks/${task.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Xem
                    </Link>
                    {onEdit && (
                        <button
                            onClick={() => onEdit(task)}
                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                        >
                            Sửa
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(task.id)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                            Xóa
                        </button>
                    )}
                </div>
            </div>

            {task.progressPercent !== undefined && (
                <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-slate-100">
                        <div
                            className="h-2 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${task.progressPercent}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
