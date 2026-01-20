import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { taskApi } from "../../api/taskApi";

function Pill({ children }) {
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
      {children}
    </span>
    );
}

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

export default function MentorTasksPage() {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({ status: "", groupId: "" });

    const [openCreate, setOpenCreate] = useState(false);
    const [creating, setCreating] = useState(false);

    // form tạo task
    const [form, setForm] = useState({
        groupId: "",
        title: "",
        description: "",
        dueDate: "", // yyyy-mm-dd
        // backend bạn có thể hỗ trợ assign cho nhiều internIds; nếu chưa có thì bỏ field này
        internIdsText: "", // "1,2,3"
    });

    const [openHistoryFor, setOpenHistoryFor] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await taskApi.getAssigned({
                ...(filters.status ? { status: filters.status } : {}),
                ...(filters.groupId ? { groupId: filters.groupId } : {}),
            });
            setTasks(res.data || []);
        } catch (e) {
            toast.error("Không tải được danh sách task.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.status, filters.groupId]);

    const stats = useMemo(() => {
        const total = tasks.length;
        const byStatus = tasks.reduce((acc, t) => {
            const k = (t.status || "UNKNOWN").toUpperCase();
            acc[k] = (acc[k] || 0) + 1;
            return acc;
        }, {});
        return { total, byStatus };
    }, [tasks]);

    const onCreate = async (e) => {
        e.preventDefault();
        if (!form.groupId || !form.title) {
            toast.warning("Vui lòng nhập Group ID và Tiêu đề.");
            return;
        }
        setCreating(true);
        try {
            const internIds = form.internIdsText
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
                .map((x) => Number(x))
                .filter((x) => !Number.isNaN(x));

            const payload = {
                groupId: Number(form.groupId),
                title: form.title,
                description: form.description,
                dueDate: form.dueDate ? `${form.dueDate}` : null,
                ...(internIds.length ? { internIds } : {}), // backend có thể bỏ qua nếu chưa hỗ trợ
            };

            await taskApi.create(payload);
            toast.success("Tạo task thành công.");
            setOpenCreate(false);
            setForm({ groupId: "", title: "", description: "", dueDate: "", internIdsText: "" });
            fetchTasks();
        } catch (e) {
            toast.error("Tạo task thất bại.");
        } finally {
            setCreating(false);
        }
    };

    const openHistory = async (task) => {
        setOpenHistoryFor(task);
        setHistory([]);
        setLoadingHistory(true);
        try {
            const res = await taskApi.getHistory(task.id);
            setHistory(res.data || []);
        } catch (e) {
            toast.error("Không tải được lịch sử task.");
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-xl font-extrabold text-slate-900">Mentor • Tasks</div>
                    <div className="mt-1 text-sm text-slate-600">
                        Giao nhiệm vụ cho thực tập sinh và theo dõi tiến độ.
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <Pill>Tổng: {stats.total}</Pill>
                        {Object.entries(stats.byStatus).map(([k, v]) => (
                            <Pill key={k}>
                                {k}: {v}
                            </Pill>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setOpenCreate(true)}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                >
                    + Tạo task
                </button>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
                <div className="grid gap-1">
                    <div className="text-xs font-bold text-slate-600">Status</div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                        <option value="">Tất cả</option>
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="NEEDS_CHANGES">NEEDS_CHANGES</option>
                        <option value="DONE">DONE</option>
                    </select>
                </div>

                <div className="grid gap-1">
                    <div className="text-xs font-bold text-slate-600">Group ID</div>
                    <input
                        value={filters.groupId}
                        onChange={(e) => setFilters((s) => ({ ...s, groupId: e.target.value }))}
                        placeholder="VD: 12"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        onClick={fetchTasks}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50"
                    >
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-4 text-sm font-extrabold text-slate-900">
                    Danh sách task đã giao
                </div>

                {loading ? (
                    <div className="p-4 text-sm text-slate-600">Đang tải...</div>
                ) : tasks.length === 0 ? (
                    <div className="p-4 text-sm text-slate-600">Chưa có task.</div>
                ) : (
                    <div className="divide-y divide-slate-200">
                        {tasks.map((t) => (
                            <div key={t.id} className="p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="truncate text-base font-extrabold text-slate-900">
                                                {t.title}
                                            </div>
                                            <Pill>{(t.status || "OPEN").toUpperCase()}</Pill>
                                            {t.dueDate ? <Pill>Due: {String(t.dueDate).slice(0, 10)}</Pill> : null}
                                            {t.groupId ? <Pill>Group: {t.groupId}</Pill> : null}
                                        </div>
                                        {t.description ? (
                                            <div className="mt-1 text-sm text-slate-700">{t.description}</div>
                                        ) : (
                                            <div className="mt-1 text-sm text-slate-500 italic">No description</div>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => openHistory(t)}
                                            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50"
                                        >
                                            Lịch sử
                                        </button>
                                    </div>
                                </div>

                                {typeof t.progressPercent === "number" ? (
                                    <div className="mt-3">
                                        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                                            <span>Progress</span>
                                            <span>{t.progressPercent}%</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-100">
                                            <div
                                                className="h-2 rounded-full bg-slate-900"
                                                style={{ width: `${Math.max(0, Math.min(100, t.progressPercent))}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal open={openCreate} title="Tạo task mới" onClose={() => setOpenCreate(false)}>
                <form onSubmit={onCreate} className="grid gap-3">
                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Group ID *</div>
                        <input
                            value={form.groupId}
                            onChange={(e) => setForm((s) => ({ ...s, groupId: e.target.value }))}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="VD: 12"
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Tiêu đề *</div>
                        <input
                            value={form.title}
                            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="VD: Implement login UI"
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Mô tả</div>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                            className="min-h-[90px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Chi tiết nhiệm vụ..."
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">Deadline</div>
                        <input
                            type="date"
                            value={form.dueDate}
                            onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="grid gap-1">
                        <div className="text-xs font-bold text-slate-600">
                            Intern IDs (tuỳ chọn, phân tách bằng dấu phẩy)
                        </div>
                        <input
                            value={form.internIdsText}
                            onChange={(e) => setForm((s) => ({ ...s, internIdsText: e.target.value }))}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            placeholder="VD: 101, 102, 103"
                        />
                        <div className="text-xs text-slate-500">
                            Nếu backend chưa hỗ trợ assign trực tiếp thì có thể bỏ trống.
                        </div>
                    </div>

                    <button
                        disabled={creating}
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {creating ? "Đang tạo..." : "Tạo task"}
                    </button>
                </form>
            </Modal>

            <Modal
                open={!!openHistoryFor}
                title={`Lịch sử cập nhật • ${openHistoryFor?.title || ""}`}
                onClose={() => setOpenHistoryFor(null)}
            >
                {loadingHistory ? (
                    <div className="text-sm text-slate-600">Đang tải...</div>
                ) : history.length === 0 ? (
                    <div className="text-sm text-slate-600">Chưa có cập nhật.</div>
                ) : (
                    <div className="space-y-3">
                        {history.map((h) => (
                            <div key={h.id} className="rounded-2xl border border-slate-200 p-3">
                                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                                    <Pill>{typeof h.progressPercent === "number" ? `${h.progressPercent}%` : "Update"}</Pill>
                                    <span>{h.createdAt ? String(h.createdAt).replace("T", " ").slice(0, 19) : ""}</span>
                                    {h.internId ? <Pill>Intern: {h.internId}</Pill> : null}
                                </div>
                                <div className="mt-2 text-sm text-slate-800">{h.content || "(no content)"}</div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}
