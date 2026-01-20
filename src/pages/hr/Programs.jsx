import React, { useEffect, useState } from "react";
import { programService } from "../../services/programService";
import { departmentApi } from "../../api/departmentApi";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

export default function Programs() {
    const [programs, setPrograms] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [form, setForm] = useState({
        name: "",
        departmentId: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const res = await programService.list({ size: 100 });
            setPrograms(res.data.content || []);
        } catch (err) {
            toast.error("Không thể tải danh sách chương trình");
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await departmentApi.getAll();
            setDepartments(res.data || []);
        } catch (err) {
            console.error("Failed to load departments", err);
        }
    };

    useEffect(() => {
        fetchPrograms();
        fetchDepartments();
    }, []);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editingProgram) {
                await programService.update(editingProgram.id, form);
                toast.success("Cập nhật chương trình thành công");
            } else {
                await programService.create(form);
                toast.success("Tạo chương trình thành công");
            }
            setShowModal(false);
            resetForm();
            await fetchPrograms();
        } catch (err) {
            toast.error(editingProgram ? "Cập nhật thất bại" : "Tạo chương trình thất bại");
        }
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditingProgram(p);
        setForm({
            name: p.name,
            departmentId: p.departmentId || "",
            description: p.description || "",
            startDate: p.startDate,
            endDate: p.endDate,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProgram(null);
        setForm({ name: "", departmentId: "", description: "", startDate: "", endDate: "" });
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Chương trình thực tập</h1>
                <button
                    onClick={openCreate}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    + Tạo chương trình
                </button>
            </div>

            {loading ? (
                <div className="py-12 text-center text-sm text-slate-600">Đang tải...</div>
            ) : programs.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-600">Chưa có chương trình nào</div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 font-semibold text-slate-900">
                            <tr>
                                <th className="px-4 py-3">Tên chương trình</th>
                                <th className="px-4 py-3">Khoa / Phòng ban</th>
                                <th className="px-4 py-3">Mô tả</th>
                                <th className="px-4 py-3">Thời gian</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {programs.map((p) => {
                                const dept = departments.find(d => d.id === p.departmentId);
                                return (
                                    <tr key={p.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{dept?.name || p.departmentId}</td>
                                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={p.description}>
                                            {p.description || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                            {p.startDate} - {p.endDate}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                                title="Sửa"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-semibold">
                            {editingProgram ? "Cập nhật chương trình" : "Tạo chương trình mới"}
                        </h3>
                        <form onSubmit={handleCreateOrUpdate} className="mt-4 space-y-3">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Tên chương trình *</label>
                                <input
                                    required
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Phòng ban (Department)</label>
                                <select
                                    required
                                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    value={form.departmentId}
                                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                                >
                                    <option value="">-- Chọn khoa/phòng ban --</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name} ({dept.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Mô tả</label>
                                <textarea
                                    rows={3}
                                    className="mt-1 w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                        value={form.startDate}
                                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                        value={form.endDate}
                                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    {editingProgram ? "Cập nhật" : "Tạo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
