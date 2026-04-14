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
import { Eye, Trash2, FileText, Download, Calendar, MessageSquare } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { documentApi } from "@/api/documentApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentList({ documents, onDelete, loading }) {
    const handleView = async (docId) => {
        try {
            const response = await documentApi.download(docId);
            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error(error);
            toast.error("Không thể xem file. Vui lòng thử lại.");
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="font-bold">Loại tài liệu</TableHead>
                        <TableHead className="font-bold">Tên tệp tin</TableHead>
                        <TableHead className="font-bold text-center">Trạng thái</TableHead>
                        <TableHead className="font-bold">Thông tin bổ sung</TableHead>
                        <TableHead className="text-right font-bold">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : documents.length > 0 ? (
                        documents.map((doc) => (
                            <TableRow key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold text-slate-700">{doc.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <button
                                        onClick={() => handleView(doc.id)}
                                        className="text-sm font-medium text-slate-600 hover:text-primary hover:underline transition-colors text-left"
                                    >
                                        {doc.fileName || "Tailieu_dk.pdf"}
                                    </button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <StatusBadge status={doc.status} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                            <Calendar className="h-3 w-3" />
                                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}
                                        </div>
                                        {doc.reviewNote && (
                                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600">
                                                <MessageSquare className="h-3 w-3" />
                                                {doc.reviewNote}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleView(doc.id)}
                                            className="h-8 rounded-full hover:bg-white hover:shadow-md"
                                        >
                                            <Eye className="mr-1.5 h-3.5 w-3.5" /> Xem
                                        </Button>
                                        {doc.status === "PENDING" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(doc.id)}
                                                className="h-8 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600"
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
                            <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                                Chưa có tài liệu nào được tải lên.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
