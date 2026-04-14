import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Filter,
    GraduationCap,
    BookOpen,
    Users,
    Target,
    Zap,
    ArrowUpRight,
    SearchCheck,
    Calendar,
    LayoutPanelTop,
    Info,
    History,
    ShieldCheck,
    Mail,
    Phone,
    UserCheck,
    Award
} from "lucide-react";
import { internApi } from "@/features/intern/api/internApi";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const cn = (...inputs) => inputs.filter(Boolean).join(" ");

export default function InternList() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        university: "",
        major: "",
        status: "",
        q: "",
        page: 0,
        size: 10,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await internApi.search(filters);
            setData(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách thực tập sinh");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.page]);

    const handleSearch = () => {
        setFilters({ ...filters, page: 0 });
        fetchData();
    };

    const totalPages = data?.totalPages || 0;

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Talent Reservoir
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            GOVERNANCE
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <Users className="h-4 w-4 opacity-50" /> Quản lý và theo dõi hồ sơ thực tập sinh toàn hệ thống.
                    </p>
                </div>
                <Button asChild className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-black font-black text-[11px] uppercase tracking-[0.1em] text-white shadow-2xl shadow-slate-200 transition-all active:scale-95">
                    <Link to="/hr/interns/new">
                        <Plus className="mr-2 h-4 w-4" /> Onboard Intern
                    </Link>
                </Button>
            </div>

            {/* Premium Filters Section */}
            <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden p-2">
                <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-3 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Tên, email hoặc định danh..."
                            className="pl-12 h-12 rounded-2xl border-slate-100 bg-slate-50 shadow-none font-bold text-sm italic focus-visible:ring-primary/10 transition-all"
                            value={filters.q}
                            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                    </div>
                    <div className="relative flex-1 group">
                        <GraduationCap className="absolute left-4 top-3 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Cơ sở đào tạo..."
                            className="pl-12 h-12 rounded-2xl border-slate-100 bg-slate-50 shadow-none font-bold text-sm italic focus-visible:ring-primary/10 transition-all"
                            value={filters.university}
                            onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                        />
                    </div>
                    <div className="relative flex-1 group">
                        <BookOpen className="absolute left-4 top-3 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Chuyên ngành kỹ thuật..."
                            className="pl-12 h-12 rounded-2xl border-slate-100 bg-slate-50 shadow-none font-bold text-sm italic focus-visible:ring-primary/10 transition-all"
                            value={filters.major}
                            onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleSearch} className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all active:scale-95">
                        <Filter className="mr-2 h-4 w-4" /> Explore
                    </Button>
                </CardContent>
            </Card>

            {/* Main Content Table Section */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-[320px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 pl-8 italic">Intern Profile</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 italic">Education & Field</TableHead>
                            <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 italic">GPA Score</TableHead>
                            <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 italic">Current Status</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-6 pr-8 italic">Governance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="pl-8"><div className="h-12 w-64 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-10 w-48 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-6 w-16 mx-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-8 w-24 mx-auto bg-slate-50 animate-pulse rounded-full" /></TableCell>
                                    <TableCell className="pr-8 text-right"><div className="h-8 w-8 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.content?.length > 0 ? (
                            data.content.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-slate-50/80 border-slate-50 transition-colors">
                                    <TableCell className="py-6 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all overflow-hidden relative">
                                                <Users className="h-6 w-6" />
                                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-all" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-slate-900 tracking-tight italic group-hover:text-primary transition-colors">
                                                    {item.fullName}
                                                </span>
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 italic">
                                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex flex-col space-y-1">
                                            <span className="text-[13px] font-black text-slate-700 italic tracking-tight">{item.university || "-"}</span>
                                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">{item.major || "-"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center py-6">
                                        <div className="inline-flex items-center justify-center h-8 px-4 rounded-xl bg-slate-50 border border-slate-100 font-black text-sm text-slate-600 shadow-sm">
                                            <Target className="h-3 w-3 mr-2 opacity-50" />
                                            {item.gpa || "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center py-6">
                                        <Badge className={cn(
                                            "h-7 px-4 rounded-full font-black text-[10px] uppercase tracking-widest border-none shadow-none",
                                            item.status === 'ACTIVE'
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-500"
                                        )}>
                                            {item.status === 'ACTIVE' ? <UserCheck className="h-3 w-3 mr-1.5" /> : <Clock className="h-3 w-3 mr-1.5" />}
                                            {item.status || "WAITING"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right py-6 pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200 transition-all">
                                                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[180px] rounded-2xl border-slate-100 shadow-2xl p-2">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-3 py-2 italic tracking-widest">Management Options</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                <DropdownMenuItem asChild className="rounded-xl h-10 cursor-pointer">
                                                    <Link to={`/hr/interns/${item.id}`} className="flex items-center font-bold italic text-slate-600 hover:text-primary">
                                                        <Eye className="mr-3 h-4 w-4" /> View Console
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="rounded-xl h-10 cursor-pointer">
                                                    <Link to={`/hr/interns/${item.id}/edit`} className="flex items-center font-bold italic text-slate-600 hover:text-indigo-600">
                                                        <Edit className="mr-3 h-4 w-4" /> Edit Profile
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                <DropdownMenuItem className="rounded-xl h-10 cursor-pointer text-rose-500 font-bold italic focus:bg-rose-50 focus:text-rose-600">
                                                    <ShieldCheck className="mr-3 h-4 w-4" /> Archive Intern
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-80 text-center bg-slate-50/20">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-24 w-24 rounded-full bg-white shadow-xl flex items-center justify-center">
                                            <SearchCheck className="h-12 w-12 text-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">No Interns Discovered</h3>
                                            <p className="text-slate-400 font-medium italic text-sm">Vui lòng điều chỉnh bộ lọc hoặc onboard thực tập sinh mới.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {data?.totalPages > 1 && (
                    <div className="p-8 border-t border-slate-50 bg-slate-50/30">
                        <Pagination>
                            <PaginationContent className="gap-2">
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setFilters(f => ({ ...f, page: Math.max(0, f.page - 1) }))}
                                        className={cn(
                                            "h-10 px-4 rounded-xl border-none bg-white shadow-sm font-black text-[10px] uppercase tracking-widest",
                                            filters.page === 0 && "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>

                                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={filters.page === i}
                                            onClick={() => setFilters(f => ({ ...f, page: i }))}
                                            className={cn(
                                                "h-10 w-10 p-0 rounded-xl border-none font-black transition-all",
                                                filters.page === i ? "bg-slate-900 text-white shadow-xl scale-110" : "bg-white text-slate-400 shadow-sm hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                {totalPages > 5 && (
                                    <PaginationItem>
                                        <span className="text-slate-300 font-bold px-2">...</span>
                                    </PaginationItem>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages - 1, f.page + 1) }))}
                                        className={cn(
                                            "h-10 px-4 rounded-xl border-none bg-white shadow-sm font-black text-[10px] uppercase tracking-widest",
                                            filters.page === totalPages - 1 && "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </Card>
        </div>
    );
}
