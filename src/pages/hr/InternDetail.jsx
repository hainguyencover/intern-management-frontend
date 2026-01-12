import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import HrInternDocuments from "../../components/documents/HrInternDocuments.jsx";
import MentorSelect from "../../components/mentors/MentorSelect.jsx"; // ✅ component dropdown mentor
import { internApi } from "../../api/internApi";
import mentorApi from "../../api/mentorApi.js";


function Badge({ children }) {
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
      {children}
    </span>
    );
}

export default function InternDetail() {
    const { internId } = useParams();

    // TODO: thay bằng auth/me
    const hrUserId = useMemo(() => {
        const v = localStorage.getItem("hrUserId");
        return v ? Number(v) : 1;
    }, []);

    const parsedInternId = Number(internId);

    // ===== states =====
    const [intern, setIntern] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    // mentor select
    const [mentorId, setMentorId] = useState("");
    const [selectedMentor, setSelectedMentor] = useState(null);

    const [saving, setSaving] = useState(false);

    // dùng để "Refresh mentors" bằng cách remount MentorSelect
    const [mentorSelectKey, setMentorSelectKey] = useState(0);
    const [loadingMentors, setLoadingMentors] = useState(false);

    const fetchIntern = async () => {
        if (!Number.isFinite(parsedInternId)) return;
        setLoading(true);
        setErr("");
        try {
            const res = await internApi.getById(parsedInternId);
            setIntern(res.data);
        } catch (e) {
            setErr(e?.response?.data?.message || "Failed to load intern detail");
        } finally {
            setLoading(false);
        }
    };

    // chỉ để giữ UX nút "Refresh mentors" (MentorSelect cũng có nút Tải lại bên trong)
    const refreshMentors = async () => {
        setLoadingMentors(true);
        try {
            // gọi thử để đảm bảo API ok (không bắt buộc)
            await mentorApi.getAll?.({ size: 1 });
            // remount MentorSelect để nó refetch khi mở dropdown
            setMentorSelectKey((k) => k + 1);
        } catch {
            // vẫn remount để user thử lại
            setMentorSelectKey((k) => k + 1);
        } finally {
            setLoadingMentors(false);
        }
    };

    useEffect(() => {
        fetchIntern();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parsedInternId]);

    const currentMentorId =
        intern?.mentorId ?? intern?.mentor?.id ?? intern?.mentor?.mentorId ?? null;

    const onAssign = async () => {
        const mid = Number(mentorId);
        if (!Number.isFinite(parsedInternId)) return;
        if (!Number.isFinite(mid) || mid <= 0) {
            setErr("Vui lòng chọn mentor hợp lệ.");
            return;
        }

        setSaving(true);
        setErr("");
        try {
            await internApi.assignMentor(parsedInternId, mid);
            setMentorId("");
            setSelectedMentor(null);
            await fetchIntern();
        } catch (e) {
            setErr(e?.response?.data?.message || "Assign mentor failed");
        } finally {
            setSaving(false);
        }
    };

    const onRemove = async () => {
        if (!Number.isFinite(parsedInternId)) return;
        const ok = window.confirm(`Gỡ mentor khỏi internId=${parsedInternId}?`);
        if (!ok) return;

        setSaving(true);
        setErr("");
        try {
            await internApi.removeMentor(parsedInternId);
            await fetchIntern();
        } catch (e) {
            setErr(e?.response?.data?.message || "Remove mentor failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Chi tiết thực tập sinh</h1>
                    <p className="text-sm text-slate-600">
                        Intern ID: <span className="font-semibold">{parsedInternId}</span>
                    </p>
                </div>

                <Link
                    to="/hr/interns"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                    ← Quay lại danh sách
                </Link>
            </div>

            {!Number.isFinite(parsedInternId) && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    internId không hợp lệ trên URL.
                </div>
            )}

            {err && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {err}
                </div>
            )}

            {/* Mentor card */}
            {Number.isFinite(parsedInternId) && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-extrabold text-slate-900">Mentor</div>
                            <div className="text-xs text-slate-500">
                                Gán mentor để thực tập sinh được hướng dẫn.
                            </div>
                        </div>

                        <button
                            onClick={refreshMentors}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                        >
                            {loadingMentors ? "Loading..." : "Refresh mentors"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-sm text-slate-600">Loading intern...</div>
                    ) : (
                        <div className="grid gap-2">
                            <div className="text-sm text-slate-700">
                                Mentor hiện tại:{" "}
                                {currentMentorId ? <Badge>mentorId: {currentMentorId}</Badge> : <span className="text-slate-400">—</span>}
                            </div>

                            <div className="grid gap-2 md:grid-cols-2 md:items-end">
                                <label className="grid gap-1">
                                    <span className="text-sm font-semibold text-slate-700">Chọn mentor</span>

                                    {/* ✅ Autocomplete dropdown */}
                                    <MentorSelect
                                        key={mentorSelectKey}
                                        value={mentorId}
                                        onChange={(id, mentorObj) => {
                                            setMentorId(id);
                                            setSelectedMentor(mentorObj);
                                        }}
                                        placeholder="Bấm để chọn mentor..."
                                    />

                                    {/* optional: hiển thị mentor vừa chọn */}
                                    <div className="text-xs text-slate-500">
                                        Đã chọn:{" "}
                                        <span className="font-semibold text-slate-700">
                      {selectedMentor?.user?.fullName ||
                          selectedMentor?.fullName ||
                          (mentorId ? `ID ${mentorId}` : "—")}
                    </span>
                                    </div>
                                </label>

                                <div className="flex gap-2">
                                    <button
                                        onClick={onAssign}
                                        disabled={saving}
                                        className={[
                                            "rounded-xl px-4 py-2 text-sm font-bold text-white",
                                            saving ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800",
                                        ].join(" ")}
                                    >
                                        {saving ? "Đang xử lý..." : "Assign"}
                                    </button>

                                    <button
                                        onClick={onRemove}
                                        disabled={saving}
                                        className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Sprint 2: tab Documents */}
            {Number.isFinite(parsedInternId) ? (
                <HrInternDocuments internId={parsedInternId} hrUserId={hrUserId} />
            ) : null}
        </div>
    );
}
