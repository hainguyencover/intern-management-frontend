// src/pages/admin/AdminUsersPage.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {adminUserApi} from "@/features/hr-admin/api/adminApi.js";
import CreateUserModal from "@/features/hr-admin/ui/pages_admin/CreateUserModal.jsx";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
    });
    const [filters, setFilters] = useState({
        keyword: '',
        role: '',
        status: '',
    });
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [pagination.page, pagination.size]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                size: pagination.size,
                ...filters,
            };
            const response = await adminUserApi.getUsers(params);
            const data = response.data;

            setUsers(data.content || []);
            setPagination(prev => ({
                ...prev,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
            }));
        } catch (error) {
            toast.error('Không thể tải danh sách người dùng');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, page: 0 }));
        loadUsers();
    };

    const handleLockUser = async (userId) => {
        if (!confirm('Bạn có chắc muốn khóa người dùng này?')) return;

        try {
            await adminUserApi.lockUser(userId);
            toast.success('Đã khóa người dùng');
            loadUsers();
        } catch (error) {
            toast.error('Không thể khóa người dùng');
        }
    };

    const handleUnlockUser = async (userId) => {
        try {
            await adminUserApi.unlockUser(userId);
            toast.success('Đã mở khóa người dùng');
            loadUsers();
        } catch (error) {
            toast.error('Không thể mở khóa người dùng');
        }
    };

    const handleResetPassword = async (userId) => {
        if (!confirm('Bạn có chắc muốn reset mật khẩu người dùng này?')) return;

        try {
            await adminUserApi.resetPassword(userId);
            toast.success('Đã reset mật khẩu (mật khẩu mới sẽ được gửi qua email)');
        } catch (error) {
            toast.error('Không thể reset mật khẩu');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý người dùng</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Tạo và quản lý tài khoản cho HR, Mentor và Thực tập sinh
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    + Tạo người dùng
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="ADMIN">Admin</option>
                        <option value="HR">HR</option>
                        <option value="MENTOR">Mentor</option>
                        <option value="INTERN">Intern</option>
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Active</option>
                        <option value="LOCKED">Locked</option>
                    </select>
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
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Họ tên</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Vai trò</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Trạng thái</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm text-slate-900">{user.id}</td>
                                    <td className="px-4 py-3 text-sm text-slate-900">{user.email}</td>
                                    <td className="px-4 py-3 text-sm text-slate-900">{user.fullName}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {user.roles?.map(role => (
                                            <span
                                                key={role}
                                                className="mr-1 inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                                            >
                                                    {role}
                                                </span>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                user.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {user.status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm">
                                        <div className="flex justify-end gap-2">
                                            {user.status === 'ACTIVE' ? (
                                                <button
                                                    onClick={() => handleLockUser(user.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Khóa
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnlockUser(user.id)}
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    Mở khóa
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleResetPassword(user.id)}
                                                className="text-slate-600 hover:text-slate-700"
                                            >
                                                Reset PW
                                            </button>
                                        </div>
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
                        Hiển thị {users.length} / {pagination.totalElements} người dùng
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

            {/* Create Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        loadUsers();
                    }}
                />
            )}
        </div>
    );
}
