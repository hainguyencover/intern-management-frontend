import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { hrListApplications } from "@/api/hrApplications";
import {
    Search,
    Inbox,
    Mail,
    User,
    Calendar,
    ExternalLink,
    Filter,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    UserCheck,
    Briefcase,
    Hash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = [
    { value: "SUBMITTED", label: "Submitted", color: "text-blue-600 bg-blue-50" },
    { value: "APPROVED", label: "Approved", color: "text-emerald-600 bg-emerald-50" },
    { value: "REJECTED", label: "Rejected", color: "text-rose-600 bg-rose-50" },
    { value: "DRAFT", label: "Draft", color: "text-slate-400 bg-slate-50" }
];

export default function ApplicationListPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: "SUBMITTED",
        q: "",
        page: 0,
        size: 10,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await hrListApplications(filters);
            setData(data);
        } catch (err) {
            toast.error("Không thể tải danh sách hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.page, filters.status]);

    const handleSearch = () => {
        setFilters({ ...filters, page: 0 });
        fetchData();
    };

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Applications Console
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            RECRUITMENT
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <Inbox className="h-4 w-4 opacity-50" /> Quản lý và phê duyệt hồ sơ ứng tuyển của các thực tập sinh tiềm năng.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Card className="h-12 px-5 flex items-center gap-3 rounded-2xl border-none shadow-xl shadow-slate-200/40 bg-white">
                        <UserCheck className="h-4 w-4 text-primary opacity-50" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active:</span>
                        <span className="font-black text-slate-900 border-l pl-3 h-4 flex items-center">{data?.totalElements || 0}</span>
                    </Card>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative group">
                            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Tìm theo tên ứng viên, email hoặc vị trí ứng tuyển..."
                                value={filters.q}
                                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="h-11 pl-11 rounded-2xl border-none bg-slate-50 focus-visible:ring-primary/10 font-bold text-slate-600 placeholder:text-slate-300 placeholder:italic"
                            />
                        </div>
                        <div className="w-full md:w-[240px]">
                            <Select
                                value={filters.status}
                                onValueChange={(val) => setFilters({ ...filters, status: val, page: 0 })}
                            >
                                <SelectTrigger className="h-11 rounded-2xl border-none bg-slate-50 font-black text-[11px] uppercase tracking-widest text-slate-500 px-5">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-3.5 w-3.5" />
                                        <SelectValue placeholder="Trạng thái" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
                                    {STATUS_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value} className="rounded-xl py-2.5 font-bold focus:bg-primary/5 focus:text-primary transition-all">
                                            <span className={opt.color + " h-2 w-2 rounded-full inline-block mr-2"} />
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="h-11 px-8 rounded-2xl bg-slate-900 hover:bg-black font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 transition-all active:scale-95"
                        >
                            Refresh Pipeline
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Content Area - Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pl-8">Ref ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Chủ hồ sơ / Thông tin liên hệ</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Vị trí ứng tuyển</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Thời điểm nộp</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Status Badge</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pr-8">Management</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="pl-8"><div className="h-6 w-12 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-10 w-48 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-6 w-32 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-6 w-24 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-7 w-20 bg-slate-50 animate-pulse rounded-full" /></TableCell>
                                    <TableCell className="pr-8 text-right"><div className="h-9 w-24 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.content?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-60 text-center bg-slate-50/30">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                                            <Inbox className="h-10 w-10 text-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Empty Repository</p>
                                            <p className="text-slate-300 font-medium italic text-sm">Không tìm thấy hồ sơ nào trong pipeline hiện tại.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.content?.map((app) => (
                                <TableRow key={app.id} className="group hover:bg-slate-50/80 border-slate-50 transition-colors">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-3 w-3 text-slate-300" />
                                            <span className="text-[11px] font-black text-slate-400 tracking-tighter">
                                                {app.id}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{app.candidateName || "Anonymous Candidate"}</span>
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 italic">
                                                    <Mail className="h-3 w-3 opacity-50" /> {app.candidateEmail || "no-contact@mail.com"}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 group-hover:bg-white group-hover:shadow-md transition-all">
                                                <Briefcase className="h-3.5 w-3.5 text-slate-300" />
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">{app.position || "Staff"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Submitted</span>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
                                                <Calendar className="h-3.5 w-3.5 text-primary opacity-50" />
                                                {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }) : "-"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <StatusBadge status={app.status} />
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right">
                                        <Button asChild variant="ghost" className="h-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-primary hover:bg-primary/5 hover:shadow-lg transition-all group/btn bg-white border border-slate-50">
                                            <Link to={`/hr/applications/${app.id}`}>
                                                Chi Tiết Hồ Sơ
                                                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination UI */}
            {data?.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4 px-6 pb-20">
                    <Button
                        variant="ghost"
                        onClick={() => setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                        disabled={filters.page === 0}
                        className="h-12 px-6 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border-none font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-primary transition-all active:scale-95 disabled:opacity-30"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Earlier Batch
                    </Button>

                    <div className="h-12 px-8 rounded-2xl bg-slate-900 flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Page</span>
                        <span className="text-sm font-black text-white">{filters.page + 1}</span>
                        <span className="text-slate-700 font-bold">/</span>
                        <span className="text-sm font-black text-slate-400">{data.totalPages}</span>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setFilters(prev => ({
                            ...prev,
                            page: Math.min(data.totalPages - 1, prev.page + 1)
                        }))}
                        disabled={filters.page >= data.totalPages - 1}
                        className="h-12 px-6 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border-none font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-primary transition-all active:scale-95 disabled:opacity-30"
                    >
                        Later Pipeline <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
