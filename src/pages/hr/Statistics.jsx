import React, { useEffect, useState } from "react";
import { internApi } from "../../api/internApi";
import { toast } from "sonner";
import {
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    Activity,
    Award,
    GraduationCap,
    Briefcase,
    Target,
    TrendingUp,
    Users,
    Zap,
    Search,
    Filter,
    ArrowUpRight,
    Info,
    Calendar,
    LayoutDashboard,
    LucidePieChart
} from "lucide-react";
import { reportApi } from "../../api/reportApi";
import { dashboardApi } from "../../api/dashboardApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../components/ui/table";

export default function Statistics() {
    const [statsUni, setStatsUni] = useState([]);
    const [statsMajor, setStatsMajor] = useState([]);
    const [statsAssess, setStatsAssess] = useState([]);
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resUni, resMajor, resAssess, resOverview] = await Promise.all([
                    internApi.getStatsUniversity(),
                    internApi.getStatsMajor(),
                    reportApi.getStatsAssessment(),
                    dashboardApi.getOverview(),
                ]);
                setStatsUni(resUni.data);
                setStatsMajor(resMajor.data);
                setStatsAssess(resAssess.data);
                setOverview(resOverview.data);
            } catch (err) {
                toast.error("Không thể tải báo cáo thống kê");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getAssessColor = (key) => {
        if (["Xuất sắc", "Giỏi"].includes(key)) return "bg-emerald-50 text-emerald-600 border-none shadow-none";
        if (key === "Khá") return "bg-blue-50 text-blue-600 border-none shadow-none";
        if (key === "Trung bình") return "bg-amber-50 text-amber-600 border-none shadow-none";
        if (key === "Yếu") return "bg-rose-50 text-rose-600 border-none shadow-none";
        return "bg-slate-50 text-slate-500 border-none shadow-none";
    };

    if (loading) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-10 w-64 bg-slate-100 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-50 rounded-3xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-96 bg-slate-50 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Intelligence Hub
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            ANALYTICS
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 opacity-50" /> Phân tích dữ liệu thực tập và đánh giá hiệu quả chương trình toàn diện.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-12 px-6 rounded-2xl bg-slate-50 flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest border border-slate-100 shadow-sm">
                        <Calendar className="h-4 w-4" /> Real-time Baseline
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white rounded-3xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Zap className="h-20 w-20 text-primary" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Target className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion Index</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                    {overview?.completionRate ? overview.completionRate.toFixed(1) : 0}%
                                </span>
                                <Badge variant="outline" className="h-5 border-emerald-100 bg-emerald-50 text-emerald-600 text-[9px] font-black italic">OPTIMIZED</Badge>
                            </div>
                            <Progress value={overview?.completionRate || 0} className="h-1.5 bg-slate-50" />
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white rounded-3xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Users className="h-20 w-20 text-indigo-500" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Users className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Internship Pool</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                    {overview?.totalInterns || 0}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300 italic uppercase tracking-widest">Profiles</span>
                            </div>
                            <Progress value={100} className="h-1.5 bg-indigo-50" />
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white rounded-3xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Award className="h-20 w-20 text-amber-500" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                            <Award className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Mentorships</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                    {overview?.totalMentors || 0}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300 italic uppercase tracking-widest">Experts</span>
                            </div>
                            <Progress value={75} className="h-1.5 bg-amber-50" />
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl shadow-slate-200/40 bg-slate-900 rounded-3xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <TrendingUp className="h-20 w-20 text-white" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Growth Rate</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-white tracking-tighter">
                                    +12.4%
                                </span>
                                <Badge variant="outline" className="h-5 border-white/20 bg-white/10 text-white text-[9px] font-black italic">QUARTERLY</Badge>
                            </div>
                            <Progress value={45} className="h-1.5 bg-white/10" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Granular Charts/Tables Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* University Stat */}
                <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white group">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">Academic Source</h2>
                                <p className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none mt-0.5">Theo Trường Đại Học</p>
                            </div>
                        </div>
                        <BarChartIcon className="h-4 w-4 text-slate-200 group-hover:text-blue-200 transition-colors" />
                    </div>
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3 pl-6 italic">Institution</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase text-slate-400 py-3 pr-6 italic">Pool Size</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statsUni.map((item, idx) => (
                                <TableRow key={idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                    <TableCell className="py-4 pl-6 text-[13px] font-bold text-slate-700 italic">{item.key}</TableCell>
                                    <TableCell className="py-4 pr-6 text-right">
                                        <Badge className="bg-blue-50 text-blue-600 border-none shadow-none font-black text-[10px] px-3">
                                            {item.count}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {statsUni.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-12 text-center text-slate-300 text-xs italic">Chưa có dữ liệu thống kê trường</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Major Stat */}
                <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white group">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">Professional Field</h2>
                                <p className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none mt-0.5">Theo Chuyên Ngành</p>
                            </div>
                        </div>
                        <PieChartIcon className="h-4 w-4 text-slate-200 group-hover:text-emerald-200 transition-colors" />
                    </div>
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3 pl-6 italic">Specialize</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase text-slate-400 py-3 pr-6 italic">Market Share</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statsMajor.map((item, idx) => (
                                <TableRow key={idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                    <TableCell className="py-4 pl-6 text-[13px] font-bold text-slate-700 italic">{item.key}</TableCell>
                                    <TableCell className="py-4 pr-6 text-right">
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-black text-[10px] px-3">
                                            {item.count}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {statsMajor.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-12 text-center text-slate-300 text-xs italic">Chưa có dữ liệu thống kê chuyên ngành</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Assessment Stat */}
                <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white group hover:shadow-primary/5 transition-all">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">Performance Tiers</h2>
                                <p className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none mt-0.5">Đánh giá thực tập</p>
                            </div>
                        </div>
                        <LucidePieChart className="h-4 w-4 text-slate-200 group-hover:text-purple-200 transition-colors" />
                    </div>
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 py-3 pl-6 italic">Grade</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase text-slate-400 py-3 pr-6 italic">Headcount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statsAssess.map((item, idx) => (
                                <TableRow key={idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                    <TableCell className="py-4 pl-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${["Xuất sắc", "Giỏi"].includes(item.key) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            <span className="text-[13px] font-black text-slate-900 italic tracking-tight uppercase">{item.key}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 pr-6 text-right">
                                        <Badge className={`font-black text-[10px] px-3 py-1 uppercase tracking-widest ${getAssessColor(item.key)}`}>
                                            {item.count}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {statsAssess.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="py-12 text-center text-slate-300 text-xs italic">Chưa có dữ liệu đánh giá KPI</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
