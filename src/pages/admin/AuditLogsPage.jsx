// src/pages/admin/AuditLogsPage.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AuditLogDetailModal from './AuditLogDetailModal';
import {auditLogApi} from "../../api/auditLogApi.js";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
    });
    const [filters, setFilters] = useState({
        action: '',
        entityType: '',
        fromDate: '',
        toDate: '',
    });
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        loadLogs();
    }, [pagination.page, pagination.size]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                size: pagination.size,
                sort: 'createdAt,desc',
                ...filters,
            };
            const response = await auditLogApi.getAuditLogs(params);
            const data = response.data;

            setLogs(data.content || []);
            setPagination(prev => ({
                ...prev,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
            }));
        } catch (error) {
            toast.error('Không thể tải audit logs');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, page: 0 }));
        loadLogs();
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('vi-VN');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Nhật ký hoạt động</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Theo dõi các thao tác quan trọng trong hệ thống
                </p>
            </div>

            {/* Filters */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <select
                        value={filters.action}
                        onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả hành động</option>
                        <option value="CREATE_USER">Tạo user</option>
                        <option value="UPDATE_USER">Cập nhật user</option>
                        <option value="LOCK_USER">Khóa user</option>
                        <option value="UNLOCK_USER">Mở khóa user</option>
                        <option value="UPDATE_ROLE_PERMISSIONS">Cập nhật quyền</option>
                        <option value="RUN_BACKUP">Chạy backup</option>
                    </select>

                    <select
                        value={filters.entityType}
                        onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="User">User</option>
                        <option value="Role">Role</option>
                        <option value="System">System</option>
                    </select>

                    <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Từ ngày"
                    />

                    <input
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Đến ngày"
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
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Thời gian</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Người thực hiện</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Hành động</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Loại</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">IP</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Chi tiết</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-sm text-slate-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-sm text-slate-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-900">
                                        {formatDateTime(log.createdAt)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900">
                                        {log.actorEmail || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                            <span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                                {log.action}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {log.entityType || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                log.status === 'SUCCESS'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {log.status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {log.ipAddress || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm">
                                        <button
                                            onClick={() => setSelectedLog(log)}
                                            className="text-slate-600 hover:text-slate-900"
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                    <div className="text-sm text-slate-600">
                        Hiển thị {logs.length} / {pagination.totalElements} logs
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                            disabled={pagination.page === 0}
                            className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 text-sm text-slate-600">
                            Trang {pagination.page + 1} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages - 1, prev.page + 1) }))}
                            disabled={pagination.page >= pagination.totalPages - 1}
                            className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <AuditLogDetailModal
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                />
            )}
        </div>
    );
}
