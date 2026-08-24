import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "./ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, FileText, Download, Calendar, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { internDocumentApi } from "@/api/internDocumentApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentList({ documents, onDelete, loading }) {
    const handleView = async (docId, fileName) => {
        try {
            const response = await internDocumentApi.downloadDocument({ id: docId, isHr: false });
            const contentType = response?.headers?.['content-type'] || 'application/pdf';
            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            toast.error("Không thể tải/xem tài liệu. Vui lòng thử lại.");
        }
    };

    const renderStatusBadge = (status) => {
        const st = (status || "").toUpperCase();
        if (st === "APPROVED") {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Đã duyệt
                </span>
            );
        }
        if (st === "REJECTED") {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                    <XCircle className="h-3.5 w-3.5" /> Từ chối
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                <Clock className="h-3.5 w-3.5" /> Chờ duyệt
            </span>
        );
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "—";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const formatDocTypeLabel = (type) => {
        if (type === "CV") return "Curriculum Vitae (CV)";
        if (type === "INTERNSHIP_APPLICATION") return "Đơn xin thực tập";
        if (type === "INTERNSHIP_CONTRACT") return "Hợp đồng thực tập";
        return type;
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="font-bold">Loại tài liệu</TableHead>
                        <TableHead className="font-bold">Tên tệp tin & Dung lượng</TableHead>
                        <TableHead className="font-bold text-center">Trạng thái</TableHead>
                        <TableHead className="font-bold">Phản hồi & Ngày tạo</TableHead>
                        <TableHead className="text-right font-bold">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : documents && documents.length > 0 ? (
                        documents.map((doc) => (
                            <TableRow key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm block">{formatDocTypeLabel(doc.type)}</span>
                                            <span className="text-[11px] font-medium text-slate-400">{doc.type}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <button
                                            onClick={() => handleView(doc.id, doc.originalFileName || doc.fileName)}
                                            className="text-sm font-semibold text-slate-700 hover:text-primary hover:underline text-left truncate max-w-[220px]"
                                        >
                                            {doc.originalFileName || doc.fileName || doc.fileUrl?.split('/')?.pop() || "document.pdf"}
                                        </button>
                                        <span className="text-xs font-medium text-slate-400">
                                            {formatFileSize(doc.fileSize)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {renderStatusBadge(doc.status)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                                            <Calendar className="h-3 w-3" />
                                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString('vi-VN') : "—"}
                                        </div>
                                        {(doc.rejectionReason || doc.reviewNote) && doc.status === "REJECTED" && (
                                            <div className="flex items-start gap-1.5 rounded-lg bg-rose-50 p-2 text-xs font-medium text-rose-700 border border-rose-100 mt-1">
                                                <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                                                <span>Lý do từ chối: {doc.rejectionReason || doc.reviewNote}</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(doc.id, doc.originalFileName)}
                                            className="h-8 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50"
                                        >
                                            <Download className="mr-1.5 h-3.5 w-3.5" /> Tải về
                                        </Button>
                                        {doc.status === "PENDING" && onDelete && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(doc.id)}
                                                className="h-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-36 text-center text-slate-400 italic">
                                Chưa có tài liệu nào được nộp.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
