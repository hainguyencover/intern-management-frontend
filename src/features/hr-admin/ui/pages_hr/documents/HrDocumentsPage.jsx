import React, { useEffect, useState } from "react";
import { internDocumentApi } from "@/api/internDocumentApi";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import DocumentPreview from "@/components/DocumentPreview";
import { toast } from "sonner";
import { Check, X, Eye, FileText, Download, Filter, RefreshCw, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HrDocumentsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ page: 0, size: 10, status: "PENDING", documentType: "" });
    const [selectedDoc, setSelectedDoc] = useState(null);
    
    // Reject Dialog State
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Preview State
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewFileType, setPreviewFileType] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await internDocumentApi.getPendingDocuments(filters);
            // Handle both ApiResponse wrapper format or direct pagination content
            const contentData = res?.data || res;
            setData(contentData);
        } catch (err) {
            toast.error("Không thể tải danh sách tài liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters.page, filters.status, filters.documentType]);

    const handleApprove = async (doc) => {
        try {
            setActionLoading(true);
            await internDocumentApi.approveDocument({ id: doc.id });
            toast.success(`Đã phê duyệt tài liệu ${doc.type} của ${doc.internName || 'Intern'}`);
            fetchData();
        } catch (err) {
            toast.error(err.backendMessage || "Phê duyệt tài liệu thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenRejectModal = (doc) => {
        setSelectedDoc(doc);
        setRejectionReason("");
        setRejectModalOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectionReason || !rejectionReason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối tài liệu!");
            return;
        }

        try {
            setActionLoading(true);
            await internDocumentApi.rejectDocument({
                id: selectedDoc.id,
                reason: rejectionReason.trim()
            });
            toast.success(`Đã từ chối tài liệu ${selectedDoc.type}`);
            setRejectModalOpen(false);
            setSelectedDoc(null);
            setRejectionReason("");
            fetchData();
        } catch (err) {
            toast.error(err.backendMessage || "Từ chối tài liệu thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    const handleView = async (doc) => {
        try {
            const res = await internDocumentApi.downloadDocument({ id: doc.id, isHr: true });
            const contentType = res.headers["content-type"] || "application/pdf";
            const blob = new Blob([res.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewTitle(`${doc.type} - ${doc.internName || 'Intern #' + doc.internId}`);
            setPreviewFileType(contentType);
            setPreviewVisible(true);
        } catch (err) {
            toast.error("Không thể tải tài liệu để xem trước.");
        }
    };

    const handleClosePreview = () => {
        setPreviewVisible(false);
        if (previewUrl) {
            window.URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setPreviewTitle("");
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        Quản lý & Duyệt tài liệu
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        Kiểm tra, phê duyệt hoặc từ chối CV và Đơn xin thực tập của ứng viên/thực tập sinh.
                    </p>
                </div>

                <Button variant="outline" size="sm" onClick={fetchData} className="self-start sm:self-auto rounded-xl">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                    <Filter className="h-4 w-4" /> Bộ lọc:
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Trạng thái:</span>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 0 })}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary focus:bg-white"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ duyệt (PENDING)</option>
                        <option value="APPROVED">Đã duyệt (APPROVED)</option>
                        <option value="REJECTED">Bị từ chối (REJECTED)</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Loại tài liệu:</span>
                    <select
                        value={filters.documentType}
                        onChange={(e) => setFilters({ ...filters, documentType: e.target.value, page: 0 })}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-primary focus:bg-white"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="CV">CV (Curriculum Vitae)</option>
                        <option value="INTERNSHIP_APPLICATION">Đơn xin thực tập</option>
                        <option value="INTERNSHIP_CONTRACT">Hợp đồng thực tập</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50/70 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-3.5">Ứng viên / Intern</th>
                            <th className="px-5 py-3.5">Loại tài liệu</th>
                            <th className="px-5 py-3.5">Tên file & Dung lượng</th>
                            <th className="px-5 py-3.5">Thời gian nộp</th>
                            <th className="px-5 py-3.5 text-center">Trạng thái</th>
                            <th className="px-5 py-3.5 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-slate-500 font-medium">
                                    Đang tải danh sách tài liệu...
                                </td>
                            </tr>
                        )}
                        {!loading && (!data?.content || data.content.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-slate-400 italic">
                                    Không tìm thấy tài liệu phù hợp với bộ lọc.
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            data?.content?.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-4 font-bold text-slate-800">
                                        {doc.internName || `Intern #${doc.internId}`}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-slate-600">
                                        <div className="truncate max-w-[200px]" title={doc.originalFileName}>
                                            {doc.originalFileName || doc.fileUrl?.split('/')?.pop() || 'document.pdf'}
                                        </div>
                                        {doc.fileSize && (
                                            <div className="text-[11px] text-slate-400 font-normal">
                                                {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-xs font-medium text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString('vi-VN') : "-"}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <StatusBadge status={doc.status} />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleView(doc)}
                                                className="h-8 rounded-lg text-slate-600 hover:bg-slate-100"
                                            >
                                                <Eye className="mr-1 h-3.5 w-3.5" /> Xem
                                            </Button>

                                            {doc.status === "PENDING" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(doc)}
                                                        disabled={actionLoading}
                                                        className="h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                                                    >
                                                        <Check className="mr-1 h-3.5 w-3.5" /> Phê duyệt
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleOpenRejectModal(doc)}
                                                        disabled={actionLoading}
                                                        className="h-8 rounded-lg font-semibold"
                                                    >
                                                        <X className="mr-1 h-3.5 w-3.5" /> Từ chối
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {data && data.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100">
                        <Pagination
                            current={filters.page}
                            total={data.totalElements}
                            pageSize={filters.size}
                            onChange={(page) => setFilters({ ...filters, page })}
                        />
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in-50">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-rose-600">
                            <AlertCircle className="h-6 w-6" />
                            <h3 className="text-lg font-bold text-slate-900">Từ chối tài liệu</h3>
                        </div>

                        <p className="text-sm text-slate-600">
                            Bạn đang yêu cầu từ chối tài liệu <span className="font-bold text-slate-900">{selectedDoc?.type}</span> của ứng viên <span className="font-bold text-slate-900">{selectedDoc?.internName || `Intern #${selectedDoc?.internId}`}</span>.
                        </p>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                Lý do từ chối (bắt buộc) <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                                placeholder="Nhập chi tiết lý do từ chối (Ví dụ: CV thiếu thông tin kinh nghiệm, file không mở được, v.v.)..."
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setRejectModalOpen(false);
                                    setSelectedDoc(null);
                                }}
                                disabled={actionLoading}
                                className="rounded-xl"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleConfirmReject}
                                disabled={actionLoading || !rejectionReason.trim()}
                                className="rounded-xl font-bold"
                            >
                                {actionLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <DocumentPreview
                open={previewVisible}
                url={previewUrl}
                onClose={handleClosePreview}
                title={previewTitle}
                fileType={previewFileType}
            />
        </div>
    );
}
