// src/pages/admin/CreateUserModal.jsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import {adminUserApi} from "../../api/adminApi.js";

export default function CreateUserModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        phone: '',
        roleCodes: [],
        departmentId: null,
        title: '',
        studentCode: '',
        university: '',
        major: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const roleOptions = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'HR', label: 'HR' },
        { value: 'MENTOR', label: 'Mentor' },
        { value: 'INTERN', label: 'Intern' },
    ];

    const handleRoleChange = (roleCode) => {
        setFormData(prev => {
            const roles = prev.roleCodes.includes(roleCode)
                ? prev.roleCodes.filter(r => r !== roleCode)
                : [...prev.roleCodes, roleCode];
            return { ...prev, roleCodes: roles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.roleCodes.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 vai trò');
            return;
        }

        try {
            setSubmitting(true);
            await adminUserApi.createUser(formData);
            toast.success('Tạo người dùng thành công');
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Không thể tạo người dùng');
        } finally {
            setSubmitting(false);
        }
    };

    const showMentorFields = formData.roleCodes.includes('MENTOR');
    const showInternFields = formData.roleCodes.includes('INTERN');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Tạo người dùng mới</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email & Full Name */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-900">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                placeholder="user@example.com"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-900">
                                Họ tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                placeholder="Nguyễn Văn A"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-900">Số điện thoại</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="0123456789"
                        />
                    </div>

                    {/* Roles */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-900">
                            Vai trò <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {roleOptions.map((role) => (
                                <label
                                    key={role.value}
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 cursor-pointer hover:bg-slate-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.roleCodes.includes(role.value)}
                                        onChange={() => handleRoleChange(role.value)}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-slate-900">{role.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Mentor Fields */}
                    {showMentorFields && (
                        <div className="rounded-xl border border-slate-200 p-4">
                            <h3 className="mb-3 text-sm font-semibold text-slate-900">Thông tin Mentor</h3>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-900">Chức danh</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                    placeholder="Senior Developer"
                                />
                            </div>
                        </div>
                    )}

                    {/* Intern Fields */}
                    {showInternFields && (
                        <div className="rounded-xl border border-slate-200 p-4">
                            <h3 className="mb-3 text-sm font-semibold text-slate-900">Thông tin Thực tập sinh</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-900">Mã sinh viên</label>
                                    <input
                                        type="text"
                                        value={formData.studentCode}
                                        onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-slate-900">Trường</label>
                                    <input
                                        type="text"
                                        value={formData.university}
                                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-semibold text-slate-900">Ngành học</label>
                                    <input
                                        type="text"
                                        value={formData.major}
                                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {submitting ? 'Đang tạo...' : 'Tạo người dùng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
