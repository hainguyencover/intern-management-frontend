import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { toast } from "sonner";
import { adminUserApi } from "../../api/adminApi";
import { mentorApi } from "../../api/mentorApi";

// If there is no specific mentorApi for HR, we might use adminUserApi with role filter
// OR we should check if there is a mentorApi. based on file list, there is 'mentor' dir in pages but maybe not in api.
// src/api has: internApi, documentApi, programGroupService...
// Let's assume we use adminUserApi.getUsers({ role: 'MENTOR' }) for now.

import CreateMentor from "./CreateMentor";

export default function MentorList() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        role: "MENTOR",
        keyword: "",
        page: 0,
        size: 10,
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await mentorApi.list(filters);
            setData(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách Mentor");
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
        <div className="mx-auto w-full max-w-6xl space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Mentor</h1>
                    <p className="mt-1 text-sm text-slate-600">Danh sách giảng viên hướng dẫn</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Thêm Mentor
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border bg-white p-4">
                <div className="flex gap-3">
                    <input
                        className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="Tìm kiếm Mentor (tên, email)..."
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                            <th className="px-4 py-3">SL Intern</th>
                            {/* Department? */}
                            <th className="px-4 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-slate-600">
                                    Đang tải...
                                </td>
                            </tr>
                        )}
                        {!loading && (!data?.content || data.content.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-slate-600">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                        {!loading && data?.content?.map((item) => {
                            // MentorResponse does not have active/status field if simpler.
                            // But usually backend response should consistent. 
                            // MentorResponse has userId, email, fullName, title, internCount.
                            // Status is on User entity. MentorResponse doesn't have status field?
                            // Let's check MentorResponse.java
                            // It does NOT have status. So we can't show Active/Locked here unless we add it. I'll omit status column for now unless needed.
                            return (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium">{item.id}</td>
                                    <td className="px-4 py-3">
                                        <div>{item.fullName}</div>
                                        <div className="text-xs text-slate-500">{item.title}</div>
                                    </td>
                                    <td className="px-4 py-3">{item.email}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                            {item.internCount || 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/hr/mentors/${item.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Chi tiết & Gán Intern
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <Pagination
                    current={filters.page}
                    total={data?.totalElements || 0}
                    pageSize={filters.size}
                    onChange={(page) => setFilters({ ...filters, page })}
                />
            </div>

            {isCreateModalOpen && (
                <CreateMentor
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}
