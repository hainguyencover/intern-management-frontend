import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mentorApi } from "@/features/mentor/api/mentorApi";
import { taskApi } from "@/features/task/api/taskApi";
import { reportApi } from "@/api/reportApi";
import { toast } from "sonner";
import TaskCard from "@/features/mentor/ui/components/TaskCard";
import ReportCard from "@/features/mentor/ui/components/ReportCard";

export default function InternDetailView() {
    const { internId } = useParams();
    const [intern, setIntern] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("info"); // info | tasks | reports

    useEffect(() => {
        loadInternDetail();
    }, [internId]);

    const loadInternDetail = async () => {
        try {
            setLoading(true);
            const [internRes, tasksRes, reportsRes] = await Promise.all([
                mentorApi.getInternDetail(internId),
                taskApi.getAssignedTasks({ assigneeId: internId }),
                reportApi.getInternReports(internId, {}),
            ]);
            setIntern(internRes.data);
            setTasks(tasksRes.data.content || tasksRes.data || []);
            setReports(reportsRes.data.content || reportsRes.data || []);
        } catch (error) {
            console.error("Failed to load intern detail:", error);
            toast.error("Không thể tải thông tin thực tập sinh");
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

    if (!intern) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                <p className="text-sm text-slate-600">Không tìm thấy thực tập sinh</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/mentor/interns"
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                        >
                            ← Quay lại
                        </Link>
                    </div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        {intern.fullName || intern.name}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">{intern.email}</p>
                </div>

                <div className="flex gap-2">
                    <Link
                        to={`/mentor/tasks/new?assignee=${internId}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Giao task mới
                    </Link>
                    <Link
                        to={`/mentor/evaluations/new?intern=${internId}`}
                        className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                        Đánh giá
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`border-b-2 pb-3 text-sm font-semibold transition ${activeTab === "info"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Thông tin
                    </button>
                    <button
                        onClick={() => setActiveTab("tasks")}
                        className={`border-b-2 pb-3 text-sm font-semibold transition ${activeTab === "tasks"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Task ({tasks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("reports")}
                        className={`border-b-2 pb-3 text-sm font-semibold transition ${activeTab === "reports"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Báo cáo ({reports.length})
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "info" && (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* 1. Personal Info */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <h3 className="font-bold text-slate-800">Thông tin cá nhân</h3>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Họ và tên:</span>
                                <span className="col-span-2 font-medium text-slate-900">{intern.fullName || intern.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Email:</span>
                                <span className="col-span-2 font-medium text-slate-900">{intern.email}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Điện thoại:</span>
                                <span className="col-span-2 font-medium text-slate-900">{intern.phone || "---"}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Ngày sinh:</span>
                                <span className="col-span-2 font-medium text-slate-900">
                                    {intern.dob ? new Date(intern.dob).toLocaleDateString("vi-VN") : "---"}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Địa chỉ:</span>
                                <span className="col-span-2 font-medium text-slate-900">{intern.address || "---"}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Education Info */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <h3 className="font-bold text-slate-800">Thông tin học vấn</h3>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Trường:</span>
                                <span className="col-span-2 font-medium text-slate-900">{intern.university || "---"}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Chuyên ngành:</span>
                                <span className="col-span-2 font-medium text-slate-900">{intern.major || "---"}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Mã sinh viên:</span>
                                <span className="col-span-2 font-medium text-slate-900">{intern.studentCode || "---"}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">GPA:</span>
                                <span className="col-span-2 font-medium text-slate-900">{intern.gpa || "---"}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Hồ sơ CV:</span>
                                <span className="col-span-2 font-medium text-blue-600">
                                    {intern.cvUrl ? <a href={intern.cvUrl} target="_blank" rel="noreferrer" className="hover:underline">Xem CV</a> : "Chưa cập nhật"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Internship Period */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <h3 className="font-bold text-slate-800">Thời gian thực tập</h3>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Ngày bắt đầu:</span>
                                <span className="col-span-2 font-medium text-slate-900">
                                    {intern.startDate ? new Date(intern.startDate).toLocaleDateString("vi-VN") : "---"}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Ngày kết thúc:</span>
                                <span className="col-span-2 font-medium text-slate-900">
                                    {intern.endDate ? new Date(intern.endDate).toLocaleDateString("vi-VN") : "---"}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-slate-500">Trạng thái:</span>
                                <span className="col-span-2">
                                    <span
                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${intern.status === "ACTIVE"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-slate-100 text-slate-700"
                                            }`}
                                    >
                                        {intern.status === "ACTIVE" ? "Đang thực tập" : intern.status}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {activeTab === "tasks" && (
                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                            <p className="text-sm text-slate-600">Chưa có task nào</p>
                            <Link
                                to={`/mentor/tasks/new?assignee=${internId}`}
                                className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Tạo task mới
                            </Link>
                        </div>
                    ) : (
                        tasks.map((task) => <TaskCard key={task.id} task={task} />)
                    )}
                </div>
            )}

            {activeTab === "reports" && (
                <div className="space-y-3">
                    {reports.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                            <p className="text-sm text-slate-600">Chưa có báo cáo nào</p>
                        </div>
                    ) : (
                        reports.map((report) => <ReportCard key={report.id} report={report} />)
                    )}
                </div>
            )}
        </div>
    );
}
