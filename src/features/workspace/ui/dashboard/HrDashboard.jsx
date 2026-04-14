import React, { useEffect, useState, useMemo } from "react";
import {
    Users,
    FilePlus,
    FolderKanban,
    ClipboardCheck,
    BarChart3,
    TrendingUp,
    Cake,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { hrApi } from "@/features/hr-admin/api/hrApi.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function HrDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await hrApi.dashboard();
            setStats(response.data);
        } catch (error) {
            console.error("Error loading dashboard:", error);
            // Enhanced Mock data for demo
            setStats({
                totalInterns: 80,
                pendingApplications: 15,
                activePrograms: 8,
                documentsToReview: 12,
                totalInternsChange: 12, // +12%
                pendingChange: -5, // -5%
                recruitmentStats: {
                    applied: 45,
                    interviewing: 12,
                    offerSent: 8,
                    onboarded: 5
                },
                upcomingBirthdays: [
                    { name: "Nguyễn Văn A", date: "15/03", position: "Java Intern" },
                    { name: "Trần Thị B", date: "22/03", position: "Frontend Intern" }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const chartData = useMemo(() => {
        if (!stats?.recruitmentStats) return [];
        return [
            { name: "Ứng tuyển", value: stats.recruitmentStats.applied, color: "#3b82f6" },
            { name: "Phỏng vấn", value: stats.recruitmentStats.interviewing, color: "#a855f7" },
            { name: "Gửi Offer", value: stats.recruitmentStats.offerSent, color: "#f97316" },
            { name: "Tiếp nhận", value: stats.recruitmentStats.onboarded, color: "#10b981" },
        ];
    }, [stats]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Dashboard HR</h1>
                <p className="text-muted-foreground mt-1">Quản lý tuyển dụng và hành trình thực tập sinh.</p>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Tổng thực tập sinh", value: stats?.totalInterns, change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Hồ sơ chờ duyệt", value: stats?.pendingApplications, change: "-5%", icon: FilePlus, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Chương trình", value: stats?.activePrograms, change: "+2", icon: FolderKanban, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Cần xét duyệt", value: stats?.documentsToReview, change: "Tăng", icon: ClipboardCheck, color: "text-rose-600", bg: "bg-rose-50" },
                ].map((kpi, i) => (
                    <Card key={i} className="border-none shadow-lg shadow-slate-200/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-2 rounded-xl", kpi.bg)}>
                                    <kpi.icon className={cn("h-6 w-6", kpi.color)} />
                                </div>
                                <Badge variant="secondary" className="bg-slate-50 text-[10px] font-bold">
                                    {kpi.change.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 mr-1 text-rose-500" />}
                                    {kpi.change}
                                </Badge>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-black">{kpi.value}</h3>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recruitment Analytics */}
                <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Quy trình tuyển dụng</CardTitle>
                            <CardDescription>Thống kê số lượng theo từng giai đoạn</CardDescription>
                        </div>
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <RechartsTooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 grid grid-cols-4 gap-4">
                            {chartData.map((item, i) => (
                                <div key={i} className="text-center">
                                    <span className="block text-xl font-bold">{item.value}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Birthdays & Events */}
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-b from-white to-pink-50/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Cake className="h-5 w-5 text-pink-500" />
                            Sự kiện sắp tới
                        </CardTitle>
                        <CardDescription>Sinh nhật & Kỷ niệm trong tháng</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            {stats?.upcomingBirthdays && stats.upcomingBirthdays.length > 0 ? (
                                stats.upcomingBirthdays.map((person, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                                            <AvatarFallback className="bg-pink-100 text-pink-600 font-bold text-xs uppercase">
                                                {person.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-bold truncate text-slate-900">{person.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{person.position}</p>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] border-pink-200 text-pink-600 bg-white">
                                            {person.date}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 opacity-40">
                                    <p className="text-xs font-medium">Không có sự kiện nào</p>
                                </div>
                            )}
                        </div>
                        <Separator />
                        <Card className="bg-pink-50 border-none">
                            <CardContent className="p-4 flex gap-3 text-xs text-pink-700 leading-relaxed italic">
                                <span>💡</span>
                                <p>Đừng quên gửi lời chúc mừng đến các thành viên trong ngày đặc biệt!</p>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const cn = (...inputs) => inputs.filter(Boolean).join(" ");
