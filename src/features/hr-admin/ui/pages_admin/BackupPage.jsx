// src/pages/admin/BackupPage.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {backupApi} from "@/api/backupApi.js";

export default function BackupPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const response = await backupApi.getBackupHistory();
            setHistory(response.data);
        } catch (error) {
            toast.error('Không thể tải lịch sử backup');
        } finally {
            setLoading(false);
        }
    };

    const handleRunBackup = async () => {
        if (!confirm('Bạn có chắc muốn chạy backup ngay bây giờ?')) return;

        try {
            setRunning(true);
            await backupApi.runBackup();
            toast.success('Backup đang được thực hiện...');
            setTimeout(loadHistory, 2000);
        } catch (error) {
            toast.error('Không thể chạy backup');
        } finally {
            setRunning(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '-';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('vi-VN');
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return '-';
        const diff = new Date(end) - new Date(start);
        const seconds = Math.floor(diff / 1000);
        return `${seconds}s`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sao lưu dữ liệu</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Quản lý và theo dõi các bản backup hệ thống
                    </p>
                </div>
                <button
                    onClick={handleRunBackup}
                    disabled={running}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                    {running ? 'Đang backup...' : '▶ Chạy backup ngay'}
                </button>
            </div>

            {/* Info Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-3 text-sm font-bold text-slate-900">Thông tin</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard
                        label="Lịch tự động"
                        value="2:00 AM hàng ngày"
                        icon="🕒"
                    />
                    <InfoCard
                        label="Thời gian lưu trữ"
                        value="7 ngày"
                        icon="📅"
                    />
                    <InfoCard
                        label="Tổng số backup"
                        value={history.length}
                        icon="💾"
                    />
                </div>
            </div>

            {/* History Table */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="text-sm font-bold text-slate-900">Lịch sử backup</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Loại</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Bắt đầu</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Kết thúc</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Thời gian</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Kích thước</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-sm text-slate-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : history.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-sm text-slate-500">
                                    Chưa có backup nào
                                </td>
                            </tr>
                        ) : (
                            history.map((job) => (
                                <tr key={job.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-900">{job.id}</td>
                                    <td className="px-4 py-3 text-sm">
                                            <span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                                {job.type}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {formatDateTime(job.startedAt)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {formatDateTime(job.finishedAt)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {calculateDuration(job.startedAt, job.finishedAt)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {formatFileSize(job.fileSize)}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                job.status === 'SUCCESS'
                                                    ? 'bg-green-100 text-green-700'
                                                    : job.status === 'RUNNING'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-red-100 text-red-700'
                                            }`}>
                                                {job.status}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ label, value, icon }) {
    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-2 text-2xl">{icon}</div>
            <div className="text-xs font-semibold text-slate-500">{label}</div>
            <div className="text-lg font-bold text-slate-900">{value}</div>
        </div>
    );
}
