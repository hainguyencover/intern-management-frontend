import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { internApi } from "../../api/internApi";
import StatusBadge from "../../components/StatusBadge";
import Pagination from "../../components/Pagination";
import { toast } from "sonner";

export default function InternList() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        university: "",
        major: "",
        status: "",
        q: "",
        page: 0,
        size: 10,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await internApi.search(filters);
            setData(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách thực tập sinh");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.page]);

    const handleSearch = () => {
        setFilters({ ...filters, page: 0 });
        fetchData();
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý thực tập sinh</h1>
                    <p className="mt-1 text-sm text-slate-600">Tìm kiếm, lọc và quản lý hồ sơ</p>
                </div>
                <Link
                    to="/hr/interns/new"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    + Thêm mới
                </Link>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border bg-white p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <input
                        className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Tìm kiếm (tên, email)..."
                        value={filters.q}
                        onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <input
                        className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Trường..."
                        value={filters.university}
                        onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                    />
                    <input
                        className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Ngành..."
                        value={filters.major}
                        onChange={(e) => setFilters({ ...filters, major: e.target.value })}
                    />
                    <button
                        onClick={handleSearch}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Họ tên</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Trường</th>
                        <th className="px-4 py-3">Ngành</th>
                        <th className="px-4 py-3">GPA</th>
                        <th className="px-4 py-3">Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {loading && (
                        <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-slate-600">
                                Đang tải...
                            </td>
                        </tr>
                    )}
                    {!loading && (!data?.content || data.content.length === 0) && (
                        <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-slate-600">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                    {!loading && data?.content?.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium">{item.id}</td>
                            <td className="px-4 py-3">{item.fullName}</td>
                            <td className="px-4 py-3">{item.email}</td>
                            <td className="px-4 py-3">{item.university || "-"}</td>
                            <td className="px-4 py-3">{item.major || "-"}</td>
                            <td className="px-4 py-3">{item.gpa || "-"}</td>
                            <td className="px-4 py-3">
                                <Link
                                    to={`/hr/interns/${item.id}`}
                                    className="mr-2 text-blue-600 hover:underline"
                                >
                                    Xem
                                </Link>
                                <Link
                                    to={`/hr/interns/${item.id}/edit`}
                                    className="text-slate-600 hover:underline"
                                >
                                    Sửa
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
