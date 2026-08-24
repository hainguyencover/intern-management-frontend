import React, { useEffect, useState } from "react";
import analyticsApi from "@/api/analyticsApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
    BarChart3,
    TrendingUp,
    Users,
    UserCheck,
    CheckCircle2,
    Calendar,
    Filter,
    RotateCcw,
    GraduationCap,
    BookOpen,
    PieChart,
    ArrowUpRight,
    Search,
    Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function InternAnalytics() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Filters state
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        university: "",
        major: ""
    });

    // Applied filter state for API requests
    const [appliedFilters, setAppliedFilters] = useState({});

    // Analytics data state
    const [overview, setOverview] = useState(null);
    const [schoolStats, setSchoolStats] = useState([]);
    const [majorStats, setMajorStats] = useState([]);
    const [completionStats, setCompletionStats] = useState(null);

    const fetchAllAnalytics = async (params) => {
        try {
            setLoading(true);
            const [overviewRes, schoolRes, majorRes, completionRes] = await Promise.all([
                analyticsApi.getOverview(params),
                analyticsApi.getBySchool(params),
                analyticsApi.getByMajor(params),
                analyticsApi.getCompletion(params)
            ]);

            setOverview(overviewRes.data?.data || overviewRes.data);
            setSchoolStats(schoolRes.data?.data || schoolRes.data || []);
            setMajorStats(majorRes.data?.data || majorRes.data || []);
            setCompletionStats(completionRes.data?.data || completionRes.data);
        } catch (err) {
            console.error("Failed to fetch analytics", err);
            toast.error("Không thể tải dữ liệu thống kê báo cáo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAnalytics(appliedFilters);
    }, [appliedFilters]);

    const handleApplyFilters = () => {
        if (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate) {
            toast.error("Từ ngày phải nhỏ hơn hoặc bằng Đến ngày");
            return;
        }
        setAppliedFilters({ ...filters });
    };

    const handleResetFilters = () => {
        const reset = { fromDate: "", toDate: "", university: "", major: "" };
        setFilters(reset);
        setAppliedFilters(reset);
    };

    const handleDrillDownSchool = (schoolName) => {
        navigate(`/hr/interns?university=${encodeURIComponent(schoolName)}`);
    };

    const handleDrillDownMajor = (majorName) => {
        navigate(`/hr/interns?major=${encodeURIComponent(majorName)}`);
    };

    if (loading && !overview) {
        return (
            <div className="p-12 space-y-6">
                <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-slate-100 animate-pulse rounded-3xl" />
                    <div className="h-80 bg-slate-100 animate-pulse rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-32 space-y-8 animate-in fade-in duration-700">
            {/* Top Bar Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-primary" /> Báo Cáo & Thống Kê HR
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                        Phân tích nguồn ứng viên (US-032) và đo lường tỷ lệ hoàn thành chương trình (US-033).
                    </p>
                </div>
                <Badge variant="outline" className="px-4 py-2 border-slate-200 bg-white font-bold text-xs text-slate-600 rounded-xl shadow-sm">
                    <Globe className="h-4 w-4 mr-2 text-primary" /> Live Multi-Tenant Analytics
                </Badge>
            </div>

            {/* Filter Section */}
            <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Từ ngày (From Date)
                            </label>
                            <input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Đến ngày (To Date)
                            </label>
                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Trường (University)
                            </label>
                            <input
                                type="text"
                                placeholder="Lọc theo tên trường..."
                                value={filters.university}
                                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                                Ngành (Major)
                            </label>
                            <input
                                type="text"
                                placeholder="Lọc theo chuyên ngành..."
                                value={filters.major}
                                onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                        <Button
                            variant="outline"
                            onClick={handleResetFilters}
                            className="h-10 px-4 rounded-xl text-slate-600 font-bold text-xs"
                        >
                            <RotateCcw className="mr-2 h-3.5 w-3.5" /> Đặt lại (Reset)
                        </Button>
                        <Button
                            onClick={handleApplyFilters}
                            className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
                        >
                            <Filter className="mr-2 h-3.5 w-3.5" /> Áp dụng bộ lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="border-slate-200 shadow-sm bg-white rounded-2xl hover:border-slate-300 transition-all">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng thực tập sinh</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">{overview?.totalInterns ?? 0}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm bg-white rounded-2xl hover:border-slate-300 transition-all">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">TTS Tham Gia Kỳ</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">{overview?.participatingInterns ?? 0}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <UserCheck className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm bg-white rounded-2xl hover:border-slate-300 transition-all">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã Hoàn Thành</p>
                            <p className="text-3xl font-black text-emerald-600 mt-1">{overview?.completedInterns ?? 0}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm bg-white rounded-2xl hover:border-slate-300 transition-all">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tỷ lệ hoàn thành (US-033)</p>
                            <p className="text-3xl font-black text-purple-600 mt-1">{overview?.completionRate ?? 0}%</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* US-032: Analytics Charts & Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* School / University Statistics */}
                <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" /> Thống kê theo Trường (US-032)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                            Phân tích nguồn ứng viên thực tập theo trường đào tạo. Click vào trường để xem danh sách.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-4 space-y-4">
                        {schoolStats.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 font-medium text-sm">
                                Không có dữ liệu trong khoảng thời gian đã chọn.
                            </div>
                        ) : (
                            schoolStats.map((school, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleDrillDownSchool(school.schoolName)}
                                    className="p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group space-y-2 border border-transparent hover:border-slate-200"
                                >
                                    <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                                        <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                                            {school.schoolName}
                                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </span>
                                        <span className="text-slate-600">{school.count} TTS ({school.percentage}%)</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${Math.max(school.percentage, 2)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Major Statistics */}
                <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-600" /> Thống kê theo Ngành (US-032)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                            Phân tích nguồn ứng viên theo chuyên ngành đào tạo. Click vào ngành để xem danh sách.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-4 space-y-4">
                        {majorStats.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 font-medium text-sm">
                                Không có dữ liệu trong khoảng thời gian đã chọn.
                            </div>
                        ) : (
                            majorStats.map((major, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleDrillDownMajor(major.majorName)}
                                    className="p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group space-y-2 border border-transparent hover:border-slate-200"
                                >
                                    <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                                        <span className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                                            {major.majorName}
                                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </span>
                                        <span className="text-slate-600">{major.count} TTS ({major.percentage}%)</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.max(major.percentage, 2)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* US-033: Completion Rate Detail */}
            <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
                <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-purple-600" /> Tỷ Lệ Hoàn Thành Chương Trình Thực Tập (US-033)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                        Đánh giá chất lượng thực tập dựa trên tỷ lệ thực tập sinh hoàn thành chương trình.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mẫu số (Participating)</p>
                            <p className="text-3xl font-black text-slate-900">{completionStats?.totalParticipating ?? 0}</p>
                            <p className="text-xs text-slate-500">Gồm TTS đang thực tập + đã hoàn thành</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center space-y-2">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Đã hoàn thành</p>
                            <p className="text-3xl font-black text-emerald-700">{completionStats?.completed ?? 0}</p>
                            <p className="text-xs text-emerald-600 font-medium">Hồ sơ đã đạt tiêu chí tốt nghiệp kỳ</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-100 text-center space-y-2">
                            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Completion Rate</p>
                            <p className="text-4xl font-black text-purple-700">{completionStats?.completionRate ?? 0}%</p>
                            <p className="text-xs text-purple-600 font-medium">Công thức: Completed / Participating × 100</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
