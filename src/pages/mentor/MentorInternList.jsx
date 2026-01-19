import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mentorApi } from "../../api/mentorApi";
import { toast } from "sonner";

export default function MentorInternList() {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        keyword: "",
        status: "",
    });

    useEffect(() => {
        loadInterns();
    }, []);

    const loadInterns = async () => {
        try {
            setLoading(true);
            const res = await mentorApi.getAssignedInterns(filters);
            setInterns(res.data.content || res.data || []);
        } catch (error) {
            console.error("Failed to load interns:", error);
            toast.error("Không thể tải danh sách thực tập sinh");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadInterns();
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
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Thực tập sinh của tôi
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Danh sách thực tập sinh được gán cho bạn hướng dẫn
                </p>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email..."
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                        className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang thực tập</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="DROPPED">Nghỉ</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Intern List */}
            {interns.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                    <p className="text-sm text-slate-600">
                        Chưa có thực tập sinh nào được gán cho bạn
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Thực tập sinh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Trường/Ngành
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Thời gian
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Hành động
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                        {interns.map((intern) => (
                            <tr key={intern.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-semibold text-slate-900">
                                            {intern.fullName || intern.name}
                                        </div>
                                        <div className="text-sm text-slate-600">{intern.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">
                                    <div>{intern.university || "-"}</div>
                                    <div className="text-slate-500">{intern.major || "-"}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700">
                                    <div>
                                        {intern.startDate
                                            ? new Date(intern.startDate).toLocaleDateString("vi-VN")
                                            : "-"}
                                    </div>
                                    <div className="text-slate-500">
                                        đến{" "}
                                        {intern.endDate
                                            ? new Date(intern.endDate).toLocaleDateString("vi-VN")
                                            : "-"}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            intern.status === "ACTIVE"
                                ? "bg-green-50 text-green-700"
                                : intern.status === "COMPLETED"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {intern.status === "ACTIVE"
                          ? "Đang thực tập"
                          : intern.status === "COMPLETED"
                              ? "Hoàn thành"
                              : "Nghỉ"}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        to={`/mentor/interns/${intern.id}`}
                                        className="inline-block rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
