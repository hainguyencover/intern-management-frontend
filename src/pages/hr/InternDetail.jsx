import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { internApi } from "../../api/internApi";
import { documentApi } from "../../api/documentApi";
import StatusBadge from "../../components/StatusBadge";
import { toast } from "sonner";

export default function InternDetail() {
    const { internId } = useParams();
    const navigate = useNavigate();
    const [intern, setIntern] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Verify Modal State
    const [verifyModal, setVerifyModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [decision, setDecision] = useState("");
    const [note, setNote] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [internRes, docsRes] = await Promise.all([
                internApi.getById(internId),
                documentApi.getByIntern(internId),
            ]);
            setIntern(internRes.data);
            setDocuments(docsRes.data || []);
        } catch (err) {
            toast.error("Không thể tải thông tin");
            navigate("/hr/interns");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [internId, navigate]);

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
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-slate-600">Đang tải...</div>
            </div>
        );
    }

    if (!intern) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-slate-600">Không tìm thấy thực tập sinh</div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                        ← Quay lại
                    </button>
                    <h1 className="mt-2 text-2xl font-bold">{intern.fullName}</h1>
                    <p className="text-sm text-slate-600">ID: {intern.id}</p>
                </div>
                <Link
                    to={`/hr/interns/${internId}/edit`}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                    Chỉnh sửa
                </Link>
            </div>

            {/* Thông tin cơ bản */}
            <div className="rounded-2xl border bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">Thông tin cá nhân</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <div className="text-sm font-medium text-slate-500">Email</div>
                        <div className="mt-1 text-sm text-slate-900">{intern.email}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">Điện thoại</div>
                        <div className="mt-1 text-sm text-slate-900">{intern.phone || "-"}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">Mã sinh viên</div>
                        <div className="mt-1 text-sm text-slate-900">{intern.studentCode || "-"}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">Ngày sinh</div>
                        <div className="mt-1 text-sm text-slate-900">{intern.dob || "-"}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">Trường</div>
                        <div className="mt-1 text-sm text-slate-900">{intern.university || "-"}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">Ngành</div>
                        <div className="mt-1 text-sm text-slate-900">{intern.major || "-"}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500">GPA</div>
                        <div className="mt-1 text-sm text-slate-900">{intern.gpa || "-"}</div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="text-sm font-medium text-slate-500">Địa chỉ</div>
                        <div className="mt-1 text-sm text-slate-900">{intern.address || "-"}</div>
                    </div>
                </div>
            </div>

            {/* Tài liệu */}
            <div className="rounded-2xl border bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">Tài liệu đã tải lên</h2>
                {documents.length === 0 ? (
                    <div className="py-6 text-center text-sm text-slate-600">Chưa có tài liệu nào</div>
                ) : (
                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between rounded-xl border p-3"
                            >
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-900">{doc.type}</div>
                                    <div className="text-xs text-slate-600">
                                        Tải lên: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : "-"}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={doc.status} />
                                    {doc.status === "PENDING" && (
                                        <button
                                            onClick={() => {
                                                setSelectedDoc(doc);
                                                setVerifyModal(true);
                                            }}
                                            className="text-sm font-semibold text-blue-600 hover:underline"
                                        >
                                            Duyệt
                                        </button>
                                    )}
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-slate-600 hover:underline"
                                    >
                                        Xem
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Verify Modal */}
            {verifyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold">Xác thực tài liệu</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            Tài liệu: {selectedDoc?.type}
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
        </div>
    );
}
