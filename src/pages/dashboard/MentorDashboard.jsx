import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mentorApi } from "../../api/mentorApi";
import { toast } from "sonner";
import TaskCard from "../../components/mentor/TaskCard";
import ReportCard from "../../components/mentor/ReportCard";

export default function MentorDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const res = await mentorApi.getDashboardStats();
            setStats(res.data);
        } catch (error) {
            console.error("Failed to load dashboard:", error);
            toast.error("Không thể tải dữ liệu dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-slate-600">Đang tải...</div>
            </div>
        );
    }

    const {
        totalInterns = 0,
        activeTasks = 0,
        pendingReports = 0,
        recentTasks = [],
        recentReports = [],
    } = stats || {};

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Dashboard Mentor
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Tổng quan hoạt động hướng dẫn thực tập sinh
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="text-sm font-medium text-slate-600">Số thực tập sinh</div>
                    <div className="mt-2 text-3xl font-bold text-slate-900">{totalInterns}</div>
                    <Link
                        to="/mentor/interns"
                        className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Xem danh sách →
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="text-sm font-medium text-slate-600">Task đang làm</div>
                    <div className="mt-2 text-3xl font-bold text-slate-900">{activeTasks}</div>
                    <Link
                        to="/mentor/tasks"
                        className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Quản lý task →
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="text-sm font-medium text-slate-600">Báo cáo chờ xem</div>
                    <div className="mt-2 text-3xl font-bold text-slate-900">{pendingReports}</div>
                    <Link
                        to="/mentor/reports"
                        className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Xem báo cáo →
                    </Link>
                </div>
            </div>

            {/* Recent Tasks */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Task gần đây</h2>
                    <Link
                        to="/mentor/tasks"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Xem tất cả
                    </Link>
                </div>

                {recentTasks.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                        <p className="text-sm text-slate-600">Chưa có task nào</p>
                        <Link
                            to="/mentor/tasks/new"
                            className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Tạo task mới
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentTasks.slice(0, 3).map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Reports */}
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Báo cáo mới nhất</h2>
                    <Link
                        to="/mentor/reports"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Xem tất cả
                    </Link>
                </div>

                {recentReports.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                        <p className="text-sm text-slate-600">Chưa có báo cáo nào</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentReports.slice(0, 3).map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
