import React, { useEffect, useMemo, useState } from "react";
import { internApi } from "../../api/internApi";
import { mentorApi } from "../../api/mentorApi";

function Badge({ children }) {
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
      {children}
    </span>
    );
}

function Modal({ open, title, onClose, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div className="text-sm font-extrabold text-slate-900">{title}</div>
                    <button
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-sm font-bold text-slate-600 hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default function HrInterns() {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState({ type: "", message: "" });

    const [mentors, setMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(false);

    // modal state
    const [openAssign, setOpenAssign] = useState(false);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [mentorId, setMentorId] = useState("");
    const [savingAssign, setSavingAssign] = useState(false);

    const fetchInterns = async () => {
        setLoading(true);
        setNotice({ type: "", message: "" });
        try {
            const res = await internApi.list({ page: 0, size: 50 });
            const data = res.data;
            const items = Array.isArray(data) ? data : data?.content || [];
            setInterns(items);
        } catch (err) {
            setNotice({
                type: "error",
                message: err?.response?.data?.message || err?.message || "Không tải được danh sách intern",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchMentors = async () => {
        setLoadingMentors(true);
        try {
            const res = await mentorApi.list?.({ page: 0, size: 100 });
            const data = res?.data;
            const items = Array.isArray(data) ? data : data?.content || [];
            setMentors(items);
        } catch {
            // Nếu BE chưa có list mentor thì HR vẫn có thể assign bằng cách nhập mentorId tay
            setMentors([]);
        } finally {
            setLoadingMentors(false);
        }
    };

    useEffect(() => {
        fetchInterns();
        fetchMentors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openAssignModal = (intern) => {
        setSelectedIntern(intern);
        setMentorId(""); // reset
        setOpenAssign(true);
    };

    const closeAssignModal = () => {
        setOpenAssign(false);
        setSelectedIntern(null);
        setMentorId("");
    };

    const canAssign = useMemo(() => {
        return selectedIntern && String(mentorId).trim().length > 0;
    }, [selectedIntern, mentorId]);

    const onAssign = async () => {
        if (!canAssign) return;
        setSavingAssign(true);
        setNotice({ type: "", message: "" });
        try {
            await internApi.assignMentor(selectedIntern.id, Number(mentorId));
            setNotice({ type: "success", message: `Đã gán mentorId=${mentorId} cho internId=${selectedIntern.id}` });
            closeAssignModal();
            await fetchInterns();
        } catch (err) {
            setNotice({
                type: "error",
                message: err?.response?.data?.message || err?.message || "Gán mentor thất bại",
            });
        } finally {
            setSavingAssign(false);
        }
    };

    const onRemoveMentor = async (intern) => {
        if (!confirm(`Gỡ mentor khỏi internId=${intern.id}?`)) return;
        setNotice({ type: "", message: "" });
        try {
            await internApi.removeMentor(intern.id);
            setNotice({ type: "success", message: `Đã gỡ mentor khỏi internId=${intern.id}` });
            await fetchInterns();
        } catch (err) {
            setNotice({
                type: "error",
                message: err?.response?.data?.message || err?.message || "Gỡ mentor thất bại",
            });
        }
    };

    return (
        <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-lg font-extrabold text-slate-900">Interns (HR)</div>
                        <div className="text-sm text-slate-500">Gán mentor để intern được hướng dẫn.</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchMentors}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Refresh mentors
                        </button>
                        <button
                            onClick={fetchInterns}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Refresh interns
                        </button>
                    </div>
                </div>

                {notice.message && (
                    <div
                        className={[
                            "mt-4 rounded-xl px-3 py-2 text-sm",
                            notice.type === "success"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200",
                        ].join(" ")}
                    >
                        {notice.message}
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="overflow-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="text-slate-500">
                        <tr className="border-b border-slate-200">
                            <th className="py-2 pr-3">Intern ID</th>
                            <th className="py-2 pr-3">Họ tên</th>
                            <th className="py-2 pr-3">Email</th>
                            <th className="py-2 pr-3">Mentor</th>
                            <th className="py-2 pr-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="py-3 text-slate-500">Loading...</td></tr>
                        ) : interns.length === 0 ? (
                            <tr><td colSpan={5} className="py-3 text-slate-500">Chưa có intern.</td></tr>
                        ) : (
                            interns.map((i) => (
                                <tr key={i.id} className="border-b border-slate-100">
                                    <td className="py-2 pr-3 font-semibold text-slate-900">{i.id}</td>
                                    <td className="py-2 pr-3">{i.fullName || i.name || "-"}</td>
                                    <td className="py-2 pr-3">{i.email || "-"}</td>
                                    <td className="py-2 pr-3">
                                        {i.mentorId ? <Badge>mentorId: {i.mentorId}</Badge> : <span className="text-slate-400">—</span>}
                                    </td>
                                    <td className="py-2 pr-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => openAssignModal(i)}
                                                className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                                            >
                                                Assign mentor
                                            </button>
                                            <button
                                                onClick={() => onRemoveMentor(i)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                open={openAssign}
                title={`Assign mentor cho internId=${selectedIntern?.id ?? ""}`}
                onClose={closeAssignModal}
            >
                <div className="grid gap-3">
                    <div className="text-sm text-slate-600">
                        Nếu bạn có API <code className="rounded bg-slate-100 px-1">GET /api/mentors</code> thì bạn sẽ chọn mentor từ dropdown.
                        Nếu chưa có, bạn vẫn có thể nhập mentorId thủ công.
                    </div>

                    <label className="grid gap-1">
                        <span className="text-sm font-semibold text-slate-700">Mentor</span>

                        {mentors.length > 0 ? (
                            <select
                                value={mentorId}
                                onChange={(e) => setMentorId(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                            >
                                <option value="">-- Chọn mentor --</option>
                                {mentors.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        #{m.id} — {m.fullName || m.email} {m.title ? `(${m.title})` : ""}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                value={mentorId}
                                onChange={(e) => setMentorId(e.target.value)}
                                placeholder="Nhập mentorId (vd: 1)"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                            />
                        )}

                        {loadingMentors && <div className="text-xs text-slate-500">Loading mentors...</div>}
                    </label>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onAssign}
                            disabled={!canAssign || savingAssign}
                            className={[
                                "rounded-xl px-4 py-2 text-sm font-bold text-white",
                                !canAssign || savingAssign ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800",
                            ].join(" ")}
                        >
                            {savingAssign ? "Đang gán..." : "Gán mentor"}
                        </button>

                        <button
                            onClick={closeAssignModal}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
