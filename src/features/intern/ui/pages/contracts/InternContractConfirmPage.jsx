import React, { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { contractApi } from "@/api/contractApi.js";
import {
    FileText,
    Eye,
    CheckCircle2,
    ShieldCheck,
    Clock,
    X,
    FileCheck
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
    const [agreed, setAgreed] = useState(false);

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
        if (!agreed) {
            toast.error("Vui lòng tích chọn đồng ý với các điều khoản hợp đồng.");
            return;
        }

        setConfirming(true);
        try {
            await contractApi.confirmByIntern(id);
            toast.success("Xác nhận hợp đồng thành công!");
            loadContracts();
            setSelectedId(null);
            setAgreed(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Xác nhận hợp đồng thất bại");
        } finally {
            setConfirming(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                    <ShieldCheck className="h-9 w-9 text-slate-900" />
                    Xác nhận Hợp đồng Thực tập (US-010)
                </h1>
                <p className="text-slate-500 font-medium italic">
                    Vui lòng kiểm tra kỹ văn bản PDF hợp đồng trước khi thực hiện xác nhận (BR-07).
                </p>
            </div>

            <Card className="border shadow-lg shadow-slate-200/60 overflow-hidden rounded-2xl">
                <CardHeader className="bg-slate-50/50 border-b pb-6">
                    <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
                        <FileText className="h-5 w-5 text-slate-700" />
                        Hợp đồng chờ xác nhận
                    </CardTitle>
                    <CardDescription>Hợp đồng chỉ chính thức có hiệu lực (SIGNED) sau khi cả HR và bạn đều hoàn tất xác nhận.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="font-bold pl-8">Tên file hợp đồng</TableHead>
                                <TableHead className="font-bold">HR xác nhận</TableHead>
                                <TableHead className="font-bold">Bạn xác nhận</TableHead>
                                <TableHead className="font-bold">Trạng thái hợp đồng</TableHead>
                                <TableHead className="font-bold text-right pr-8">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-8"><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                        <TableCell className="text-right pr-8"><Skeleton className="h-8 w-20 ml-auto rounded-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : contracts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium italic">
                                        Hiện tại chưa có hợp đồng thực tập nào được giao cho bạn.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contracts.map((record) => (
                                    <TableRow key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="pl-8 font-bold text-slate-800">
                                            📄 {record.fileName || "contract.pdf"}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold">
                                            {record.hrConfirmedAt ? (
                                                <span className="text-emerald-600">✓ Đã xác nhận</span>
                                            ) : (
                                                <span className="text-amber-600">Chờ HR</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs font-semibold">
                                            {record.internConfirmedAt ? (
                                                <span className="text-emerald-600">✓ Đã xác nhận</span>
                                            ) : (
                                                <span className="text-amber-600">Chưa xác nhận</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                record.status === 'SIGNED' ? 'bg-emerald-100 text-emerald-800' :
                                                record.status === 'HR_CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                record.status === 'INTERN_CONFIRMED' ? 'bg-purple-100 text-purple-800' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(record.fileUrl || `/api/v1/contracts/${record.id}/download`, '_blank')}
                                                    className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                                >
                                                    <Eye className="mr-1.5 h-4 w-4" /> Xem PDF
                                                </Button>
                                                {!record.internConfirmedAt && record.status !== 'SIGNED' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedId(record.id);
                                                            setAgreed(false);
                                                        }}
                                                        className="rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                                                    >
                                                        <FileCheck className="mr-1.5 h-4 w-4" /> Xác nhận hợp đồng
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

            {/* Confirmation Dialog */}
            <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
                <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                    <div className="h-2 bg-slate-900 w-full" />
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black flex items-center gap-3 text-slate-900">
                                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                                Xác nhận Hợp đồng Thực tập
                            </DialogTitle>
                            <DialogDescription className="text-slate-600 font-medium pt-2">
                                Bạn đang thực hiện xác nhận hợp đồng thực tập trên hệ thống HoLaHo IMS.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="rounded-xl border bg-slate-50 p-4 space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                />
                                <span className="text-xs text-slate-700 font-medium leading-relaxed">
                                    Tôi đã đọc kỹ toàn bộ nội dung trong hợp đồng PDF, xác nhận các thông tin cá nhân hoàn toàn chính xác và đồng ý xác nhận hợp đồng này.
                                </span>
                            </label>
                        </div>

                        <DialogFooter className="gap-3 sm:justify-start">
                            <Button
                                onClick={() => handleConfirm(selectedId)}
                                disabled={confirming || !agreed}
                                className="flex-grow h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                {confirming ? (
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                )}
                                {confirming ? "Đang xử lý..." : "Xác nhận hợp đồng"}
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
