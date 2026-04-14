import React, { useEffect, useState } from "react";
import { documentApi } from "@/api/documentApi";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import DocumentPreview from "@/components/DocumentPreview";
import { toast } from "sonner";

export default function HrDocumentsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ page: 0, size: 10 });
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [verifyModal, setVerifyModal] = useState(false);
    const [decision, setDecision] = useState("");
    const [note, setNote] = useState("");

    // Preview State
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewFileType, setPreviewFileType] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await documentApi.pending(filters);
            setData(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách tài liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.page]);

    const handleVerify = async () => {
        if (!selectedDoc || !decision) return;
        try {
            await documentApi.verify(selectedDoc.id, { decision, note });
            toast.success(decision === "APPROVE" ? "Đã duyệt tài liệu" : "Đã từ chối tài liệu");
            setVerifyModal(false);
            setSelectedDoc(null);
            setDecision("");
            setNote("");
            await fetchData();
        } catch (err) {
            toast.error("Có lỗi xảy ra");
        }
    };

    const handleView = async (doc) => {
        try {
            const res = await documentApi.download(doc.id);
            // res is axios response, data is blob
            const blob = new Blob([res.data], { type: res.headers["content-type"] });
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewTitle(doc.type);
            setPreviewFileType(res.headers["content-type"]);
            setPreviewVisible(true);
        } catch (err) {
            console.error(err);
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
        <div className="mx-auto w-full max-w-6xl space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Tài liệu chờ duyệt</h1>
                <p className="mt-1 text-sm text-slate-600">Xác thực tài liệu của thực tập sinh</p>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Intern</th>
                            <th className="px-4 py-3">Loại</th>
                            <th className="px-4 py-3">Ngày tải</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-slate-600">
                                    Đang tải...
                                </td>
                            </tr>
                        )}
                        {!loading && (!data?.content || data.content.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-slate-600">
                                    Không có tài liệu chờ duyệt
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            data?.content?.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium">{doc.id}</td>
                                    <td className="px-4 py-3">{doc.internName || `Intern #${doc.internId}`}</td>
                                    <td className="px-4 py-3">{doc.type}</td>
                                    <td className="px-4 py-3">
                                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={doc.status} />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedDoc(doc);
                                                setVerifyModal(true);
                                            }}
                                            className="mr-2 text-sm font-semibold text-blue-600 hover:underline"
                                        >
                                            Duyệt
                                        </button>
                                        <button
                                            onClick={() => handleView(doc)}
                                            className="text-sm font-semibold text-slate-600 hover:underline"
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <Pagination
                    current={filters.page}
                    total={data?.totalElements || 0}
                    pageSize={filters.size}
                    onChange={(page) => setFilters({ ...filters, page })}
                />
            </div>

            {/* Verify Modal */}
            {verifyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold">Xác thực tài liệu</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Tài liệu: {selectedDoc?.type} - Intern #{selectedDoc?.internId}
                        </p>

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Quyết định *</label>
                                <select
                                    value={decision}
                                    onChange={(e) => setDecision(e.target.value)}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                >
                                    <option value="">-- Chọn --</option>
                                    <option value="APPROVE">Duyệt</option>
                                    <option value="REJECT">Từ chối</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Ghi chú</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                    className="mt-1 w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    placeholder="Lý do (nếu từ chối)..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setVerifyModal(false);
                                    setSelectedDoc(null);
                                    setDecision("");
                                    setNote("");
                                }}
                                className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleVerify}
                                disabled={!decision}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                                Xác nhận
                            </button>
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
