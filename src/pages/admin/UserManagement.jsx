import React, { useEffect, useState } from "react";
import { toast } from "sonner";
// Use correctly named export from adminApi
import { adminUserApi } from "../../api/adminApi";
import CreateUserModal from "./CreateUserModal";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Filters
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                keyword,
                role: roleFilter,
            };
            const res = await adminUserApi.getUsers(params);

            // Expected response structure: res.data = { content: [], totalPages: 0, ... }
            const data = res.data;
            setUsers(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size]); // Reload when page/size changes

    const handleSearch = () => {
        setPage(0);
        fetchUsers();
    };

    // Callback for when user creation is successful
    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        fetchUsers(); // Refresh list
    };

    const handleLockUnlock = async (userId, currentStatus) => {
        // currentStatus is boolean active in previous code, but let's check what the API returns.
        // Based on AdminUsersPage.jsx, it seemed to look for 'ACTIVE' string, but UserManagement.jsx used boolean.
        // Let's assume the API returns boolean 'enabled' or 'active' or string status. 
        // Looking at AdminUsersPage.jsx provided earlier: user.status === 'ACTIVE'.
        // Looking at UserManagement.jsx provided earlier: user.active (boolean).
        // I will adhere to what the API likely returns. Usually Spring Identity uses 'enabled', 
        // but let's stick to the previous code's assumption or the other file's assumption.
        // AdminUsersPage.jsx used `user.status === 'ACTIVE'`.
        // UserManagement.jsx used `user.active` boolean.
        // I'll check the table rendering below.

        try {
            if (currentStatus) {
                await adminUserApi.lockUser(userId);
                toast.success("User locked successfully");
            } else {
                await adminUserApi.unlockUser(userId);
                toast.success("User unlocked successfully");
            }
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update user status");
        }
    }

    const handleResetPassword = async (userId) => {
        if (!window.confirm("Are you sure you want to reset this user's password?")) return;
        try {
            await adminUserApi.resetPassword(userId);
            toast.success("Password reset email sent (simulated)");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reset password");
        }
    }

    return (
        <div className="mx-auto w-full max-w-6xl p-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        User Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Create and manage system accounts (HR, Mentor, Intern).
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                    + Create User
                </button>
            </div>

            <div className="h-6" />

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-semibold text-slate-700">Search</label>
                    <input
                        type="text"
                        placeholder="Name or Email"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                </div>
                <div className="w-[150px]">
                    <label className="text-sm font-semibold text-slate-700">Role</label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    >
                        <option value="">All Roles</option>
                        <option value="HR">HR</option>
                        <option value="MENTOR">Mentor</option>
                        <option value="INTERN">Intern</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <button
                    onClick={handleSearch}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Apply
                </button>
            </div>

            <div className="h-6" />

            {/* Table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created At</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    // Determine active status safely
                                    // Supporting both boolean active or string status for safety
                                    const isActive = user.active === true || user.status === 'ACTIVE';

                                    return (
                                        <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-slate-900">{user.fullName || "N/A"}</div>
                                                <div className="text-slate-500 text-xs">{user.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {/* user.roles might be array of strings or objects. Handling array of strings mostly. */}
                                                {user.roles && user.roles.map(r => (
                                                    <span key={r} className="inline-block rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 mr-1">
                                                        {r}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                                    }`}>
                                                    {isActive ? "Active" : "Locked"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleResetPassword(user.id)}
                                                        className="text-xs font-medium text-slate-600 hover:text-slate-900"
                                                    >
                                                        Reset Pwd
                                                    </button>
                                                    <button
                                                        onClick={() => handleLockUnlock(user.id, isActive)}
                                                        className={`text-xs font-medium ${isActive ? "text-rose-600 hover:text-rose-800" : "text-emerald-600 hover:text-emerald-800"}`}
                                                    >
                                                        {isActive ? "Lock" : "Unlock"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
                    <div className="text-sm text-slate-500">
                        Page {page + 1} of {totalPages || 1}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-50 hover:bg-slate-50"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages - 1}
                            className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-50 hover:bg-slate-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}

        </div>
    );
}
