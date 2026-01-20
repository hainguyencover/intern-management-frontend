import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import Pagination from "../../components/Pagination";
import { toast } from "sonner";
import { hrListApplications } from "../../api/hrApplications";

const STATUS_OPTIONS = ["", "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"];

export default function ApplicationListPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: "SUBMITTED",
        q: "",
        page: 0,
        size: 10,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await hrListApplications(filters);
            setData(data);
        } catch (err) {
            toast.error("Không thể tải danh sách hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.page, filters.status]);

    const handleSearch = () => {
        setFilters({ ...filters, page: 0 });
        fetchData();
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-4">
            <div>
                <h1 className="text-2xl font-bold">Hồ sơ ứng tuyển</h1>
                <p className="mt-1 text-sm text-slate-600">Duyệt hoặc từ chối hồ sơ ứng viên</p>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 0 })}
                        className="h-10 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s || "ALL"}
                            </option>
                        ))}
                    </select>

                    <input
                        value={filters.q}
                        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="h-10 flex-1 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Tìm theo tên/email/vị trí..."
                    />

                    <button
                        onClick={handleSearch}
                        className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Tìm
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Ứng viên</th>
                            <th className="px-4 py-3">Vị trí</th>
                            <th className="px-4 py-3">Ngày nộp</th>
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
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            data?.content?.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium">{app.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-slate-900">{app.candidateName || "-"}</div>
                                        <div className="text-xs text-slate-600">{app.candidateEmail || "-"}</div>
                                    </td>
                                    <td className="px-4 py-3">{app.position || "-"}</td>
                                    <td className="px-4 py-3">
                                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/hr/applications/${app.id}`}
                                            className="text-sm font-semibold text-blue-600 hover:underline"
                                        >
                                            Chi tiết
                                        </Link>
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
        </div>
    );
}
