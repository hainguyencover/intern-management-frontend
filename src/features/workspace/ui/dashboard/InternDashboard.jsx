import React, { useMemo, useState, useEffect } from "react";
import {
    CheckCircle2,
    Calendar,
    Clock,
    Trophy,
    Rocket,
    ChevronRight,
    Star,
    Target,
    BookOpen,
    FileText,
    Inbox
} from "lucide-react";
import { useAuth } from "@/features/auth/model/AuthContext";
import { Link } from "react-router-dom";
import { internApi } from "@/features/intern/api/internApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timeline, TimelineItem, TimelineContent } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/utils";

export default function InternDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await internApi.getDashboard();
                setStats(res.data);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const displayStats = stats || {
        tasksCompleted: 0,
        tasksTotal: 1,
        daysInternship: 0,
        totalDays: 90,
        recentActivities: [],
        internName: user?.fullName || "Thực tập sinh",
        position: "N/A",
        mentorName: "Chưa có"
    };

    const taskProgress = Math.round((displayStats.tasksCompleted / (displayStats.tasksTotal || 1)) * 100);
    const internshipProgress = Math.round((displayStats.daysInternship / (displayStats.totalDays || 1)) * 100);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-none px-3 py-1">
                            <Star className="h-3 w-3 mr-1.5 fill-current" />
                            Hành trình học hỏi
                        </Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            Chào mừng trở lại, {displayStats.internName}!
                        </h1>
                        <p className="max-w-xl text-slate-400 text-lg leading-relaxed">
                            Hãy tiếp tục nỗ lực và hoàn thành các mục tiêu thực tập của bạn trong tuần này.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md">
                                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vị trí thực tập</span>
                                <span className="text-sm font-semibold text-slate-200">{displayStats.position}</span>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md">
                                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Mentor hướng dẫn</span>
                                <span className="text-sm font-semibold text-slate-200">{displayStats.mentorName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-center h-48 w-48 rounded-full bg-gradient-to-br from-primary/10 to-primary/30 border border-white/5 shadow-inner">
                        <Rocket className="h-24 w-24 text-primary animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Task Progress Card */}
                <Card className="md:col-span-1 border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="h-16 w-16" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            Tiến độ công việc
                        </CardTitle>
                        <CardDescription>Mục tiêu tuần này</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground font-medium">Hoàn thành</span>
                                <span className="font-bold">{displayStats.tasksCompleted}/{displayStats.tasksTotal} Tasks</span>
                            </div>
                            <Progress value={taskProgress} className="h-3 bg-slate-100" />
                            <p className="text-[10px] text-right text-muted-foreground font-semibold">
                                {taskProgress}% Hoàn thành
                            </p>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="block text-2xl font-black text-slate-900">{displayStats.tasksTotal - displayStats.tasksCompleted}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Cần làm</span>
                            </div>
                            <div className="text-center p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                                <span className="block text-2xl font-black text-emerald-600">{displayStats.tasksCompleted}</span>
                                <span className="text-[10px] text-emerald-600/70 uppercase font-bold">Đã xong</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Shortcuts */}
                <Card className="md:col-span-2 border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Rocket className="h-5 w-5 text-primary" />
                            Truy cập nhanh
                        </CardTitle>
                        <CardDescription>Lối tắt đến các tính năng chính</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { to: "/intern/tasks", icon: CheckCircle2, label: "Công việc", color: "bg-blue-50 text-blue-600 border-blue-100" },
                                { to: "/intern/reports/weekly/submit", icon: FileText, label: "Báo cáo", color: "bg-purple-50 text-purple-600 border-purple-100" },
                                { to: "/interns/me/schedule", icon: Calendar, label: "Lịch họp", color: "bg-orange-50 text-orange-600 border-orange-100" },
                                { to: "/intern/documents", icon: BookOpen, label: "Tài liệu", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                            ].map((item, i) => (
                                <Link key={i} to={item.to}>
                                    <div className={cn("group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all hover:scale-105 active:scale-95", item.color)}>
                                        <item.icon className="h-6 w-6 mb-2" />
                                        <span className="text-[12px] font-bold">{item.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
                            <CardDescription>Nhật ký hành động của bạn</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">Xem thêm</Button>
                    </CardHeader>
                    <CardContent>
                        <Timeline>
                            {displayStats.recentActivities && displayStats.recentActivities.length > 0 ? (
                                displayStats.recentActivities.map((act, i) => (
                                    <TimelineItem key={i}>
                                        <TimelineContent>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-slate-800">{act.content}</span>
                                                <span className="text-[10px] text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">{act.timeAgo}</span>
                                            </div>
                                            {act.description && <p className="text-xs text-muted-foreground">{act.description}</p>}
                                        </TimelineContent>
                                    </TimelineItem>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 opacity-40">
                                    <Inbox className="h-12 w-12 mb-2" />
                                    <p className="text-sm font-medium">Chưa có hoạt động nào</p>
                                </div>
                            )}
                        </Timeline>
                    </CardContent>
                </Card>

                {/* Additional Info / Tips */}
                <Card className="border-none bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Mục tiêu tiếp theo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm leading-relaxed opacity-90 italic">
                            "Mọi thử thách đều là cơ hội để bạn bứt phá. Hãy hoàn thành báo cáo tuần đúng hạn!"
                        </p>
                        <div className="space-y-4">
                            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                <h5 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Lời khuyên</h5>
                                <ul className="text-xs space-y-2 list-disc list-inside opacity-90">
                                    <li>Trao đổi thường xuyên với Mentor</li>
                                    <li>Cập nhật tiến độ task hàng ngày</li>
                                    <li>Tích cực tham gia các buổi họp nhóm</li>
                                </ul>
                            </div>
                            <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 font-bold">
                                Bắt đầu ngay
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
