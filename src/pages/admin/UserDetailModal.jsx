import React, { useState } from 'react';
import { toast } from 'sonner';
import { adminUserApi } from "../../api/adminApi";

export default function UserDetailModal({ user, onClose, onSuccess }) {
    const [status, setStatus] = useState(user.status);
    const [roles, setRoles] = useState(user.roles || []);
    const [submitting, setSubmitting] = useState(false);
    const [resetPwd, setResetPwd] = useState(null);

    const roleOptions = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'HR', label: 'HR' },
        { value: 'MENTOR', label: 'Mentor' },
        { value: 'INTERN', label: 'Intern' },
    ];

    const isActive = status === 'ACTIVE';

    const handleRoleChange = (roleCode) => {
        setRoles(prev => {
            if (prev.includes(roleCode)) {
                return prev.filter(r => r !== roleCode);
            } else {
                return [...prev, roleCode];
            }
        });
    };

    const handleSaveRoles = async () => {
        try {
            setSubmitting(true);
            await adminUserApi.assignRoles(user.id, roles);
            toast.success("Cập nhật vai trò thành công");
            onSuccess(); // Refresh parent list
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật vai trò");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            if (isActive) {
                await adminUserApi.lockUser(user.id);
                setStatus('LOCKED');
                toast.success("Đã khóa tài khoản");
            } else {
                await adminUserApi.unlockUser(user.id);
                setStatus('ACTIVE');
                toast.success("Đã mở khóa tài khoản");
            }
            onSuccess();
        } catch (error) {
            toast.error("Lỗi khi thay đổi trạng thái");
        }
    };

    const handleResetPassword = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn đặt lại mật khẩu cho user này?")) return;
        try {
            const res = await adminUserApi.resetPassword(user.id);
            // res.data should be { password: "..." }
            const newPwd = res.data?.password;
            if (newPwd) {
                setResetPwd(newPwd);
                toast.success("Đặt lại mật khẩu thành công");
            } else {
                toast.success("Đã gửi email đặt lại mật khẩu");
            }
        } catch (error) {
            toast.error("Lỗi khi đặt lại mật khẩu");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Chi tiết người dùng</h2>
                        <p className="text-sm text-slate-500">ID: {user.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                {/* User Info */}
                <div className="mb-6 space-y-4">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold uppercase text-slate-500">Họ tên</label>
                                <div className="font-medium text-slate-900">{user.fullName || "N/A"}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
                                <div className="font-medium text-slate-900">{user.email}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-slate-500">Số điện thoại</label>
                                <div className="font-medium text-slate-900">{user.phone || "N/A"}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-slate-500">Ngày tạo</label>
                                <div className="font-medium text-slate-900">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "-"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Reset Result */}
                    {resetPwd && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                            <h4 className="mb-1 text-sm font-semibold text-emerald-800">Mật khẩu mới đã được tạo!</h4>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 rounded border border-emerald-200 bg-white px-3 py-2 text-lg font-bold tracking-wider text-emerald-700">
                                    {resetPwd}
                                </code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(resetPwd);
                                        toast.success("Copied!");
                                    }}
                                    className="rounded-lg bg-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-300"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-emerald-600">
                                Hãy lưu lại mật khẩu này ngay. Nó sẽ không được hiển thị lại.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="space-y-6">
                    {/* Role Management */}
                    <div>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">
                            Phân quyền
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {roleOptions.map((role) => (
                                <label
                                    key={role.value}
                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition ${roles.includes(role.value)
                                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                                            : 'border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={roles.includes(role.value)}
                                        onChange={() => handleRoleChange(role.value)}
                                    />
                                    <span className={`text-sm font-medium ${roles.includes(role.value) ? 'text-indigo-900' : 'text-slate-700'
                                        }`}>
                                        {role.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={handleSaveRoles}
                                disabled={submitting}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                            >
                                Lưu phân quyền
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Dangerous Actions */}
                    <div>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">
                            Hành động
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleResetPassword}
                                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            >
                                🔄 Đặt lại mật khẩu
                            </button>
                            <button
                                onClick={handleToggleStatus}
                                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${isActive
                                        ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300'
                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
                                    }`}
                            >
                                {isActive ? '🔒 Khóa tài khoản' : '🔓 Mở khóa'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
