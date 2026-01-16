// src/pages/admin/AuditLogDetailModal.jsx
import React from 'react';

export default function AuditLogDetailModal({ log, onClose }) {
    const formatJson = (jsonStr) => {
        if (!jsonStr) return null;
        try {
            return JSON.stringify(JSON.parse(jsonStr), null, 2);
        } catch {
            return jsonStr;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Chi tiết Audit Log</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem label="ID" value={log.id} />
                        <InfoItem label="Hành động" value={log.action} />
                        <InfoItem label="Người thực hiện" value={log.actorEmail} />
                        <InfoItem label="Loại" value={log.entityType} />
                        <InfoItem label="Entity ID" value={log.entityId} />
                        <InfoItem label="Trạng thái" value={log.status} />
                        <InfoItem label="IP" value={log.ipAddress} />
                        <InfoItem label="Thời gian" value={new Date(log.createdAt).toLocaleString('vi-VN')} />
                    </div>

                    {log.message && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-1">Thông báo</label>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                {log.message}
                            </div>
                        </div>
                    )}

                    {log.beforeJson && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-1">Before (JSON)</label>
                            <pre className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-xs text-green-400 overflow-x-auto">
                                {formatJson(log.beforeJson)}
                            </pre>
                        </div>
                    )}

                    {log.afterJson && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-1">After (JSON)</label>
                            <pre className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-xs text-green-400 overflow-x-auto">
                                {formatJson(log.afterJson)}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div>
            <div className="text-xs font-semibold text-slate-500">{label}</div>
            <div className="text-sm text-slate-900">{value || '-'}</div>
        </div>
    );
}

