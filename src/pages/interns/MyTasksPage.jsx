import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { taskApi } from "../../api/taskApi";

function Modal({ open, title, children, onClose }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 p-4">
                    <div className="text-base font-extrabold text-slate-900">{title}</div>
                    <button
                        onClick={onClose}
                        className="rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Đóng
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default function MyTasksPage() {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);

    const [openUpdate, setOpenUpdate] = useState(false);
    const [selected, setSelected] = useState(null);

    const [upd, setUpd] = useState({ progressPercent: 0, content: "" });
    const [saving, setSaving] = useState(false);

    const fetchMine = async () => {
        setLoading(true);
        try {
            const res = await taskApi.getAssignedToMe();
            setTasks(res.data?.content || []);
        } catch (e) {
            toast.error("Không tải được task của bạn.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMine();
    }, []);

    const openProgress = (t) => {
        setSelected(t);
        setUpd({
            progressPercent: typeof t.progressPercent === "number" ? t.progressPercent : 0,
            content: "",
        });
        setOpenUpdate(true);
    };

    const submitProgress = async (e) => {
        e.preventDefault();
        if (!selected) return;

        const p = Number(upd.progressPercent);
        if (Number.isNaN(p) || p < 0 || p > 100) {
            toast.warning("Progress phải nằm trong khoảng 0-100.");
            return;
        }
        if (!upd.content.trim()) {
            toast.warning("Vui lòng nhập nội dung cập nhật.");
            return;
        }

        setSaving(true);
        try {
            await taskApi.updateProgress(selected.id, {
                progressPercent: p,
                content: upd.content,
            });
            toast.success("Cập nhật tiến độ thành công.");
            setOpenUpdate(false);
            setSelected(null);
            await fetchMine();
        } catch (e) {
            toast.error("Cập nhật tiến độ thất bại.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="text-xl font-extrabold text-slate-900">Intern • My Tasks</div>
                <div className="mt-1 text-sm text-slate-600">
                    Xem nhiệm vụ được giao và cập nhật tiến độ để mentor theo dõi.
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 p-4">
                    <div className="text-sm font-extrabold text-slate-900">Danh sách task</div>
                    <button
                        onClick={fetchMine}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50"
                    >
                        Làm mới
                    </button>
                </div>

                {loading ? (
                    <div className="p-4 text-sm text-slate-600">Đang tải...</div>
                ) : tasks.length === 0 ? (
                    <div className="p-4 text-sm text-slate-600">Bạn chưa có task nào.</div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {tasks.map((t) => (
                            <div key={t.id} className="p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="truncate text-base font-extrabold text-slate-900">
                                            {t.title}
                                        </div>
                                        <div className="mt-1 text-sm text-slate-700">
                                            {t.description || <span className="italic text-slate-500">No description</span>}
                                        </div>

                                        <div className="mt-3">
                                            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                                                <span>Progress</span>
                                                <span>{typeof t.progressPercent === "number" ? t.progressPercent : 0}%</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-slate-100">
                                                <div
                                                    className="h-2 rounded-full bg-slate-900"
                                                    style={{
                                                        width: `${Math.max(
                                                            0,
                                                            Math.min(100, typeof t.progressPercent === "number" ? t.progressPercent : 0)
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => openProgress(t)}
                                            className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-extrabold text-white hover:bg-slate-800"
                                        >
                                            Cập nhật tiến độ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                open={openUpdate}
                title={`Cập nhật tiến độ • ${selected?.title || ""}`}
                onClose={() => setOpenUpdate(false)}
            >
                <form onSubmit={submitProgress} className="grid gap-3">
                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Progress (0-100)</div>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={upd.progressPercent}
                            onChange={(e) => setUpd((s) => ({ ...s, progressPercent: e.target.value }))}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Nội dung cập nhật *</div>
                        <textarea
                            value={upd.content}
                            onChange={(e) => setUpd((s) => ({ ...s, content: e.target.value }))}
                            className="min-h-[110px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Hôm nay mình đã làm..., vướng..., kế hoạch tiếp theo..."
                        />
                    </div>

                    <button
                        disabled={saving}
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {saving ? "Đang lưu..." : "Gửi cập nhật"}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
