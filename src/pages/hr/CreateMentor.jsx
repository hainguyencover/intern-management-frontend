import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminUserApi } from "../../api/adminApi";
import { mentorApi } from "../../api/mentorApi";

import { departmentApi } from "../../api/departmentApi";

export default function CreateMentor({ onClose, onSuccess }) {
    const [step, setStep] = useState(1); // 1: Select User, 2: Mentor Details
    const [loading, setLoading] = useState(false);
    // User Selection State
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ fullName: "", email: "", password: "" });

    // Mentor Details State
    const [mentorForm, setMentorForm] = useState({ title: "", departmentId: "" });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        // Fetch users for selection (role USER or just active users not yet Mentors?)
        // For simplicity, search all users
        fetchUsers();
        fetchDepartments();
    }, []);

    const fetchUsers = async (keyword = "") => {
        try {
            const res = await adminUserApi.getUsers({ keyword, size: 10 });
            setUsers(res.data.content || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAll();
            setDepartments(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách phòng ban");
        }
    };

    const handleNextStep = () => {
        if (isNewUser) {
            if (!newUserForm.fullName || !newUserForm.email || !newUserForm.password) {
                toast.error("Vui lòng điền đầy đủ thông tin");
                return;
            }
        } else {
            if (!selectedUser) {
                toast.error("Vui lòng chọn tài khoản");
                return;
            }
        }
        setStep(2);
    };

    const handleCreateMentor = async () => {
        try {
            setLoading(true);

            if (isNewUser) {
                // Case 1: Create New User + Mentor Profile (All in one)
                await adminUserApi.createUser({
                    ...newUserForm,
                    roleCodes: ["MENTOR"],
                    departmentId: mentorForm.departmentId,
                    title: mentorForm.title
                });
            } else {
                // Case 2: Existing User -> Create/Assign Mentor Profile
                // First ensure user has MENTOR role if not already (optional but good practice)
                // calls mentorApi.create which assigns role + creates profile
                await mentorApi.create({
                    userId: selectedUser.id,
                    departmentId: mentorForm.departmentId,
                    title: mentorForm.title
                });
            }

            toast.success("Đã thêm hồ sơ Mentor thành công");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Tạo hồ sơ Mentor thất bại");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {step === 1 ? "Bước 1: Chọn hoặc Tạo Tài khoản" : "Bước 2: Thông tin Mentor"}
                </h3>

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="flex gap-4 border-b border-slate-100 pb-2">
                            <button
                                className={`pb-2 text-sm font-semibold ${!isNewUser ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500"}`}
                                onClick={() => setIsNewUser(false)}
                            >
                                Chọn tài khoản có sẵn
                            </button>
                            <button
                                className={`pb-2 text-sm font-semibold ${isNewUser ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500"}`}
                                onClick={() => setIsNewUser(true)}
                            >
                                Tạo tài khoản mới
                            </button>
                        </div>

                        {!isNewUser ? (
                            <div className="space-y-3">
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    placeholder="Tìm kiếm user theo email/tên..."
                                    value={searchUser}
                                    onChange={(e) => {
                                        setSearchUser(e.target.value);
                                        fetchUsers(e.target.value);
                                    }}
                                />
                                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
                                    {users.map(u => (
                                        <div
                                            key={u.id}
                                            onClick={() => setSelectedUser(u)}
                                            className={`cursor-pointer rounded-lg p-2 text-sm flex justify-between ${selectedUser?.id === u.id ? "bg-blue-50 border-blue-200 border" : "hover:bg-slate-50"}`}
                                        >
                                            <div>
                                                <div className="font-semibold">{u.fullName}</div>
                                                <div className="text-xs text-slate-500">{u.email}</div>
                                            </div>
                                            <div className="text-xs text-slate-400">{u.role}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end pt-2 gap-2">
                                    <button
                                        onClick={onClose}
                                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        disabled={!selectedUser}
                                        onClick={handleNextStep}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        value={newUserForm.fullName}
                                        onChange={e => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Email</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        value={newUserForm.email}
                                        onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
                                    <input
                                        type="password"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        value={newUserForm.password}
                                        onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end pt-2 gap-2">
                                    <button
                                        onClick={onClose}
                                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        disabled={loading}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                            Đang thiết lập hồ sơ cho: <strong>{isNewUser ? newUserForm.fullName : selectedUser?.fullName}</strong> ({isNewUser ? newUserForm.email : selectedUser?.email})
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Phòng ban</label>
                            <select
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                value={mentorForm.departmentId}
                                onChange={e => setMentorForm({ ...mentorForm, departmentId: e.target.value })}
                            >
                                <option value="">-- Chọn phòng ban --</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Chức danh</label>
                            <input
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                placeholder="Ví dụ: Senior Developer, Tech Lead..."
                                value={mentorForm.title}
                                onChange={e => setMentorForm({ ...mentorForm, title: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={onClose}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleCreateMentor}
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Đang xử lý..." : "Hoàn tất"}
                            </button>
                        </div>
                    </div>
                )}
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
            </div>
        </div>
    );
}
