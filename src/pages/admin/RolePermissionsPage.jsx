// src/pages/admin/RolePermissionsPage.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {permissionApi} from "../../api/permissionApi.js";

export default function RolePermissionsPage() {
    const [roles] = useState([
        { id: 1, code: 'ADMIN', name: 'Administrator' },
        { id: 2, code: 'HR', name: 'Human Resources' },
        { id: 3, code: 'MENTOR', name: 'Mentor' },
        { id: 4, code: 'INTERN', name: 'Intern' },
    ]);

    const [selectedRoleId, setSelectedRoleId] = useState(1);
    const [allPermissions, setAllPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPermissions();
    }, []);

    useEffect(() => {
        if (selectedRoleId) {
            loadRolePermissions(selectedRoleId);
        }
    }, [selectedRoleId]);

    const loadPermissions = async () => {
        try {
            const response = await permissionApi.getAllPermissions();
            setAllPermissions(response.data);
        } catch (error) {
            toast.error('Không thể tải danh sách quyền');
        }
    };

    const loadRolePermissions = async (roleId) => {
        try {
            setLoading(true);
            const response = await permissionApi.getRolePermissions(roleId);
            const permissions = response.data.permissions || [];
            setRolePermissions(permissions);
            setSelectedPermissions(new Set(permissions.map(p => p.id)));
        } catch (error) {
            toast.error('Không thể tải quyền của vai trò');
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(permissionId)) {
                newSet.delete(permissionId);
            } else {
                newSet.add(permissionId);
            }
            return newSet;
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await permissionApi.updateRolePermissions(selectedRoleId, {
                permissionIds: Array.from(selectedPermissions),
            });
            toast.success('Đã cập nhật quyền thành công');
            loadRolePermissions(selectedRoleId);
        } catch (error) {
            toast.error('Không thể cập nhật quyền');
        } finally {
            setSaving(false);
        }
    };

    // Group permissions by module
    const permissionsByModule = allPermissions.reduce((acc, permission) => {
        const module = permission.module || 'OTHER';
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Phân quyền chi tiết</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Quản lý quyền truy cập cho từng vai trò
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Role Selector */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <h3 className="mb-3 text-sm font-semibold text-slate-900">Chọn vai trò</h3>
                        <div className="space-y-2">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                                        selectedRoleId === role.id
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {role.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Permission Matrix */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        {loading ? (
                            <div className="py-12 text-center text-sm text-slate-500">
                                Đang tải...
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(permissionsByModule).map(([module, permissions]) => (
                                    <div key={module}>
                                        <h4 className="mb-3 text-sm font-bold text-slate-900">
                                            {module}
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                            {permissions.map((permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 cursor-pointer hover:bg-slate-50"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissions.has(permission.id)}
                                                        onChange={() => handlePermissionToggle(permission.id)}
                                                        className="mt-1 rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-semibold text-slate-900">
                                                            {permission.name}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {permission.code}
                                                        </div>
                                                        {permission.description && (
                                                            <div className="mt-1 text-xs text-slate-500">
                                                                {permission.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Save Button */}
                                <div className="flex justify-end border-t border-slate-200 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
