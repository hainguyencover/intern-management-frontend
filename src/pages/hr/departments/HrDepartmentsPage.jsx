import React, { useEffect, useState } from "react";
import { departmentApi } from "../../../api/departmentApi";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function HrDepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [formData, setFormData] = useState({ code: "", name: "", description: "" });

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await departmentApi.getAll();
            setDepartments(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách phòng ban");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await departmentApi.update(editingDept.id, formData);
                toast.success("Cập nhật phòng ban thành công");
            } else {
                await departmentApi.create(formData);
                toast.success("Thêm phòng ban thành công");
            }
            setModalOpen(false);
            fetchDepartments();
            resetForm();
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) return;
        try {
            await departmentApi.delete(id);
            toast.success("Xóa phòng ban thành công");
            fetchDepartments();
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể xóa phòng ban");
        }
    };

    const openEdit = (dept) => {
        setEditingDept(dept);
        setFormData({
            code: dept.code,
            name: dept.name,
            description: dept.description || ""
        });
        setModalOpen(true);
    };

    const resetForm = () => {
        setEditingDept(null);
        setFormData({ code: "", name: "", description: "" });
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Phòng Ban</h1>
                    <p className="mt-1 text-sm text-slate-600">Danh sách các phòng ban trong công ty</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Thêm mới
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Mã</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Tên Phòng Ban</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Mô tả</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                                    Đang tải...
                                </td>
                            </tr>
                        )}
                        {!loading && departments.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                                    Chưa có phòng ban nào
                                </td>
                            </tr>
                        )}
                        {departments.map((dept) => (
                            <tr key={dept.id} className="hover:bg-slate-50">
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{dept.code}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{dept.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{dept.description}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => openEdit(dept)}
                                        className="mr-3 text-indigo-600 hover:text-indigo-900"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-slate-900">
                            {editingDept ? "Cập nhật phòng ban" : "Thêm phòng ban mới"}
                        </h3>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Mã phòng ban *</label>
                                <input
                                    required
                                    type="text"
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Tên phòng ban *</label>
                                <input
                                    required
                                    type="text"
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Mô tả</label>
                                <textarea
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    {editingDept ? "Cập nhật" : "Tạo mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
