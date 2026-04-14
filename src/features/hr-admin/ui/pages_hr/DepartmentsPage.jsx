import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    listDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../../api/departmentApi";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Building2,
    X,
    Loader2,
    Info,
    MoreVertical,
    PlusCircle,
    ShieldCheck,
    Map,
    Settings2,
    AlertTriangle,
    Layers,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Validation Schema
const schema = z.object({
    code: z.string().min(2, "Mã phòng ban phải có ít nhất 2 ký tự").max(10, "Mã quá dài"),
    name: z.string().min(2, "Tên phòng ban phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
});

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            code: "",
            name: "",
            description: "",
        }
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await listDepartments();
            setDepartments(data);
        } catch (error) {
            toast.error("Không thể tải danh sách phòng ban");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDepartments = useMemo(() => {
        return departments.filter((dept) =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.code?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [departments, searchTerm]);

    const onSubmit = async (values) => {
        try {
            if (editingDept) {
                await updateDepartment(editingDept.id, values);
                toast.success("Cập nhật phòng ban thành công");
            } else {
                await createDepartment(values);
                toast.success("Thêm mới phòng ban thành công");
            }
            setIsModalOpen(false);
            form.reset();
            setEditingDept(null);
            fetchDepartments();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleEdit = (dept) => {
        setEditingDept(dept);
        form.setValue("code", dept.code);
        form.setValue("name", dept.name);
        form.setValue("description", dept.description || "");
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingDept(null);
        form.reset();
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setIsDeleteAlertOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteDepartment(deletingId);
            toast.success("Xóa phòng ban thành công");
            fetchDepartments();
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa phòng ban");
        } finally {
            setIsDeleteAlertOpen(false);
            setDeletingId(null);
        }
    };

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Departments
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            ORGANIZATION
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        Thiết kế và quản lý cấu trúc phòng ban toàn hệ thống.
                    </p>
                </div>
                <Button
                    onClick={handleAdd}
                    className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm phòng ban mới
                </Button>
            </div>

            {/* List & Search */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Tìm kiếm mã hoặc tên phòng ban..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-11 rounded-2xl border-none shadow-xl shadow-slate-200/40 bg-white focus-visible:ring-primary/10 font-bold text-slate-600 italic"
                        />
                    </div>
                    <Card className="h-11 px-6 flex items-center gap-3 rounded-2xl border-none shadow-xl shadow-slate-200/40 bg-white">
                        <Layers className="h-4 w-4 text-primary opacity-50" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departments:</span>
                        <span className="font-black text-slate-900 border-l pl-3 h-4 flex items-center">{departments.length}</span>
                    </Card>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-900">
                            <TableRow className="hover:bg-slate-900 border-none">
                                <TableHead className="w-[150px] font-black text-[10px] uppercase tracking-widest text-slate-400 pl-8">Mã CODE</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Tên phòng ban</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Mô tả định danh</TableHead>
                                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-8"><div className="h-6 w-16 bg-slate-100 animate-pulse rounded-lg" /></TableCell>
                                        <TableCell><div className="h-6 w-48 bg-slate-100 animate-pulse rounded-lg" /></TableCell>
                                        <TableCell><div className="h-6 w-64 bg-slate-100 animate-pulse rounded-lg" /></TableCell>
                                        <TableCell className="pr-8 text-right"><div className="h-8 w-8 ml-auto bg-slate-100 animate-pulse rounded-lg" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredDepartments.length > 0 ? (
                                filteredDepartments.map((dept) => (
                                    <TableRow key={dept.id} className="group transition-all hover:bg-slate-50/80 border-slate-100">
                                        <TableCell className="pl-8 py-5">
                                            <Badge variant="outline" className="h-7 px-3 bg-white border-slate-200 text-slate-500 font-mono font-black text-[10px] shadow-sm tracking-widest">
                                                {dept.code}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                                    <Building2 className="h-4 w-4" />
                                                </div>
                                                <span className="font-black text-slate-900 tracking-tight text-base group-hover:text-primary transition-colors italic">
                                                    {dept.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-xs font-bold font-serif italic max-w-md truncate">
                                            {dept.description || "— Chưa bổ sung mô tả chức năng —"}
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg transition-all">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[180px] rounded-2xl border-none shadow-2xl p-2 bg-white/95 backdrop-blur-md">
                                                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-slate-50" />
                                                    <DropdownMenuItem onClick={() => handleEdit(dept)} className="rounded-xl focus:bg-primary/5 focus:text-primary py-2.5 cursor-pointer font-bold transition-all">
                                                        <Pencil className="mr-2.5 h-4 w-4" /> Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(dept.id)} className="rounded-xl focus:bg-rose-50 focus:text-rose-600 py-2.5 cursor-pointer font-bold text-rose-500 transition-all">
                                                        <Trash2 className="mr-2.5 h-4 w-4" /> Delete Access
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-48 text-center text-slate-300 font-bold italic border-none bg-slate-50/30">
                                        <div className="flex flex-col items-center gap-2">
                                            <Map className="h-8 w-8 opacity-20" />
                                            <span>Không tìm thấy dữ liệu phòng ban phù hợp.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {/* Create/Edit dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <DialogHeader className="p-8 bg-slate-900 text-white space-y-2">
                        <DialogTitle className="text-2xl font-black leading-tight flex items-center gap-3 uppercase tracking-tighter">
                            <Settings2 className="h-6 w-6 text-primary" />
                            {editingDept ? "Cập nhật dữ liệu" : "Khởi tạo phòng ban"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 italic font-medium">
                            Định nghĩa thuộc tính và mô tả cho thực thể phòng ban mới.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-8">
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mã code nhận diện *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ví dụ: TECH, HR, MKT..."
                                                    {...field}
                                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 font-black tracking-tight"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[11px] font-bold italic" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tên hiển thị phòng ban *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập tên phòng ban..."
                                                    {...field}
                                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 font-bold italic text-slate-600"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[11px] font-bold italic" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mô tả chức năng</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    rows={4}
                                                    className="resize-none rounded-2xl border-slate-200 px-4 py-3 text-sm font-medium italic focus-visible:ring-primary/20"
                                                    placeholder="Nhập ghi chú hoặc mô tả nhiệm vụ của phòng ban này..."
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[11px] font-bold italic" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="pt-8 border-t flex flex-row gap-3">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500">
                                    Thoát
                                </Button>
                                <Button type="submit" className="flex-[2] h-12 rounded-2xl bg-primary hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all active:scale-95">
                                    Lưu cấu hình
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete confirm dialog */}
            <Dialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl p-8 bg-white">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center animate-pulse">
                            <AlertTriangle className="h-10 w-10 text-rose-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Xóa thực thể?</h2>
                            <p className="text-slate-400 font-medium italic text-sm px-4">
                                Hành động này sẽ gỡ bỏ hoàn toàn <span className="text-rose-500 font-black underline">phòng ban</span> khỏi cấu trúc tổ chức. Bạn có chắc chắn muốn tiếp tục?
                            </p>
                        </div>
                        <div className="flex w-full gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setIsDeleteAlertOpen(false)} className="flex-1 h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500">
                                Hủy bỏ
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete} className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-rose-200 active:scale-95 transition-all">
                                Xác nhận xóa
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
