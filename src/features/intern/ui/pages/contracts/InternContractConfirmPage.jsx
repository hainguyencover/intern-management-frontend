import React, { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { documentApi as contractApi } from "@/api/contractApi.js";
import {
    FileText,
    Eye,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Clock,
    ExternalLink,
    X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function InternContractConfirmPage() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        loadContracts();
    }, []);

    const loadContracts = async () => {
        setLoading(true);
        try {
            const res = await contractApi.getMyContracts();
            setContracts(res.data || []);
        } catch (error) {
            toast.error("Không thể tải danh sách hợp đồng");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        setConfirming(true);
        try {
            await contractApi.confirmContract(id);
            toast.success("Xác nhận hợp đồng thành công!");
            loadContracts();
            setSelectedId(null);
        } catch (error) {
            toast.error("Xác nhận thất bại");
        } finally {
            setConfirming(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                    Ký nhận Hợp đồng
                </h1>
                <p className="text-slate-500 font-medium italic">Vui lòng đọc kỹ nội dung trước khi thực hiện xác nhận ký nhận bàn giao.</p>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b pb-8">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-500" />
                        Văn bản cần xử lý
                    </CardTitle>
                    <CardDescription>Danh sách các hợp đồng và cam kết bảo mật được gửi tới bạn.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/30">
                                <TableHead className="font-bold pl-8">Vị trí thực tập</TableHead>
                                <TableHead className="font-bold">Trạng thái</TableHead>
                                <TableHead className="font-bold">Ngày ký</TableHead>
                                <TableHead className="font-bold text-right pr-8">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-8"><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell className="text-right pr-8"><Skeleton className="h-8 w-20 ml-auto rounded-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : contracts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium italic">
                                        Không tìm thấy dữ liệu hợp đồng tương ứng.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contracts.map((record) => (
                                    <TableRow key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="pl-8 font-bold text-slate-700">
                                            {record.application?.position || "Internship Position"}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={record.status} />
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-slate-500">
                                            {record.signedAt ? new Date(record.signedAt).toLocaleString("vi-VN") : "-"}
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setPreviewUrl(record.fileUrl)}
                                                    className="rounded-full hover:bg-white hover:shadow-md"
                                                >
                                                    <Eye className="mr-1.5 h-4 w-4" /> Xem nội dung
                                                </Button>
                                                {record.status === "SENT" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setSelectedId(record.id)}
                                                        className="rounded-full bg-primary hover:bg-primary shadow-lg shadow-primary/20 font-bold"
                                                    >
                                                        <CheckCircle2 className="mr-1.5 h-4 w-4" /> Xác nhận ký
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
            </Card>

            {/* Preview Dialog */}
            <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
                <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="absolute right-4 top-4 z-50">
                        <Button variant="outline" size="icon" onClick={() => setPreviewUrl(null)} className="rounded-full bg-white/80 backdrop-blur shadow-md h-10 w-10">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    {previewUrl && (
                        <iframe
                            src={previewUrl}
                            className="h-full w-full"
                            title="Contract Preview"
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Sign Confirmation Dialog */}
            <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                    <div className="h-2 bg-primary w-full" />
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black flex items-center gap-3">
                                <CheckCircle2 className="h-7 w-7 text-primary" />
                                Xác nhận Chữ ký
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium pt-2">
                                Bạn có chắc chắn muốn thực hiện ký điện tử cho văn bản này?
                                <span className="block mt-2 font-black text-rose-600">Lưu ý: Hành động này không thể hoàn tác và có giá trị pháp lý.</span>
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="gap-3 sm:justify-start">
                            <Button
                                onClick={() => handleConfirm(selectedId)}
                                disabled={confirming}
                                className="flex-grow h-12 rounded-xl font-black bg-slate-900 shadow-xl shadow-slate-200"
                            >
                                {confirming ? (
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                )}
                                {confirming ? "Đang xử lý..." : "Xác nhận và Ký ngay"}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedId(null)}
                                className="h-12 px-6 rounded-xl font-bold"
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
