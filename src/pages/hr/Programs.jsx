import React, { useEffect, useState } from "react";
import { programService } from "../../services/programService";

export default function Programs() {
    const [programs, setPrograms] = useState([]);
    const [form, setForm] = useState({
        name: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    const load = () => {
        programService
            .list()
            .then((res) => setPrograms(res.data))
            .catch(() => setPrograms([]));
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editingId) {
                await programService.update(editingId, form);
            } else {
                await programService.create(form);
            }
            setForm({ name: "", startDate: "", endDate: "", status: "ACTIVE" });
            setEditingId(null);
            load();
        } catch (err) {
            setError(err?.response?.data?.message || "Lưu chương trình thất bại");
        }
    };

    const edit = (p) => {
        setEditingId(p.id);
        setForm({
            name: p.name,
            startDate: p.startDate,
            endDate: p.endDate,
            status: p.status,
        });
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-xl font-bold">Quản lý chương trình thực tập</h1>

            {error && (
                <div className="mb-3 rounded bg-red-50 p-3 text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={submit} className="mb-6 space-y-3 rounded border bg-white p-4">
                <input
                    className="w-full rounded border px-3 py-2"
                    placeholder="Tên chương trình"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="date"
                        className="rounded border px-3 py-2"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                    <input
                        type="date"
                        className="rounded border px-3 py-2"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                </div>

                <button className="rounded bg-blue-600 px-4 py-2 text-white">
                    {editingId ? "Cập nhật" : "Tạo mới"}
                </button>
            </form>

            <div className="space-y-2">
                {programs.map((p) => (
                    <div key={p.id} className="flex justify-between rounded border bg-white p-3">
                        <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-sm text-slate-600">
                                {p.startDate} → {p.endDate} ({p.status})
                            </div>
                        </div>
                        <button
                            className="rounded border px-3 py-1 text-sm"
                            onClick={() => edit(p)}
                        >
                            Sửa
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
