import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import DecisionModal from "../../components/DecisionModal";
import { toast } from "sonner";
import { documentApi as applicationApi } from "../../api/applicationApi.js";

export default function ApplicationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // "APPROVE" | "REJECT" | null

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await applicationApi.getApplicationDetail(id);
            setApp(res.data);
        } catch (err) {
            toast.error("Không thể tải chi tiết hồ sơ");
            navigate("/hr/applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleReview = async (payload) => {
        try {
            await applicationApi.reviewApplication(id, payload);
            toast.success(
                payload.decision === "APPROVE" ? "Đã duyệt hồ sơ" : "Đã từ chối hồ sơ"
            );
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

    if (!app) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-slate-600">Không tìm thấy hồ sơ</div>
            </div>
        );
    }

    const canReview = app.status === "SUBMITTED";

    return (
        <div className="mx-auto w-full max-w-4xl space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                        ← Quay lại
                    </button>
                    <h1 className="mt-2 text-2xl font-bold">Chi tiết hồ sơ #{app.id}</h1>
                    <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={app.status} />
                        <span className="text-sm text-slate-600">
                            Intern ID: {app.internId || "-"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        onClick={() => setModal("REJECT")}
                        disabled={!canReview}
                    >
                        Từ chối
                    </button>
                    <button
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        onClick={() => setModal("APPROVE")}
                        disabled={!canReview}
                    >
                        Duyệt
                    </button>
                </div>
            </div>

            {/* Thông tin ứng tuyển */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Thông tin ứng tuyển</div>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between gap-3">
                            <span className="text-slate-500">Vị trí</span>
                            <span className="font-medium">{app.position || "-"}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-slate-500">Ngày nộp</span>
                            <span className="font-medium">
                                {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : "-"}
                            </span>
                        </div>
                        <div className="pt-2">
                            <div className="text-slate-500">Ghi chú</div>
                            <div className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm">
                                {app.note || "-"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lịch sử xét duyệt */}
                <div className="rounded-2xl border bg-white p-4">
                    <div className="text-sm font-semibold text-slate-800">Lịch sử xét duyệt</div>
                    <div className="mt-3 space-y-2">
                        {(!app.reviews || app.reviews.length === 0) && (
                            <div className="text-sm text-slate-600">Chưa có xét duyệt</div>
                        )}
                        {app.reviews?.map((r) => (
                            <div key={r.id} className="rounded-xl border p-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold text-slate-900">{r.decision}</div>
                                    <div className="text-xs text-slate-500">
                                        {r.decidedAt ? new Date(r.decidedAt).toLocaleString() : "-"}
                                    </div>
                                </div>
                                {r.comment && (
                                    <div className="mt-2 whitespace-pre-wrap text-slate-700">{r.comment}</div>
                                )}
                                <div className="mt-2 text-xs text-slate-500">Reviewer: {r.reviewerId}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DecisionModal
                open={modal === "APPROVE"}
                onClose={() => setModal(null)}
                onSubmit={handleReview}
                mode="APPROVE"
            />
            <DecisionModal
                open={modal === "REJECT"}
                onClose={() => setModal(null)}
                onSubmit={handleReview}
                mode="REJECT"
            />
        </div>
    );
}
