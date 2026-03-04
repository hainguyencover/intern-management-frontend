import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../StatusBadge";
import {
    User,
    Calendar,
    Clock,
    Eye,
    Edit2,
    Trash2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

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
        <Card className="group border-none shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <CardHeader className="p-6 pb-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={task.status} />
                            {task.progressPercent === 100 && (
                                <Badge variant="secondary" className="h-5 px-1.5 rounded-md bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[9px] uppercase tracking-tighter">
                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Ready
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-black text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {task.title}
                        </h3>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-4">
                <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed italic">
                    {task.description || "Project Manager không cung cấp mô tả cho nhiệm vụ này."}
                </p>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="truncate">{task.assigneeName || `ID: ${task.assigneeId}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                        <Clock className="h-3 w-3 text-slate-300" />
                        <span className={daysLeft !== null && daysLeft <= 3 ? "text-rose-500" : "text-slate-500"}>
                            {formatDate(task.dueDate)}
                        </span>
                    </div>
                </div>

                {task.progressPercent !== undefined && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-300 uppercase">
                            <span>Execution</span>
                            <span className="text-slate-900">{task.progressPercent}%</span>
                        </div>
                        <Progress value={task.progressPercent} className="h-2 rounded-full bg-slate-100" />
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 bg-slate-50/50 border-t flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5 shrink-0">
                    <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg font-bold text-slate-500 hover:text-slate-900">
                        <Link to={`/mentor/tasks/${task.id}`}>
                            <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(task)}
                            className="h-8 w-8 rounded-lg p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(task.id)}
                            className="h-8 w-8 rounded-lg p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </CardFooter>

            {daysLeft !== null && daysLeft <= 2 && daysLeft >= 0 && (
                <div className="absolute top-0 right-0 p-1">
                    <div className="bg-rose-500 h-2 w-2 rounded-full animate-ping" />
                </div>
            )}
        </Card>
    );
}
