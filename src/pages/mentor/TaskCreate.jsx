import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { taskApi } from "../../api/taskApi";
import { mentorApi } from "../../api/mentorApi";
import { toast } from "sonner";

export default function TaskCreate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assigneeId: searchParams.get("assignee") || "",
        groupId: "",
        dueDate: "",
        priority: "MEDIUM",
    });

    useEffect(() => {
        loadInterns();
    }, []);

    const loadInterns = async () => {
        try {
            const res = await mentorApi.getAssignedInterns({});
            setInterns(res.data.content || res.data || []);

            // If assignee param exists, try to set group id automatically
            const assigneeId = searchParams.get("assignee");
            if (assigneeId && (res.data.content || res.data)) {
                const list = res.data.content || res.data;
                const selected = list.find(i => i.id === Number(assigneeId));
                if (selected && selected.programGroupId) {
                    setFormData(prev => ({ ...prev, groupId: selected.programGroupId }));
                }
            }
        } catch (error) {
            console.error("Failed to load interns:", error);
            toast.error("Không thể tải danh sách thực tập sinh");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };

            // If changing assignee, find their group
            if (name === "assigneeId") {
                const selected = interns.find(i => i.id === Number(value));
                if (selected) {
                    newData.groupId = selected.programGroupId || "";
                } else {
                    newData.groupId = "";
                }
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Vui lòng nhập tiêu đề task");
            return;
        }

        if (!formData.assigneeId) {
            toast.error("Vui lòng chọn thực tập sinh");
            return;
        }

        try {
            setLoading(true);
            await taskApi.createTask(formData);
            toast.success("Đã tạo task mới");
            navigate("/mentor/tasks");
        } catch (error) {
            console.error("Failed to create task:", error);
            toast.error(error.response?.data?.message || "Không thể tạo task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    ← Quay lại
                </button>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Tạo task mới
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Giao nhiệm vụ cho thực tập sinh
                </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="space-y-5">
                    {/* Tiêu đề */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Tiêu đề task <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="VD: Nghiên cứu tài liệu React..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            required
                        />
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Mô tả chi tiết
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Mô tả yêu cầu, deliverable, ghi chú..."
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    {/* Giao cho */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Giao cho thực tập sinh <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="assigneeId"
                            value={formData.assigneeId}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            required
                        >
                            <option value="">-- Chọn thực tập sinh --</option>
                            {interns.map((intern) => (
                                <option key={intern.id} value={intern.id}>
                                    {intern.fullName || intern.name} ({intern.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Deadline */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Deadline
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Độ ưu tiên */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Độ ưu tiên
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="LOW">Thấp</option>
                                <option value="MEDIUM">Trung bình</option>
                                <option value="HIGH">Cao</option>
                                <option value="URGENT">Khẩn cấp</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-10 flex-1 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Đang tạo..." : "Tạo task"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
