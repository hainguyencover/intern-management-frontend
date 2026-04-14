import React, { useEffect, useState } from "react";
import { contractApi } from "@/api/contractApi";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/model/AuthContext";
import {
    FileCheck,
    Eye,
    PenTool,
    Download,
    AlertCircle,
    CheckCircle2,
    Clock,
    ShieldCheck,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    DialogTitle
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function InternContractsPage() {
    const { user } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmingDoc, setConfirmingDoc] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const res = await contractApi.myDocuments();
            const list = res.data.filter(
                (d) => d.type === "INTERNSHIP_CONTRACT" || d.type === "CONTRACT"
            );
            setContracts(list);
        } catch (error) {
            toast.error("Không thể tải danh sách hợp đồng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleView = async (docId) => {
        try {
            const response = await contractApi.download(docId);
            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            toast.error("Không thể xem file. Vui lòng thử lại.");
        }
    };

    const handleConfirmSign = async () => {
        if (!confirmingDoc) return;

        setIsSubmitting(true);
        try {
            await contractApi.confirmContract(confirmingDoc.id);
            toast.success("Đã xác nhận ký hợp đồng thành công!");
            setConfirmingDoc(null);
            fetchContracts();
        } catch (err) {
            toast.error("Xác nhận thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const configs = {
            APPROVED: { label: "Chờ ký", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
            APPROVE: { label: "Chờ ký", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
            SIGNED: { label: "Đã ký", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
            REJECTED: { label: "Từ chối", color: "bg-rose-50 text-rose-700 border-rose-200", icon: AlertCircle },
            PENDING: { label: "Đang xử lý", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
        };
        const config = configs[status] || { label: status, color: "bg-slate-50 text-slate-700 border-slate-200", icon: AlertCircle };
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${config.color}`}>
                <Icon className="h-3 w-3" /> {config.label}
            </Badge>
        );
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                    Hợp đồng Thực tập
                </h1>
                <p className="text-slate-500 font-medium italic">Vui lòng kiểm tra kỹ nội dung và thực hiện ký điện tử/xác nhận khi được yêu cầu.</p>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b pb-8">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-indigo-500" />
                        Danh sách Hợp đồng
                    </CardTitle>
                    <CardDescription>Các văn bản ghi nhớ và hợp đồng chính thức giữa bạn và công ty.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/30">
                                <TableHead className="font-bold pl-8">Tên tài liệu</TableHead>
                                <TableHead className="font-bold">Ngày ban hành</TableHead>
                                <TableHead className="font-bold text-center">Trạng thái</TableHead>
                                <TableHead className="font-bold text-right pr-8">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-8"><Skeleton className="h-4 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                                        <TableCell className="text-right pr-8"><Skeleton className="h-8 w-24 ml-auto rounded-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : contracts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium italic">
                                        Hiện chưa có hợp đồng nào được gửi tới bạn.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contracts.map((doc) => (
                                    <TableRow key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="pl-8">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                                                    PDF
                                                </div>
                                                <span className="font-bold text-slate-700 truncate max-w-[200px]">
                                                    {doc.fileUrl?.split("/").pop() || "HopDongThucTap.pdf"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-slate-500">
                                            {new Date(doc.uploadedAt).toLocaleString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getStatusBadge(doc.status)}
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleView(doc.id)}
                                                    className="rounded-full shadow-sm hover:bg-white hover:shadow-md"
                                                >
                                                    <Eye className="mr-1.5 h-4 w-4" /> Xem
                                                </Button>
                                                {(doc.status === "APPROVED" || doc.status === "APPROVE") && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setConfirmingDoc(doc)}
                                                        className="rounded-full bg-primary hover:bg-primary shadow-lg shadow-primary/20"
                                                    >
                                                        <PenTool className="mr-1.5 h-4 w-4" /> Ký ngay
                                                    </Button>
                                                )}
                                                {doc.status === "SIGNED" && (
                                                    <Button variant="ghost" size="sm" className="rounded-full text-emerald-600 disabled:opacity-100 italic font-bold">
                                                        <CheckCircle2 className="mr-1.5 h-4 w-4" /> Đã hoàn tất
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="bg-slate-50/50 p-6 flex items-center gap-2 border-t text-xs text-slate-400 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Dữ liệu hợp đồng được bảo mật theo tiêu chuẩn nội bộ của CodeGym.
                </CardFooter>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={!!confirmingDoc} onOpenChange={(open) => !open && setConfirmingDoc(null)}>
                <DialogContent className="rounded-2xl border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <div className="h-2 bg-primary w-full" />
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black flex items-center gap-3">
                                <PenTool className="h-6 w-6 text-primary" />
                                Xác nhận Ký hợp đồng
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium pt-2">
                                Bạn đang thực hiện xác nhận ký điện tử cho văn bản:
                                <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 font-bold flex items-center gap-2 italic">
                                    <FileCheck className="h-4 w-4 text-primary" />
                                    {confirmingDoc?.fileUrl?.split("/").pop()}
                                </div>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-xs text-amber-700 font-medium leading-relaxed">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                            Xác nhận này có giá trị pháp lý tương đương chữ ký tay trong phạm vi chương trình thực tập. Vui lòng kiểm tra kỹ trước khi đồng ý.
                        </div>

                        <DialogFooter className="gap-3 sm:justify-start">
                            <Button
                                onClick={handleConfirmSign}
                                disabled={isSubmitting}
                                className="flex-grow rounded-xl h-12 font-black shadow-xl shadow-primary/20"
                            >
                                {isSubmitting ? "Đang xử lý..." : "Tôi đồng ý ký hợp đồng"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setConfirmingDoc(null)}
                                className="rounded-xl h-12 px-6 font-bold"
                            >
                                Hủy bỏ
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
