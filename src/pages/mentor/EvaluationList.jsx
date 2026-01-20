import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { evaluationApi } from "../../api/evaluationApi";
import { toast } from "sonner";

export default function EvaluationList() {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        period: "",
        keyword: "",
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
    });

    useEffect(() => {
        loadEvaluations(0);
    }, []);

    const loadEvaluations = async (pageIndex = 0) => {
        try {
            setLoading(true);
            const params = {
                page: pageIndex,
                size: pagination.size,
                ...(filters.period ? { period: filters.period } : {}),
                ...(filters.keyword ? { keyword: filters.keyword } : {}),
            };
            const res = await evaluationApi.getMyEvaluations(params);

            // Handle Page response
            if (res.data && res.data.content) {
                setEvaluations(res.data.content);
                setPagination({
                    page: res.data.number,
                    size: res.data.size,
                    totalPages: res.data.totalPages,
                    totalElements: res.data.totalElements,
                });
            } else {
                setEvaluations(res.data || []);
            }

        } catch (error) {
            console.error("Failed to load evaluations:", error);
            toast.error("Không thể tải danh sách đánh giá");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadEvaluations(0);
    };

    const getGradeColor = (score) => {
        if (score >= 9) return "text-emerald-600 bg-emerald-50 border-emerald-100";
        if (score >= 7) return "text-blue-600 bg-blue-50 border-blue-100";
        if (score >= 5) return "text-yellow-600 bg-yellow-50 border-yellow-100";
        return "text-red-600 bg-red-50 border-red-100";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Đánh giá đã tạo
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Quản lý và theo dõi kết quả đánh giá thực tập sinh.
                    </p>
                </div>
                <Link
                    to="/mentor/evaluations/new"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm"
                >
                    + Tạo đánh giá mới
                </Link>
            </div>

            {/* Filters */}
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4">
                <div className="md:col-span-2">
                    <div className="text-xs font-bold text-slate-600 mb-1">Tìm kiếm</div>
                    <input
                        type="text"
                        placeholder="Tên intern hoặc mã sinh viên..."
                        value={filters.keyword}
                        onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>
                <div>
                    <div className="text-xs font-bold text-slate-600 mb-1">Kỳ đánh giá</div>
                    <select
                        value={filters.period}
                        onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                    >
                        <option value="">Tất cả</option>
                        <option value="WEEKLY">Tuần</option>
                        <option value="MIDTERM">Giữa kỳ</option>
                        <option value="FINAL">Cuối kỳ</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleSearch}
                        className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-200 transition"
                    >
                        Lọc & Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Thực tập sinh</th>
                                <th className="px-6 py-4">Kỳ đánh giá</th>
                                <th className="px-6 py-4">Điểm số</th>
                                <th className="px-6 py-4">Nhận xét</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                                <th className="px-6 py-4 text-right">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : evaluations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        Chưa có đánh giá nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                evaluations.map((evaluation) => (
                                    <tr key={evaluation.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">
                                                {evaluation.internName || "N/A"}
                                            </div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                                                ID: {evaluation.internId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                {evaluation.period === "WEEKLY"
                                                    ? "Tuần"
                                                    : evaluation.period === "MIDTERM"
                                                        ? "Giữa kỳ"
                                                        : "Cuối kỳ"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg text-sm font-extrabold border ${getGradeColor(evaluation.score || 0)}`}>
                                                {evaluation.score !== null ? evaluation.score : "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs truncate text-slate-600" title={evaluation.comment}>
                                                {evaluation.comment || "Không có nhận xét"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {evaluation.createdAt ? new Date(evaluation.createdAt).toLocaleDateString('vi-VN') : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/mentor/evaluations/${evaluation.id}`}
                                                className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
                                            >
                                                Xem
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50">
                        <div className="text-sm text-slate-600">
                            Trang <span className="font-bold text-slate-900">{pagination.page + 1}</span> / {pagination.totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => loadEvaluations(pagination.page - 1)}
                                disabled={pagination.page === 0}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                Trước
                            </button>
                            <button
                                onClick={() => loadEvaluations(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages - 1}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
