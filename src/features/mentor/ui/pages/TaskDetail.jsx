import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { taskApi } from "@/features/task/api/taskApi";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import {
    ChevronLeft,
    Edit3,
    Calendar,
    User,
    AlignLeft,
    Users,
    Target,
    Clock,
    Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
            toast.error("Không thể tải thông tin task");
            navigate("/mentor/tasks");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Đang truy xuất dữ liệu Task...</p>
            </div>
        );
    }

    if (!task) return null;

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="h-12 w-12 rounded-2xl border-2 border-slate-100 bg-white shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
                    >
                        <ChevronLeft className="h-6 w-6 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Chi tiết nhiệm vụ</h1>
                        <p className="text-sm font-medium text-slate-500 italic">Quản lý và giám sát tiến độ thực hiện Task của Intern.</p>
                    </div>
                </div>
                <Button asChild className="rounded-xl h-12 px-6 bg-slate-900 hover:bg-black font-black shadow-xl shadow-slate-200">
                    <Link to={`/mentor/tasks/${task.id}/edit`}>
                        <Edit3 className="mr-2 h-5 w-5" /> Chỉnh sửa
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <StatusBadge status={task.status} />
                                <Badge variant="outline" className="h-6 px-2 rounded-lg border-slate-200 bg-white text-slate-500 font-bold uppercase tracking-tight text-[10px]">
                                    UID: {task.id}
                                </Badge>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">{task.title}</h2>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Ngày tạo: {new Date(task.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                        </div>
                        <div className="h-16 w-16 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-primary">
                            <Target className="h-8 w-8" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <Label>Người thực hiện</Label>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    <User className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-slate-800">{task.assigneeName || "Chưa giao cho cá nhân"}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Hạn định (Deadline)</Label>
                            <div className="p-4 rounded-xl bg-rose-50/30 border border-rose-100 flex items-center gap-3 text-rose-600">
                                <Clock className="h-5 w-5" />
                                <span className="font-bold">{task.dueDate ? new Date(task.dueDate).toLocaleDateString("vi-VN") : "Vô thời hạn"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 pt-2">
                            <AlignLeft className="h-3 w-3" /> Mô tả chi tiết
                        </Label>
                        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-inner text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                            {task.description || "Project Manager không cung cấp mô tả chi tiết cho nhiệm vụ này."}
                        </div>
                    </div>

                    {task.groupName && (
                        <div className="space-y-1">
                            <Label>Nhóm thực hiện</Label>
                            <div className="flex items-center gap-2 font-bold text-indigo-600 bg-indigo-50 w-fit px-4 py-2 rounded-xl">
                                <Users className="h-4 w-4" />
                                {task.groupName}
                            </div>
                        </div>
                    )}

                    {task.progressPercent !== undefined && (
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-primary" /> Tiến độ thực hiện
                                </Label>
                                <span className="text-lg font-black text-primary">{task.progressPercent}%</span>
                            </div>
                            <Progress value={task.progressPercent} className="h-3 rounded-full bg-slate-100" />
                            {task.latestUpdate && (
                                <p className="text-xs text-slate-400 font-medium italic flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> Cập nhật lần cuối: {task.latestUpdate}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-slate-50/50 p-6 border-t px-8 text-xs text-slate-400 font-medium flex items-center gap-2">
                    CodeGym IMS Task Monitoring System | Version 2.0.4-Stable
                </CardFooter>
            </Card>
        </div>
    );
}

const Label = ({ children, className }) => (
    <span className={`block text-[10px] font-black uppercase tracking-widest leading-relaxed mb-1 text-slate-400 ${className}`}>
        {children}
    </span>
);
