import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { leaveApi } from "../../api/leaveApi";
import {
    Plane,
    ShieldCheck,
    History,
    Search,
    Filter,
    ArrowUpRight,
    FileText,
    MoreHorizontal,
    Info,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    Calendar,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";

export default function LeaveReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: "ALL",
    });

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                page: 0,
                size: 100
            };
            if (filters.status !== "ALL") params.status = filters.status;

            const res = await leaveApi.getAllRequests(params);
            setReports(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được báo cáo nghỉ phép");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "APPROVED":
                return <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] tracking-widest uppercase py-1 px-3 shadow-none"><CheckCircle2 className="h-3 w-3 mr-1.5" /> Approved</Badge>;
            case "PENDING":
                return <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[10px] tracking-widest uppercase py-1 px-3 shadow-none"><Clock className="h-3 w-3 mr-1.5" /> Pending</Badge>;
            case "REJECTED":
                return <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[10px] tracking-widest uppercase py-1 px-3 shadow-none"><XCircle className="h-3 w-3 mr-1.5" /> Rejected</Badge>;
            default:
                return <Badge variant="outline" className="text-[10px] uppercase font-black">{status}</Badge>;
        }
    };

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Absence Logs
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            HISTORY
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <History className="h-4 w-4 opacity-50" /> Lưu trữ và theo dõi toàn bộ lịch sử nghỉ phép của thực tập sinh.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Filter by Status</span>
                        <Select
                            value={filters.status}
                            onValueChange={(val) => setFilters({ ...filters, status: val })}
                        >
                            <SelectTrigger className="w-[180px] h-12 rounded-2xl border-slate-200 bg-white font-bold text-sm italic shadow-sm">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="ALL" className="font-bold italic">Tất cả trạng thái</SelectItem>
                                <SelectItem value="PENDING" className="font-bold italic text-amber-600">Chờ duyệt</SelectItem>
                                <SelectItem value="APPROVED" className="font-bold italic text-emerald-600">Đã duyệt</SelectItem>
                                <SelectItem value="REJECTED" className="font-bold italic text-rose-600">Từ chối</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Main Content Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white">
                <Table>
                    <TableHeader className="bg-slate-900 text-white">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-[280px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 pl-8">Thực tập sinh</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6">Phân loại & Lý do</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6">KHOẢNG THỜI GIAN</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 pr-8">Trạng thái quyết định</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="pl-8"><div className="h-10 w-48 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-12 w-64 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-6 w-32 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell className="pr-8 text-right"><div className="h-8 w-24 ml-auto bg-slate-50 animate-pulse rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-80 text-center bg-slate-50/20">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-24 w-24 rounded-full bg-white shadow-xl flex items-center justify-center transition-transform hover:scale-110">
                                            <FileText className="h-10 w-10 text-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">Null Dataset</h3>
                                            <p className="text-slate-400 font-medium italic text-sm">Không tìm thấy bản ghi nghỉ phép nào trong hệ thống.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((row) => (
                                <TableRow key={row.id} className="group hover:bg-slate-50/80 border-slate-50 transition-colors">
                                    <TableCell className="py-6 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <span className="text-base font-black text-slate-900 tracking-tight italic group-hover:text-primary transition-colors">
                                                {row.internName}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge className="w-fit bg-slate-50 text-slate-400 border-none shadow-none font-black text-[9px] uppercase tracking-widest py-1 h-6">
                                                    {row.leaveType}
                                                </Badge>
                                            </div>
                                            <p className="text-slate-500 text-[11px] font-bold italic leading-relaxed max-w-md line-clamp-2 group-hover:line-clamp-none transition-all">
                                                "{row.reason}"
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-2 text-slate-900 font-black text-sm tracking-tighter bg-white shadow-sm border border-slate-100 rounded-xl px-4 py-2 w-fit">
                                            <Calendar className="h-4 w-4 text-primary opacity-60" />
                                            {row.startDate} <span className="text-slate-300 mx-2 font-light">→</span> {row.endDate}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {getStatusBadge(row.status)}
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-slate-300 hover:text-primary hover:bg-primary/5 transition-all">
                                                <ArrowUpRight className="h-5 w-5" />
                                            </Button>
                                        </div>
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
