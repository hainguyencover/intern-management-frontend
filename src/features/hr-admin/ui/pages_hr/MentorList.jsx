import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { mentorApi } from "@/features/mentor/api/mentorApi";
import CreateMentor from "@/features/hr-admin/ui/pages_hr/CreateMentor";
import {
    Search,
    Plus,
    MoreHorizontal,
    Eye,
    UserCheck,
    Mail,
    Briefcase,
    GraduationCap,
    Users,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MentorList() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        role: "MENTOR",
        keyword: "",
        page: 0,
        size: 10,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await mentorApi.list(filters);
            setData(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách Mentor");
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
                        Mentor Management
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            HR GLOBAL
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1">Quản lý đội ngũ giảng viên hướng dẫn và phân bổ thực tập sinh.</p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" /> Khởi tạo Mentor
                </Button>
            </div>

            {/* Filter Hub */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Tìm kiếm Mentor theo tên, email, chức danh..."
                                className="h-11 pl-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 font-medium"
                                value={filters.keyword}
                                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold text-[12px] uppercase tracking-wider text-white"
                        >
                            <Search className="mr-2 h-4 w-4" /> Tìm kiếm
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Main Listing */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-16 font-black text-[10px] uppercase tracking-widest text-slate-400 pl-8">ID</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Giảng viên hướng dẫn</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Thông tin chuyên môn</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">Năng lực quản lý</TableHead>
                            <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="pl-8"><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-12 w-48 rounded-lg" /></TableCell>
                                    <TableCell><Skeleton className="h-12 w-64 rounded-lg" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-24 mx-auto rounded-full" /></TableCell>
                                    <TableCell className="pr-8"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.content?.length > 0 ? (
                            data.content.map((item) => (
                                <TableRow key={item.id} className="group transition-all hover:bg-slate-50/80 border-slate-100">
                                    <TableCell className="pl-8 font-black text-slate-300 text-xs">#{item.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <UserCheck className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors lowercase first-letter:uppercase">
                                                    {item.fullName}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                                                    <Mail className="h-2.5 w-2.5" /> {item.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tighter rounded-md h-5 px-1.5 border-none">
                                                    <Briefcase className="mr-1 h-2.5 w-2.5" /> {item.title || "LECTURER"}
                                                </Badge>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500 italic flex items-center gap-1 ml-1">
                                                <GraduationCap className="h-3 w-3" /> {item.department?.name || "Global Department"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <div className="h-7 px-3 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <Users className="h-3 w-3" />
                                                <span className="text-xs font-black tracking-tighter">{item.internCount || 0}</span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-1">Interns managed</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg transition-all">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[180px] rounded-2xl border-none shadow-2xl p-2 bg-white/95 backdrop-blur-md">
                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-slate-50" />
                                                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary py-2.5 cursor-pointer group/item">
                                                    <Link to={`/hr/mentors/${item.id}`} className="flex items-center w-full">
                                                        <Eye className="mr-2.5 h-4 w-4 text-slate-300 group-hover/item:text-primary" />
                                                        <span className="font-bold text-sm tracking-tight text-slate-600 group-hover/item:text-primary">View Portfolio</span>
                                                        <ArrowUpRight className="ml-auto h-3 w-3 text-slate-200 group-hover/item:text-primary" />
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-300 font-bold italic border-none bg-slate-50/30">
                                    <div className="flex flex-col items-center gap-2">
                                        <Briefcase className="h-8 w-8 opacity-20" />
                                        <span>Không tìm thấy Mentor nào phù hợp với điều kiện lọc.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {totalPages > 1 && (
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

            {isCreateModalOpen && (
                <CreateMentor
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}
