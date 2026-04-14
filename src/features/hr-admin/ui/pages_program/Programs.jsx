import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { programService } from "@/services/programService";
import { toast } from "sonner";

const STATUS_MAP = {
    DRAFT: { label: "Nháp", color: "bg-gray-100 text-gray-700 border-gray-200" },
    ACTIVE: { label: "Đang diễn ra", color: "bg-green-100 text-green-700 border-green-200" },
    CLOSED: { label: "Đã kết thúc", color: "bg-red-100 text-red-700 border-red-200" },
};

export default function Programs() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        keyword: "",
        status: "",
        page: 0,
        size: 10,
    });
    const [totalPages, setTotalPages] = useState(0);

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await programService.list(filters);
            setPrograms(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            toast.error("Không thể tải danh sách chương trình");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [filters]);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa chương trình này?")) return;

        try {
            await programService.delete(id);
            toast.success("Đã xóa chương trình");
            fetchPrograms();
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể xóa chương trình");
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Chương trình thực tập</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Quản lý các chương trình thực tập theo phòng ban
                    </p>
                </div>
                <button
                    onClick={() => navigate("/hr/programs/new")}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Tạo chương trình mới
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        placeholder="Tìm theo tên chương trình..."
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value, page: 0 })}
                        className="h-10 flex-1 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 0 })}
                        className="h-10 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="DRAFT">Nháp</option>
                        <option value="ACTIVE">Đang diễn ra</option>
                        <option value="CLOSED">Đã kết thúc</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border bg-white">
                {loading ? (
                    <div className="p-8 text-center text-sm text-slate-600">Đang tải...</div>
                ) : programs.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-600">
                        Không có chương trình nào
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-600">
                            <tr>
                                <th className="px-4 py-3">Tên chương trình</th>
                                <th className="px-4 py-3">Phòng ban</th>
                                <th className="px-4 py-3">Thời gian</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3">Nhóm</th>
                                <th className="px-4 py-3 text-right">Hành động</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {programs.map((program) => {
                                const statusConfig = STATUS_MAP[program.status] || STATUS_MAP.DRAFT;
                                return (
                                    <tr key={program.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-slate-900">{program.name}</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">
                                            {program.departmentName || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">
                                            {program.startDate} → {program.endDate}
                                        </td>
                                        <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusConfig.color}`}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">
                                            {program.totalGroups || 0}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/hr/programs/${program.id}`)}
                                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                                                >
                                                    Chi tiết
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/hr/programs/${program.id}/edit`)}
                                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                                >
                                                    Sửa
                                                </button>
                                                {program.status === "DRAFT" && (
                                                    <button
                                                        onClick={() => handleDelete(program.id)}
                                                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                    >
                                                        Xóa
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <button
                                disabled={filters.page <= 0}
                                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                                ← Trước
                            </button>
                            <div className="text-sm text-slate-600">
                                Trang {filters.page + 1} / {totalPages || 1}
                            </div>
                            <button
                                disabled={filters.page + 1 >= totalPages}
                                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            >
                                Sau →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
