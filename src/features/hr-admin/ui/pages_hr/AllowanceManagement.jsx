import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { allowanceApi } from "@/api/allowanceApi";
import { internApi } from "@/features/intern/api/internApi";
import { formatCurrency } from "@/utils/format";
import {
    Banknote,
    Calendar,
    User,
    PlusCircle,
    CheckCircle2,
    History,
    TrendingUp,
    Search,
    Filter,
    CreditCard,
    MoreVertical,
    Pencil,
    Trash2,
    Wallet,
    Info,
    ArrowUpRight,
    Loader2,
    ShieldCheck
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function AllowanceManagement() {
    const [allowances, setAllowances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form data
    const [interns, setInterns] = useState([]);
    const [form, setForm] = useState({
        internId: "",
        amount: "",
        notes: "",
        allowanceMonth: ""
    });

    useEffect(() => {
        loadData();
    }, [month]);

    const loadData = async () => {
        setLoading(true);
        try {
            const startDate = `${month}-01`;
            const endDate = `${month}-31`;

            const res = await allowanceApi.search({
                monthFrom: startDate,
                monthTo: endDate,
                sort: 'createdAt,desc'
            });
            setAllowances(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được dữ liệu phụ cấp");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = async () => {
        setIsEdit(false);
        setForm({ internId: "", amount: "", notes: "", allowanceMonth: `${month}-01` });
        setShowModal(true);
        try {
            const res = await internApi.search({ size: 1000, sort: 'user.fullName,asc' });
            setInterns(res.data.content || []);
        } catch (e) {
            toast.error("Không tải được danh sách thực tập sinh");
        }
    };

    const handleOpenEdit = (item) => {
        setIsEdit(true);
        setEditId(item.id);
        setForm({
            internId: item.internId,
            amount: item.amount,
            notes: item.notes || "",
            allowanceMonth: item.allowanceMonth
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await allowanceApi.updateAllowanceSafe(editId, {
                    ...form,
                    internId: form.internId || 0,
                    allowanceMonth: form.allowanceMonth || `${month}-01`,
                    amount: parseFloat(form.amount)
                });
                toast.success("Cập nhật thành công");
            } else {
                await allowanceApi.create({
                    ...form,
                    amount: parseFloat(form.amount)
                });
                toast.success("Tạo phụ cấp thành công");
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handlePay = async (id) => {
        if (!confirm("Xác nhận thanh toán khoản phụ cấp này?")) return;
        try {
            await allowanceApi.makePayment(id);
            toast.success("Đã thanh toán");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thanh toán thất bại");
        }
    };

    const totalAmount = useMemo(() => {
        return allowances.reduce((sum, item) => sum + (item.amount || 0), 0);
    }, [allowances]);

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Allowance Console
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            PAYROLL
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <Banknote className="h-4 w-4 opacity-50" /> Theo dõi và chi trả phụ cấp cho thực tập sinh toàn hệ thống.
                    </p>
                </div>
                <Button
                    onClick={handleOpenCreate}
                    className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Khởi tạo phụ cấp mới
                </Button>
            </div>

            {/* Selection & Stats Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white/50 backdrop-blur-md rounded-3xl overflow-hidden p-6 lg:col-span-1">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Period</span>
                                <span className="text-sm font-black text-slate-900 leading-none mt-1">Chu kỳ thanh toán</span>
                            </div>
                        </div>
                        <Input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="h-12 rounded-2xl border-none bg-white shadow-xl shadow-slate-200/40 font-black text-slate-600 px-5 text-lg"
                        />
                        <p className="text-[10px] font-bold text-slate-300 italic px-2">
                            * Dữ liệu sẽ tự động được cập nhật theo chu kỳ tháng đã chọn ở trên.
                        </p>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl shadow-slate-200/40 bg-slate-900 rounded-3xl overflow-hidden p-6 lg:col-span-2 relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Wallet className="h-40 w-40 text-white" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between h-full gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Financial Overview</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Tổng ngân sách dự kiến</h3>
                                <p className="text-4xl font-black text-white tracking-tighter">
                                    {formatCurrency(totalAmount)}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-end gap-3 text-right">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Records</span>
                                    <span className="text-lg font-black text-white">{allowances.length} khoản</span>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* List Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-[200px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pl-8">Thực tập sinh</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 text-center">Chu kỳ</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Giá trị phụ cấp</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Trạng thái quỹ</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Nhiệm vụ / Ghi chú</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="pl-8"><div className="h-10 w-40 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-6 w-20 mx-auto bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-6 w-32 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-8 w-24 bg-slate-50 animate-pulse rounded-full" /></TableCell>
                                    <TableCell><div className="h-6 w-40 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell className="pr-8 text-right"><div className="h-9 w-24 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : allowances.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-60 text-center bg-slate-50/30">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                                            <Wallet className="h-10 w-10 text-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No Data Available</p>
                                            <p className="text-slate-300 font-medium italic text-sm">Không tìm thấy bản ghi phụ cấp nào trong chu kỳ này.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            allowances.map((row) => (
                                <TableRow key={row.id} className="group hover:bg-slate-50/80 border-slate-50 transition-colors">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900 tracking-tight text-base italic group-hover:text-primary transition-colors">
                                                    {row.internName}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 text-center">
                                        <Badge variant="outline" className="h-7 px-3 bg-white border-slate-200 text-slate-500 font-mono font-black text-[10px] shadow-sm tracking-widest">
                                            {row.allowanceMonth}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <span className="text-base font-black text-slate-900 tracking-tighter">
                                            {formatCurrency(row.amount)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        {row.status === "PAID" ? (
                                            <div className="flex flex-col">
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none font-black text-[9px] uppercase tracking-widest py-1 h-6 w-fit">
                                                    <CheckCircle2 className="h-3 w-3 mr-1.5" /> PAID
                                                </Badge>
                                                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400 italic">
                                                    <History className="h-3 w-3 opacity-50" /> {row.paymentDate || "Recently processed"}
                                                </div>
                                            </div>
                                        ) : (
                                            <Badge className="bg-amber-50 text-amber-600 border-none shadow-none font-black text-[9px] uppercase tracking-widest py-1 h-6 w-fit">
                                                <CreditCard className="h-3 w-3 mr-1.5" /> PENDING
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <p className="text-slate-400 text-[11px] font-bold italic max-w-xs truncate">
                                            {row.notes || "— Không có ghi chú —"}
                                        </p>
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right">
                                        {row.status === "PENDING" ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenEdit(row)}
                                                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg transition-all"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handlePay(row.id)}
                                                    className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-black font-black text-[9px] uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all active:scale-95"
                                                >
                                                    Disburse Funds
                                                </Button>
                                            </div>
                                        ) : (
                                            <Badge variant="ghost" className="text-[10px] font-black text-slate-300 uppercase italic">
                                                Finalized
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Modal Dialog */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <DialogHeader className="p-8 bg-slate-900 text-white space-y-2">
                        <DialogTitle className="text-2xl font-black leading-tight flex items-center gap-3 uppercase tracking-tighter">
                            <Wallet className="h-6 w-6 text-primary" />
                            {isEdit ? "Cập nhật phụ cấp" : "Khởi tạo thanh toán"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 italic font-medium">
                            Xác thực thông tin tài chính trước khi đưa vào pipeline thanh toán.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="space-y-5">
                            {!isEdit && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Thực tập sinh thụ hưởng *</label>
                                    <Select
                                        required
                                        value={form.internId}
                                        onValueChange={val => setForm({ ...form, internId: val })}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20 font-bold italic text-slate-600 px-5">
                                            <SelectValue placeholder="-- Danh sách thực tập sinh --" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                            {interns.map(i => (
                                                <SelectItem key={i.id} value={i.id.toString()} className="rounded-xl py-2.5 font-bold transition-all">
                                                    <div className="flex flex-col">
                                                        <span>{i.fullName} <span className="text-[10px] text-slate-400">({i.studentCode})</span></span>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{i.university || 'Extern'}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mức phụ cấp quy đổi (VND) *</label>
                                <Input
                                    type="number"
                                    required
                                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20 font-black text-lg text-slate-900 px-5"
                                    placeholder="Ví dụ: 2000000"
                                    value={form.amount}
                                    onChange={e => setForm({ ...form, amount: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Ngày hiệu lực thanh toán *</label>
                                <Input
                                    type="date"
                                    required
                                    disabled={isEdit}
                                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20 font-bold italic text-slate-600 px-5"
                                    value={form.allowanceMonth}
                                    onChange={e => setForm({ ...form, allowanceMonth: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Căn cứ / Ghi chú nghiệp vụ</label>
                                <Textarea
                                    rows={3}
                                    className="resize-none rounded-2xl border-slate-200 px-4 py-3 text-sm font-medium italic focus-visible:ring-primary/20"
                                    placeholder="Bổ sung lý do hoặc văn bản hướng dẫn nếu có..."
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-8 border-t flex flex-row gap-3">
                            <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500">
                                Bỏ Qua
                            </Button>
                            <Button type="submit" className="flex-[2] h-12 rounded-2xl bg-primary hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all active:scale-95">
                                Lưu Hồ Sơ
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
