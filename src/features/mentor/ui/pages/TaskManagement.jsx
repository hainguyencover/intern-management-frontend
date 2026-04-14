import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { taskApi } from "@/features/task/api/taskApi";
import { toast } from "sonner";
import TaskCard from "@/features/mentor/ui/components/TaskCard";

export default function TaskManagement() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "",
        keyword: "",
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const res = await taskApi.getAssignedTasks(filters);
            setTasks(res.data.content || res.data || []);
        } catch (error) {
            console.error("Failed to load tasks:", error);
            toast.error("Không thể tải danh sách task");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadTasks();
    };

    const handleEdit = (task) => {
        navigate(`/mentor/tasks/${task.id}/edit`);
    };

    const handleDelete = async (taskId) => {
        if (!confirm("Bạn có chắc muốn xóa task này?")) return;

        try {
            await taskApi.deleteTask(taskId);
            toast.success("Đã xóa task");
            loadTasks();
        } catch (error) {
            console.error("Failed to delete task:", error);
            toast.error("Không thể xóa task");
        }
    };

    const groupedTasks = {
        OPEN: tasks.filter((t) => t.status === "OPEN"),
        IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
        SUBMITTED: tasks.filter((t) => ["SUBMITTED", "APPROVED", "DONE"].includes(t.status)),
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-slate-600">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Quản lý Task
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Tạo và theo dõi task cho thực tập sinh
                    </p>
                </div>
                <Link
                    to="/mentor/tasks/new"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Tạo task mới
                </Link>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề..."
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                        className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="OPEN">Mới</option>
                        <option value="IN_PROGRESS">Đang làm</option>
                        <option value="DONE">Hoàn thành</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Task Board */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Mới */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">
                            Mới ({groupedTasks.OPEN.length})
                        </h3>
                        <span className="text-xs text-slate-500">OPEN</span>
                    </div>
                    <div className="space-y-2">
                        {groupedTasks.OPEN.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                        {groupedTasks.OPEN.length === 0 && (
                            <p className="py-4 text-center text-sm text-slate-500">Không có task</p>
                        )}
                    </div>
                </div>

                {/* Đang làm */}
                <div className="rounded-xl border border-slate-200 bg-yellow-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">
                            Đang làm ({groupedTasks.IN_PROGRESS.length})
                        </h3>
                        <span className="text-xs text-slate-500">IN_PROGRESS</span>
                    </div>
                    <div className="space-y-2">
                        {groupedTasks.IN_PROGRESS.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                        {groupedTasks.IN_PROGRESS.length === 0 && (
                            <p className="py-4 text-center text-sm text-slate-500">Không có task</p>
                        )}
                    </div>
                </div>

                {/* Đã nộp */}
                <div className="rounded-xl border border-slate-200 bg-purple-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">
                            Đã nộp ({groupedTasks.SUBMITTED.length})
                        </h3>
                        <span className="text-xs text-slate-500">SUBMITTED</span>
                    </div>
                    <div className="space-y-2">
                        {groupedTasks.SUBMITTED.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                        {groupedTasks.SUBMITTED.length === 0 && (
                            <p className="py-4 text-center text-sm text-slate-500">Không có task</p>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
}
