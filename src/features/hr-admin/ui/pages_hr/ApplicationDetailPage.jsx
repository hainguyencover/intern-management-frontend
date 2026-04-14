import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ChevronLeft,
    FileText,
    History,
    User,
    Mail,
    Calendar,
    StickyNote,
    BadgeCheck,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    ArrowUpRight
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import DecisionModal from "@/components/DecisionModal";
import { toast } from "sonner";
import { applicationApi } from "@/api/applicationApi.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Application Data...</p>
            </div>
        );
    }

    if (!app) {
        return (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <ShieldAlert className="h-16 w-16 text-rose-200" />
                <p className="text-slate-400 font-bold uppercase tracking-tight text-sm">Hồ sơ không tồn tại hoặc đã bị hủy.</p>
            </div>
        );
    }

    const canReview = app.status === "SUBMITTED";

    return (
        <div className="p-8 pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="h-8 px-2 rounded-lg text-slate-500 hover:text-slate-900 font-bold -ml-2"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" /> Applications Console
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                            <FileText className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                Review Application
                                <Badge variant="outline" className="h-6 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    REF: #{app.id}
                                </Badge>
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <StatusBadge status={app.status} />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    INTERN UUID: {app.internId || "NOT_ASSIGNED"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => setModal("REJECT")}
                        disabled={!canReview}
                        className="h-12 px-6 rounded-2xl font-black text-[11px] uppercase tracking-widest text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                        <XCircle className="mr-2 h-4 w-4" /> Từ chối
                    </Button>
                    <Button
                        onClick={() => setModal("APPROVE")}
                        disabled={!canReview}
                        className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Phê duyệt hồ sơ
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Application Context */}
                <Card className="lg:col-span-7 border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="p-8 border-b">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <BadgeCheck className="h-5 w-5 text-primary" /> CHI TIẾT ỨNG TUYỂN
                        </CardTitle>
                        <CardDescription className="italic font-medium">Bối cảnh và mục tiêu ứng tuyển của ứng viên.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 italic">
                                    <User className="h-3 w-3" /> Targeted Position
                                </span>
                                <p className="text-sm font-bold text-slate-900">{app.position || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 italic">
                                    <Calendar className="h-3 w-3" /> Submission Date
                                </span>
                                <p className="text-sm font-bold text-slate-900">
                                    {app.appliedAt ? new Date(app.appliedAt).toLocaleString('vi-VN') : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 italic ml-1">
                                <StickyNote className="h-3 w-3" /> Candidate Note / Cover Letter
                            </span>
                            <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100/50 text-sm font-medium text-slate-700 leading-relaxed italic">
                                {app.note || "Ứng viên không để lại lời nhắn kèm theo."}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Trail / Review History */}
                <Card className="lg:col-span-5 border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <CardHeader className="p-8 border-b bg-slate-900 text-white">
                        <CardTitle className="text-lg font-black flex items-center gap-2 tracking-tight">
                            <History className="h-5 w-5 text-primary" /> LỊCH SỬ THẨM ĐỊNH
                        </CardTitle>
                        <CardDescription className="text-slate-400 italic font-medium">Lưu vết các quyết định của bộ phận nhân sự.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {(!app.reviews || app.reviews.length === 0) && (
                                <div className="py-12 text-center space-y-4">
                                    <ShieldAlert className="mx-auto h-12 w-12 text-slate-100" />
                                    <p className="text-slate-400 font-bold uppercase tracking-tight text-xs italic">Chưa có tiến trình thẩm định.</p>
                                </div>
                            )}
                            {app.reviews?.map((r, idx) => (
                                <div key={idx} className="relative pl-8 pb-6 last:pb-0">
                                    {/* Timeline Line */}
                                    {idx !== app.reviews.length - 1 && (
                                        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-100" />
                                    )}
                                    {/* Timeline Node */}
                                    <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${r.decision === "APPROVE" ? "bg-emerald-500" : "bg-rose-500"
                                        }`}>
                                        {r.decision === "APPROVE" ? <CheckCircle2 className="h-2.5 w-2.5 text-white" /> : <XCircle className="h-2.5 w-2.5 text-white" />}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[11px] font-black uppercase tracking-widest ${r.decision === "APPROVE" ? "text-emerald-600" : "text-rose-600"
                                                }`}>
                                                {r.decision === "APPROVE" ? "APPROVED" : "REJECTED"}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {r.decidedAt ? new Date(r.decidedAt).toLocaleString('vi-VN') : "-"}
                                            </span>
                                        </div>
                                        {r.comment && (
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 italic">
                                                "{r.comment}"
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter text-wrap truncate max-w-full">
                                            <BadgeCheck className="h-3 w-3 shrink-0" /> REVIEWER ID: {r.reviewerId}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
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
