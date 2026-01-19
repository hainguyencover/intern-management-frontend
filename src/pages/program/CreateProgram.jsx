import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { programService } from "../../services/programService";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";

export default function CreateProgram() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        departmentId: "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axiosClient.get("/api/departments");
            setDepartments(response.data || []);
        } catch (error) {
            console.error("Failed to fetch departments:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.departmentId || !formData.name || !formData.startDate || !formData.endDate) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            toast.error("Ngày kết thúc phải sau ngày bắt đầu");
            return;
        }

        try {
            setLoading(true);
            await programService.create({
                ...formData,
                departmentId: parseInt(formData.departmentId),
            });
            toast.success("Đã tạo chương trình thành công");
            navigate("/hr/programs");
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể tạo chương trình");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-4">
            <div>
                <button
                    onClick={() => navigate("/hr/programs")}
                    className="mb-4 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    ← Quay lại
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Tạo chương trình thực tập mới</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Điền thông tin để tạo chương trình thực tập mới
                </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
                <div className="space-y-4">
                    {/* Department */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Phòng ban <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.departmentId}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            required
                        >
                            <option value="">-- Chọn phòng ban --</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Tên chương trình <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Ví dụ: Chương trình thực tập 2026"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            rows={4}
                            placeholder="Mô tả về chương trình thực tập..."
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Ngày bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Ngày kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="h-10 w-full rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/hr/programs")}
                        className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Đang tạo..." : "Tạo chương trình"}
                    </button>
                </div>
            </form>
        </div>
    );
}
