import { useEffect, useState } from "react";
import { listDepartments } from "@/api/departmentApi.js";

export default function ProgramForm({ initialValue, onSubmit, submitting }) {
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState({
        departmentId: "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        ...initialValue,
    });

    useEffect(() => {
        listDepartments().then(setDepartments).catch(() => setDepartments([]));
    }, []);

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const submit = (e) => {
        e.preventDefault();
        onSubmit({
            departmentId: Number(form.departmentId),
            name: form.name,
            description: form.description,
            startDate: form.startDate || null,
            endDate: form.endDate || null,
        });
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Tên chương trình
                </label>
                <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Ví dụ: Thực tập sinh Java Mùa Hè 2024"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
            </div>

            <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Phòng ban
                </label>
                <select
                    required
                    value={form.departmentId}
                    onChange={(e) => set("departmentId", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                    <option value="" disabled>-- Chọn phòng ban --</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>

            <div className="col-span-2 md:col-span-1">
                {/* Empty spacer or used for layout balance if needed, or we can make Department full width if preferred.
                     Keeping it half width for now as Dates will take up space too.
                 */}
            </div>

            <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Ngày bắt đầu
                </label>
                <input
                    type="date"
                    value={form.startDate || ""}
                    onChange={(e) => set("startDate", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
            </div>

            <div className="col-span-2 md:col-span-1">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Ngày kết thúc
                </label>
                <input
                    type="date"
                    value={form.endDate || ""}
                    onChange={(e) => set("endDate", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
            </div>

            <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Mô tả
                </label>
                <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Mô tả chi tiết về chương trình thực tập..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
            </div>

            <div className="col-span-2 flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                    Hủy
                </button>
                <button
                    disabled={submitting}
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                >
                    {submitting ? "Đang lưu..." : "Lưu chương trình"}
                </button>
            </div>
        </form>
    );
}
