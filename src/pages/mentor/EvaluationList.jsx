import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { evaluationApi } from "../../api/evaluationApi";
import { toast } from "sonner";

export default function EvaluationList() {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        period: "",
    });

    useEffect(() => {
        loadEvaluations();
    }, []);

    const loadEvaluations = async () => {
        try {
            setLoading(true);
            const res = await evaluationApi.getMyEvaluations(filters);
            setEvaluations(res.data.content || res.data || []);
        } catch (error) {
            console.error("Failed to load evaluations:", error);
            toast.error("Không thể tải danh sách đánh giá");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadEvaluations();
    };

    const getGradeColor = (score) => {
        if (score >= 9) return "text-green-600";
        if (score >= 7) return "text-blue-600";
        if (score >= 5) return "text-yellow-600";
        return "text-red-600";
    };

    const getGradeLabel = (score) => {
        if (score >= 9) return "Xuất sắc";
        if (score >= 7) return "Tốt";
        if (score >= 5) return "Khá";
        return "Cần cải thiện";
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-slate-600">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Đánh giá đã tạo
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Quản lý đánh giá thực tập sinh
                    </p>
                </div>
                <Link
                    to="/mentor/evaluations/new"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Tạo đánh giá mới
                </Link>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                    <select
                        value={filters.period}
                        onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                        className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Tất cả loại đánh giá</option>
                        <option value="WEEKLY">Tuần</option>
                        <option value="MIDTERM">Giữa kỳ</option>
                        <option value="FINAL">Cuối kỳ</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* Danh sách */}
            {evaluations.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                    <p className="text-sm text-slate-600">Chưa có đánh giá nào</p>
                    <Link
                        to="/mentor/evaluations/new"
                        className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Tạo đánh giá đầu tiên
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {evaluations.map((evaluation) => (
                        <div
                            key={evaluation.id}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900">
                                            {evaluation.internName || `Intern ID: ${evaluation.internId}`}
                                        </h3>
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                            {evaluation.period === "WEEKLY"
                                                ? "Tuần"
                                                : evaluation.period === "MIDTERM"
                                                    ? "Giữa kỳ"
                                                    : "Cuối kỳ"}
                                        </span>
                                    </div>

                                    <div className="mt-3 text-sm text-slate-600">
                                        Ngày đánh giá:{" "}
                                        {evaluation.evaluationDate
                                            ? new Date(evaluation.evaluationDate).toLocaleDateString("vi-VN")
                                            : new Date(evaluation.createdAt).toLocaleDateString("vi-VN")}
                                    </div>

                                    <div className="mt-4 flex items-center gap-4">
                                        <div
                                            className={`text-3xl font-bold ${getGradeColor(
                                                evaluation.score || 0
                                            )}`}
                                        >
                                            {evaluation.score !== null ? evaluation.score : "N/A"}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {getGradeLabel(evaluation.score || 0)}
                                        </div>
                                    </div>

                                    <div className="h-12 w-px bg-slate-200" />

                                    <div className="flex-1 space-y-1 text-xs">
                                        {evaluation.skills && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Kỹ năng:</span>
                                                <span className="font-semibold">{evaluation.skills}</span>
                                            </div>
                                        )}
                                        {evaluation.attitude && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Thái độ:</span>
                                                <span className="font-semibold">{evaluation.attitude}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {evaluation.comment && (
                                    <div className="mt-4 rounded-lg bg-slate-50 p-3">
                                        <p className="text-sm text-slate-700 line-clamp-2">
                                            {evaluation.comment}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
