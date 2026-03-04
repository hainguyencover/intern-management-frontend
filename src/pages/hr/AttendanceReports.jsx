import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { attendanceApi } from "../../api/attendanceApi";
import {
    Clock,
    FileDown,
    Search,
    Filter,
    UserCheck,
    Timer,
    CalendarDays,
    ArrowUpRight,
    User,
    Mail,
    ChevronLeft,
    ChevronRight,
    MapPin,
    AlertCircle,
    Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";

export default function AttendanceReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        date: new Date().toISOString().slice(0, 10),
        status: "ALL",
    });

    useEffect(() => {
        loadData();
    }, [filters.date, filters.status]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                fromDate: filters.date,
                toDate: filters.date,
                status: filters.status === "ALL" ? "" : filters.status,
                page: 0,
                size: 100
            };
            const res = await attendanceApi.getAllAttendance(params);
            setReports(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được báo cáo chuyên cần");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Attendance Hub
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            ANALYTICS
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 opacity-50" /> Theo dõi và phân tích nhật ký chuyên cần của thực tập sinh.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-black text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                        <FileDown className="mr-2 h-4 w-4" /> Export Ledger
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-1 space-y-2.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Chu kỳ báo cáo (Ngày)</label>
                            <div className="relative group">
                                <CalendarDays className="absolute left-4 top-3.5 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                    className="h-12 pl-11 rounded-2xl border-none bg-slate-50 focus-visible:ring-primary/10 font-black text-slate-600 px-5 text-lg"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-[280px] space-y-2.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Lọc theo trạng thái</label>
                            <Select
                                value={filters.status}
                                onValueChange={(val) => setFilters({ ...filters, status: val })}
                            >
                                <SelectTrigger className="h-12 rounded-2xl border-none bg-slate-50 font-black text-[11px] uppercase tracking-widest text-slate-500 px-5">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-3.5 w-3.5" />
                                        <SelectValue placeholder="Trạng thái" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
                                    <SelectItem value="ALL" className="rounded-xl py-2.5 font-bold focus:bg-primary/5 focus:text-primary transition-all">Tất cả ghi nhận</SelectItem>
                                    <SelectItem value="PRESENT" className="rounded-xl py-2.5 font-bold text-emerald-600 focus:bg-emerald-50 transition-all italic">Đúng giờ (On-time)</SelectItem>
                                    <SelectItem value="LATE" className="rounded-xl py-2.5 font-bold text-amber-600 focus:bg-amber-50 transition-all italic">Đi muộn (Late)</SelectItem>
                                    <SelectItem value="ABSENT" className="rounded-xl py-2.5 font-bold text-rose-600 focus:bg-rose-50 transition-all italic">Vắng mặt (Absent)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={loadData}
                            className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-black font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 transition-all active:scale-95"
                        >
                            Sync Logs
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* List Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pl-8">Thực tập sinh / Liên hệ</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Check In</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Check Out</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Chỉ số Attendance</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="pl-8"><div className="h-10 w-56 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-6 w-16 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-6 w-16 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-8 w-24 bg-slate-50 animate-pulse rounded-full" /></TableCell>
                                    <TableCell className="pr-8 text-right"><div className="h-9 w-24 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-60 text-center bg-slate-50/30">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                                            <Timer className="h-10 w-10 text-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Zero Logs Found</p>
                                            <p className="text-slate-300 font-medium italic text-sm">Không có dữ liệu chuyên cần ghi nhận cho ngày đã chọn.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((row) => (
                                <TableRow key={row.id} className="group hover:bg-slate-50/80 border-slate-50 transition-colors">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-slate-900 tracking-tight italic group-hover:text-primary transition-colors">
                                                    {row.internName}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 lowercase">
                                                    <Mail className="h-3 w-3 opacity-50" /> {row.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 font-bold font-mono text-emerald-600 text-base">
                                        {row.checkIn || "--:--"}
                                    </TableCell>
                                    <TableCell className="py-5 font-bold font-mono text-amber-600 text-base">
                                        {row.checkOut || "--:--"}
                                    </TableCell>
                                    <TableCell className="py-5">
                                        {row.status === "PRESENT" ? (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-black text-[9px] uppercase tracking-widest py-1 h-6">
                                                <UserCheck className="h-3 w-3 mr-1.5" /> ON-TIME
                                            </Badge>
                                        ) : row.status === "LATE" ? (
                                            <Badge className="bg-amber-50 text-amber-600 border-none shadow-none font-black text-[9px] uppercase tracking-widest py-1 h-6">
                                                <AlertCircle className="h-3 w-3 mr-1.5" /> LATE
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-rose-50 text-rose-600 border-none shadow-none font-black text-[9px] uppercase tracking-widest py-1 h-6">
                                                <MapPin className="h-3 w-3 mr-1.5" /> ABSENT
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-primary hover:bg-white hover:shadow-lg transition-all group/btn">
                                            <Info className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
