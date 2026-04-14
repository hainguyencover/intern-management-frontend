import React, { useEffect, useState, useMemo } from "react";
import {
    Users,
    ShieldCheck,
    Activity,
    Database,
    AlertTriangle,
    CheckCircle2,
    BarChart3,
    Cloud,
    Zap,
    ArrowUpRight,
    Search
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { dashboardApi } from "@/api/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await dashboardApi.getOverview();
            setStats(res.data);
        } catch (error) {
            console.error("Error loading stats:", error);
            // Enhanced Mock for Admin
            setStats({
                totalMentors: 24,
                totalInterns: 156,
                activePrograms: 12,
                totalPrograms: 15,
                completionRate: 68,
                systemHealth: 'GOOD',
                storageUsage: '1.2 GB',
                totalTasks: 450,
                completedTasks: 310,
                recruitmentStats: { applied: 120, interviewing: 45, offerSent: 15, onboarded: 10 },
                systemAlerts: [
                    { type: 'warning', message: 'Dung lượng database sắp đầy (85%)' },
                    { type: 'info', message: 'Cập nhật hệ thống vào 2:00 AM Chủ Nhật' }
                ],
                recentActivities: [
                    { content: "Admin tạo chương trình mới: Spring Boot 2024", timeAgo: "10 phút trước", color: "blue" },
                    { content: "Hệ thống tự động sao lưu định kỳ thành công", timeAgo: "1 giờ trước", color: "green" }
                ],
                activityData: [
                    { name: "T2", value: 40 }, { name: "T3", value: 30 }, { name: "T4", value: 65 },
                    { name: "T5", value: 45 }, { name: "T6", value: 90 }, { name: "T7", value: 70 }, { name: "CN", value: 85 }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    const healthData = useMemo(() => [
        { name: "Healthy", value: stats?.systemHealth === 'GOOD' ? 100 : 70, color: "#10b981" },
        { name: "Down", value: stats?.systemHealth === 'GOOD' ? 0 : 30, color: "#f1f5f9" }
    ], [stats]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Hệ thống Quản trị</h1>
                    <p className="text-muted-foreground mt-1">Giám sát toàn diện và điều phối tài nguyên.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <Activity className="mr-2 h-4 w-4" />
                        Status Terminal
                    </Button>
                    <Button size="sm" className="h-9 shadow-lg shadow-primary/20">
                        <Zap className="mr-2 h-4 w-4" />
                        Tối ưu hệ thống
                    </Button>
                </div>
            </div>

            {/* Admin KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Người hướng dẫn", value: stats?.totalMentors, icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Thực tập sinh", value: stats?.totalInterns, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Chương trình", value: `${stats?.activePrograms}/${stats?.totalPrograms}`, icon: Database, color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Tiến độ toàn khóa", value: `${Math.round(stats?.completionRate)}%`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((kpi, i) => (
                    <Card key={i} className="border-none shadow-lg shadow-slate-200/50 hover:scale-[1.02] transition-transform">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-2xl", kpi.bg)}>
                                    <kpi.icon className={cn("h-6 w-6", kpi.color)} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{kpi.label}</p>
                                    <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Activity Chart */}
                <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Hoạt động hệ thống</CardTitle>
                            <CardDescription>Tương tác người dùng 7 ngày qua</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon"><ArrowUpRight className="h-4 w-4" /></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.activityData || []}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* System Health Gauge */}
                <Card className="border-none shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center p-6 text-center">
                    <CardHeader className="w-full text-left p-0 mb-6">
                        <CardTitle className="text-lg">Sức khỏe hệ thống</CardTitle>
                        <CardDescription>Trạng thái Core Services</CardDescription>
                    </CardHeader>
                    <div className="relative h-48 w-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={healthData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={180}
                                    endAngle={-180}
                                >
                                    {healthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-emerald-600">
                                {stats?.systemHealth === 'GOOD' ? '100%' : '85%'}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Stable</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2 w-full">
                        <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Database</span>
                            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Online</Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /> API Gateway</span>
                            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Online</Badge>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alerts Section */}
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg text-white flex items-center justify-between">
                            Cảnh báo hệ thống
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[200px] pr-4">
                            <div className="space-y-4">
                                {stats?.systemAlerts?.map((alert, i) => (
                                    <div key={i} className={cn(
                                        "p-4 rounded-2xl border flex gap-3 items-start backdrop-blur-md",
                                        alert.type === 'warning' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-200" : "bg-blue-500/10 border-blue-500/20 text-blue-200"
                                    )}>
                                        <div className={cn("p-1.5 rounded-lg", alert.type === 'warning' ? "bg-yellow-500 text-slate-900" : "bg-blue-500 text-white")}>
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold leading-none mb-1">{alert.message}</p>
                                            <span className="text-[10px] opacity-50">Vừa xong</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Storage & Resources */}
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Tài nguyên & Lưu trữ</CardTitle>
                        <CardDescription>Sử dụng hạ tầng hiện tại</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground font-medium">Cloud Storage</span>
                                <span className="font-bold">{stats?.storageUsage} / 5 GB</span>
                            </div>
                            <Progress value={25} className="h-2 bg-slate-100" />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-xs text-muted-foreground">
                            <span>Chi tiết dung lượng tệp tin chưa được đồng bộ</span>
                            <Cloud className="h-4 w-4 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Admin Activity */}
                <Card className="border-none shadow-xl shadow-slate-200/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Nhật ký quản trị</CardTitle>
                        <CardDescription>Các thay đổi cấu hình gần đây</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[200px]">
                            <div className="space-y-4">
                                {stats?.recentActivities?.map((act, i) => (
                                    <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
                                        <div className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", act.color === 'blue' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]')} />
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-slate-800 leading-tight">{act.content}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{act.timeAgo}</p>
                                        </div>
                                        {i < (stats.recentActivities.length - 1) && <div className="absolute left-[3px] top-4 h-full w-[2px] bg-slate-50" />}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const cn = (...inputs) => inputs.filter(Boolean).join(" ");
