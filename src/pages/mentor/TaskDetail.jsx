import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { taskApi } from "../../api/taskApi";
import { toast } from "sonner";
import StatusBadge from "../../components/mentor/StatusBadge";

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const res = await taskApi.getTaskDetail(id);
            setTask(res.data);
        } catch (error) {
            console.error("Failed to load task:", error);
            toast.error("Không thể tải thông tin task");
            navigate("/mentor/tasks"); // Redirect back on error
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Đang tải thông tin task...</div>;
    }

    if (!task) return null;

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    ← Quay lại
                </button>
                <div className="flex gap-2">
                    <Link
                        to={`/mentor/tasks/${task.id}/edit`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Chỉnh sửa
                    </Link>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
                            <StatusBadge status={task.status} />
                        </div>
                        <p className="text-sm text-slate-500">
                            Ngày tạo: {new Date(task.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-1 text-sm font-semibold text-slate-900">Người thực hiện</h3>
                        <p className="text-slate-600">{task.assigneeName || "Chưa giao"}</p>
                    </div>
                    <div>
                        <h3 className="mb-1 text-sm font-semibold text-slate-900">Deadline</h3>
                        <p className="text-slate-600">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString("vi-VN") : "Không có"}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <h3 className="mb-2 text-sm font-semibold text-slate-900">Mô tả</h3>
                        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                            {task.description || "Không có mô tả chi tiết."}
                        </div>
                    </div>
                    {task.groupName && (
                        <div className="col-span-2">
                            <h3 className="mb-1 text-sm font-semibold text-slate-900">Nhóm thực tập</h3>
                            <p className="text-slate-600">{task.groupName}</p>
                        </div>
                    )}
                </div>

                {task.progressPercent !== undefined && (
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-slate-900">Tiến độ</span>
                            <span className="font-medium text-blue-600">{task.progressPercent}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-100">
                            <div
                                className="h-2.5 rounded-full bg-blue-600 transition-all"
                                style={{ width: `${task.progressPercent}%` }}
                            />
                        </div>
                        {task.latestUpdate && (
                            <p className="mt-2 text-xs text-slate-500 italic">
                                Cập nhật: {task.latestUpdate}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
