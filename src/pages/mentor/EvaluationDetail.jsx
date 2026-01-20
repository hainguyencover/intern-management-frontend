import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { evaluationApi } from "../../api/evaluationApi";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EvaluationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvaluation();
    }, [id]);

    const loadEvaluation = async () => {
        try {
            setLoading(true);
            const res = await evaluationApi.getEvaluationDetail(id);
            setEvaluation(res.data);
        } catch (error) {
            console.error("Failed to load evaluation detail:", error);
            toast.error("Không thể tải chi tiết đánh giá");
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (score) => {
        if (score >= 9) return "text-emerald-600 bg-emerald-50 border-emerald-100";
        if (score >= 7) return "text-blue-600 bg-blue-50 border-blue-100";
        if (score >= 5) return "text-yellow-600 bg-yellow-50 border-yellow-100";
        return "text-red-600 bg-red-50 border-red-100";
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-slate-600">Đang tải...</div>
            </div>
        );
    }

    if (!evaluation) {
        return (
            <div className="flex h-96 items-center justify-center flex-col gap-4">
                <div className="text-slate-600">Không tìm thấy đánh giá</div>
                <button
                    onClick={() => navigate("/mentor/evaluations")}
                    className="text-blue-600 font-bold hover:underline"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/mentor/evaluations")}
                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition"
                >
                    <span className="text-slate-600 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform">←</span>
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Chi tiết đánh giá
                    </h1>
                    <p className="text-sm text-slate-600">
                        Xem chi tiết kết quả đánh giá thực tập sinh
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Card: Summary */}
                <div className="md:col-span-1 space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl font-bold text-slate-700">
                                {evaluation.internName ? evaluation.internName.charAt(0) : "I"}
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">{evaluation.internName}</h3>
                            <p className="text-sm text-slate-500">ID: {evaluation.internId}</p>

                            <div className="mt-6 flex justify-center">
                                <div className={`flex flex-col items-center justify-center h-24 w-24 rounded-full border-4 ${getGradeColor(evaluation.score).replace('bg-', 'border-').split(' ')[2] || 'border-slate-200'}`}>
                                    <span className={`text-3xl font-extrabold ${getGradeColor(evaluation.score).split(' ')[0]}`}>
                                        {evaluation.score}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase text-slate-400">Điểm số</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Kỳ đánh giá</span>
                                <span className="font-bold text-slate-900">
                                    {evaluation.period === "WEEKLY" ? "Tuần" :
                                        evaluation.period === "MIDTERM" ? "Giữa kỳ" : "Cuối kỳ"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Ngày tạo</span>
                                <span className="font-bold text-slate-900">
                                    {evaluation.createdAt ? new Date(evaluation.createdAt).toLocaleDateString("vi-VN") : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Card: Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-base font-bold text-slate-900">Chi tiết điểm thành phần</h3>

                        {/* Fake visualization for details as BE currently doesn't return breakdown, 
                            but keeping UI structure ready or showing generic message if data missing */}
                        <div className="space-y-4">
                            {/* Assuming for now we only have total score, but we can display the comment prominently */}
                            <div className="rounded-xl bg-slate-50 p-4">
                                <div className="mb-2 text-sm font-bold text-slate-700">Nhận xét của Mentor</div>
                                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                                    {evaluation.comment || "Không có nhận xét chi tiết."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
