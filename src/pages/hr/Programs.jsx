import React, { useEffect, useState } from "react";
import { programService } from "../../services/programService";
import { departmentApi } from "../../api/departmentApi";
import { toast } from "sonner";
import {
    Pencil,
    MoreHorizontal,
    Plus,
    Calendar,
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    Layout,
    PlusCircle,
    Target,
    Settings2,
    ArrowUpRight,
    Search
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../../components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import {
    Select as UiSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";

export default function Programs() {
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [form, setForm] = useState({
        name: "",
        departmentId: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const res = await programService.list({ size: 100 });
            setPrograms(res.data.content || []);
        } catch (err) {
            toast.error("Không thể tải danh sách chương trình");
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAll();
            setDepartments(res.data || []);
        } catch (err) {
            console.error("Failed to load departments", err);
        }
    };

    useEffect(() => {
        fetchPrograms();
        fetchDepartments();
    }, []);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editingProgram) {
                await programService.update(editingProgram.id, form);
                toast.success("Cập nhật chương trình thành công");
            } else {
                await programService.create(form);
                toast.success("Tạo chương trình thành công");
            }
            setShowModal(false);
            resetForm();
            await fetchPrograms();
        } catch (err) {
            toast.error(err.response?.data?.message || (editingProgram ? "Cập nhật thất bại" : "Tạo chương trình thất bại"));
        }
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditingProgram(p);
        setForm({
            name: p.name,
            departmentId: p.departmentId?.toString() || "",
            description: p.description || "",
            startDate: p.startDate ? p.startDate.split('T')[0] : "",
            endDate: p.endDate ? p.endDate.split('T')[0] : "",
        });
        setShowModal(true);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await programService.updateStatus(id, newStatus);
            toast.success("Cập nhật trạng thái thành công");
            fetchPrograms();
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    const resetForm = () => {
        setEditingProgram(null);
        setForm({ name: "", departmentId: "", description: "", startDate: "", endDate: "" });
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ACTIVE': return { label: 'Active', color: 'bg-emerald-500 shadow-emerald-200' };
            case 'CLOSED': return { label: 'Closed', color: 'bg-slate-400' };
            case 'DRAFT': return { label: 'Draft', color: 'bg-blue-500 shadow-blue-200' };
            default: return { label: status, color: 'bg-slate-500' };
        }
    };

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Training Programs
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            CORE MODULE
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1">Thiết kế và vận hành các lộ trình đào tạo thực tập sinh.</p>
                </div>
                <Button
                    onClick={openCreate}
                    className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Tạo chương trình mới
                </Button>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 pl-8">Chương trình đào tạo</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Đơn vị chủ trì</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Lộ trình thời gian</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">Trạng thái</TableHead>
                            <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="pl-8"><Skeleton className="h-12 w-64 rounded-xl" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32 rounded-lg" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48 rounded-lg" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                                    <TableCell className="pr-8 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                                </TableRow>
                            ))
                        ) : programs.length > 0 ? (
                            programs.map((p) => {
                                const dept = departments.find(d => d.id === parseInt(p.departmentId));
                                const statusInfo = getStatusLabel(p.status);
                                return (
                                    <TableRow key={p.id} className="group transition-all hover:bg-slate-50/80 border-slate-100">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                    <Target className="h-6 w-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors text-base">
                                                        {p.name}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-slate-400 italic line-clamp-1 max-w-sm">
                                                        {p.description || "Chưa cập nhật mô tả mục tiêu..."}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-slate-300" />
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">
                                                    {dept?.name || "Global / Core Team"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-300 ml-1 uppercase">Starts</span>
                                                    <Badge variant="outline" className="border-slate-100 text-slate-500 font-bold font-mono">
                                                        <Calendar className="mr-1.5 h-3 w-3" /> {p.startDate}
                                                    </Badge>
                                                </div>
                                                <div className="h-0.5 w-4 bg-slate-100 mt-4 rounded-full" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-300 ml-1 uppercase">Ends</span>
                                                    <Badge variant="outline" className="border-slate-100 text-slate-500 font-bold font-mono">
                                                        <Calendar className="mr-1.5 h-3 w-3 " /> {p.endDate}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={cn("h-7 px-4 rounded-full font-black text-[10px] uppercase tracking-widest text-white shadow-lg", statusInfo.color)}>
                                                {statusInfo.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(p)}
                                                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg transition-all">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border-none shadow-2xl p-2 bg-white/95 backdrop-blur-md">
                                                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lifecycle</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        <DropdownMenuItem onClick={() => handleStatusChange(p.id, 'ACTIVE')} disabled={p.status === 'ACTIVE'} className="rounded-xl focus:bg-emerald-50 focus:text-emerald-600 py-2.5 cursor-pointer font-bold">
                                                            <CheckCircle2 className="mr-2.5 h-4 w-4 text-emerald-500" /> Activate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(p.id, 'CLOSED')} disabled={p.status === 'CLOSED'} className="rounded-xl focus:bg-rose-50 focus:text-rose-600 py-2.5 cursor-pointer font-bold">
                                                            <XCircle className="mr-2.5 h-4 w-4 text-rose-500" /> Close Program
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(p.id, 'DRAFT')} disabled={p.status === 'DRAFT' || p.status === 'CLOSED'} className="rounded-xl focus:bg-blue-50 focus:text-blue-600 py-2.5 cursor-pointer font-bold">
                                                            <Clock className="mr-2.5 h-4 w-4 text-blue-500" /> Back to Draft
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-slate-300 font-bold italic border-none bg-slate-50/30">
                                    <div className="flex flex-col items-center gap-2">
                                        <Layout className="h-8 w-8 opacity-20" />
                                        <span>Không có chương trình thực tập nào đang vận hành.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Create/Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-xl rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <DialogHeader className="p-8 bg-slate-900 text-white space-y-2">
                        <DialogTitle className="text-2xl font-black leading-tight flex items-center gap-3">
                            <Settings2 className="h-6 w-6 text-primary" />
                            {editingProgram ? "CẤU HÌNH CHƯƠNG TRÌNH" : "THIẾT KẾ LỘ TRÌNH MỚI"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 italic font-medium">
                            Định nghĩa các tham số cơ bản cho chương trình đào tạo thực tập sinh.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateOrUpdate} className="p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tên chương trình *</label>
                                <Input
                                    required
                                    placeholder="Enter program name..."
                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 font-black tracking-tight"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Đơn vị chủ trì *</label>
                                    <UiSelect
                                        value={form.departmentId}
                                        onValueChange={(val) => setForm({ ...form, departmentId: val })}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-slate-300" />
                                                <SelectValue placeholder="Chọn đơn vị..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id.toString()} className="rounded-lg py-3 group">
                                                    <span className="font-bold tracking-tight text-slate-700 group-focus:text-primary">{dept.name}</span>
                                                    <Badge variant="ghost" className="ml-2 text-[9px] font-black opacity-40">{dept.code}</Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </UiSelect>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mục tiêu đợt thực tập</label>
                                    <div className="flex h-11 items-center gap-2 border border-slate-200 px-3 rounded-xl bg-slate-50/50">
                                        <Target className="h-4 w-4 text-slate-300" />
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Recruitment Level 1</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mô tả định hướng</label>
                                <Textarea
                                    rows={3}
                                    placeholder="Kỳ vọng, yêu cầu kỹ năng, công việc thực tế..."
                                    className="resize-none rounded-2xl border-slate-200 px-4 py-3 text-sm font-medium italic focus:ring-primary/20"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Thời gian bắt đầu</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-300" />
                                        <Input
                                            type="date"
                                            className="h-11 pl-10 rounded-xl border-slate-200 font-bold text-slate-600"
                                            value={form.startDate}
                                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Thời gian kết thúc</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-300" />
                                        <Input
                                            type="date"
                                            className="h-11 pl-10 rounded-xl border-slate-200 font-bold text-slate-600"
                                            value={form.endDate}
                                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-8 border-t flex flex-row gap-3">
                            <Button variant="ghost" type="button" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500">
                                Hủy
                            </Button>
                            <Button type="submit" className="flex-[2] h-12 rounded-2xl bg-primary hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all active:scale-95">
                                {editingProgram ? "Cập nhật dữ liệu" : "Khởi tạo lộ trình"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const cn = (...inputs) => inputs.filter(Boolean).join(" ");
