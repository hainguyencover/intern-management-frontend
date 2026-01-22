import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminUserApi } from "../../api/adminApi";
import { departmentApi } from "../../api/departmentApi";

export default function CreateMentor({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        departmentId: "",
        title: ""
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAll();
            setDepartments(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách phòng ban");
        }
    };

    const handleCreateMentor = async () => {
        if (!form.fullName || !form.email || !form.password) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        try {
            setLoading(true);
            // Create New User + Mentor Profile (All in one)
            await adminUserApi.createUser({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                roleCodes: ["MENTOR"],
                departmentId: form.departmentId || null,
                title: form.title || null
            });

            toast.success("Đã thêm mới Mentor thành công");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Tạo Mentor thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>

                <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Thêm Mentor Mới
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                            <input
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mt-1"
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                                placeholder="Nhập họ tên..."
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">Email <span className="text-red-500">*</span></label>
                            <input
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mt-1"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="example@email.com"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">Mật khẩu <span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mt-1"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Phòng ban</label>
                            <select
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mt-1"
                                value={form.departmentId}
                                onChange={e => setForm({ ...form, departmentId: e.target.value })}
                            >
                                <option value="">-- Chọn phòng ban --</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Chức danh</label>
                            <input
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mt-1"
                                placeholder="Ví dụ: Senior Developer, Tech Lead..."
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreateMentor}
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Đang xử lý..." : "Tạo mới"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
