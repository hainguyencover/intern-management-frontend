import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { leaveApi } from "../../api/leaveApi";
import {
    Plane,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Calendar,
    User,
    Clock,
    MessageSquare,
    AlertCircle,
    ArrowUpRight,
    Search,
    Filter,
    MoreHorizontal,
    FileText,
    History,
    ShieldCheck,
    Info
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";

export default function LeaveApprovals() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // Action states
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await leaveApi.getAllRequests({
                status: 'PENDING',
                sort: 'createdAt,desc'
            });
            setRequests(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được danh sách đơn nghỉ phép");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm("Xác nhận phê duyệt đơn nghỉ phép này?")) return;
        try {
            await leaveApi.approve(id);
            toast.success("Đã phê duyệt đơn thành công");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleRejectClick = (req) => {
        setSelectedRequest(req);
        setRejectReason("");
        setShowRejectModal(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối");
            return;
        }

        try {
            await leaveApi.reject(selectedRequest.id, rejectReason);
            toast.success("Đã từ chối đơn nghỉ phép");
            setShowRejectModal(false);
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Leave Records
                        <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            GOVERNANCE
                        </Badge>
                    </h1>
                    <p className="text-slate-400 font-medium italic mt-1 text-sm flex items-center gap-2">
                        <Plane className="h-4 w-4 opacity-50" /> Xử lý và phê duyệt các yêu cầu vắng mặt từ thực tập sinh.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-12 px-6 rounded-2xl bg-slate-50 flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-widest border border-slate-100 shadow-sm">
                        <History className="h-4 w-4" /> Pending Queue: <span className="text-primary text-base leading-none">{requests.length}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden rounded-3xl bg-white">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="hover:bg-slate-900 border-none">
                            <TableHead className="w-[280px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pl-8">Thực tập sinh</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Phân loại & Lý do</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5">Lộ trình nghỉ phép</TableHead>
                            <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-5 pr-8">Quyết định quản lý</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    <TableCell className="pl-8"><div className="h-10 w-44 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-12 w-64 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell><div className="h-6 w-32 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                                    <TableCell className="pr-8 text-right"><div className="h-9 w-40 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-60 text-center bg-slate-50/30">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                                            <ShieldCheck className="h-10 w-10 text-slate-100" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Queue Clear</p>
                                            <p className="text-slate-300 font-medium italic text-sm">Hiện không có đơn nghỉ phép nào đang chờ xử lý.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id} className="group hover:bg-slate-50/80 border-slate-50 transition-colors">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <span className="text-base font-black text-slate-900 tracking-tight italic group-hover:text-primary transition-colors">
                                                {req.internName}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex flex-col space-y-1.5">
                                            <Badge className="w-fit bg-primary/5 text-primary border-none shadow-none font-black text-[9px] uppercase tracking-widest py-1 h-6">
                                                <Info className="h-3 w-3 mr-1.5" /> {req.leaveType}
                                            </Badge>
                                            <p className="text-slate-500 text-[11px] font-bold italic leading-relaxed max-w-sm">
                                                "{req.reason}"
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <div className="flex items-center gap-2 text-slate-900 font-black text-sm tracking-tighter bg-white shadow-sm border border-slate-100 rounded-xl px-3 py-1.5 w-fit">
                                            <Calendar className="h-3.5 w-3.5 text-primary opacity-60" />
                                            {req.startDate} <span className="text-slate-300 mx-1">→</span> {req.endDate}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleRejectClick(req)}
                                                className="h-10 px-5 rounded-2xl border-rose-100 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
                                            >
                                                Decline
                                            </Button>
                                            <Button
                                                onClick={() => handleApprove(req.id)}
                                                className="h-10 px-5 rounded-2xl bg-slate-900 hover:bg-black font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all active:scale-95"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Rejection Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent className="max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <DialogHeader className="p-8 bg-rose-600 text-white space-y-2">
                        <DialogTitle className="text-2xl font-black leading-tight flex items-center gap-3 uppercase tracking-tighter">
                            <ShieldAlert className="h-6 w-6 text-white" />
                            Từ chối nghỉ phép
                        </DialogTitle>
                        <DialogDescription className="text-rose-100 italic font-medium">
                            Vui lòng cung cấp lý do cụ thể để gửi thông báo cho thực tập sinh.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Lý do từ chối *</label>
                            <Textarea
                                rows={4}
                                className="resize-none rounded-2xl border-slate-200 px-4 py-3 text-sm font-medium italic focus-visible:ring-rose-500/20"
                                placeholder="Nhập lý do thực tập sinh không được duyệt nghỉ phép..."
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                            />
                        </div>

                        <DialogFooter className="pt-6 border-t flex flex-row gap-3">
                            <Button variant="ghost" onClick={() => setShowRejectModal(false)} className="flex-1 h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500">
                                Bỏ Qua
                            </Button>
                            <Button
                                onClick={handleConfirmReject}
                                className="flex-[2] h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-rose-200 transition-all active:scale-95"
                            >
                                Xác Nhận Từ Chối
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
