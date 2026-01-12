import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { internApi } from "../../api/internApi";
import mentorApi from "../../api/mentorApi"; // nếu chưa tạo mentorApi.js, hãy tạo theo hướng dẫn trước

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

export default function InternList() {
    const nav = useNavigate();

    // filters
    const [q, setQ] = useState("");
    const [university, setUniversity] = useState("");
    const [major, setMajor] = useState("");

    // paging
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    // data
    const [data, setData] = useState({
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: 10,
    });

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // ===== mentor assign state =====
    const [mentors, setMentors] = useState([]);
    const [loadingMentors, setLoadingMentors] = useState(false);

    const [openAssign, setOpenAssign] = useState(false);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [mentorId, setMentorId] = useState("");
    const [savingAssign, setSavingAssign] = useState(false);

    const params = useMemo(() => {
        const p = { page, size };
        if (q.trim()) p.q = q.trim();
        if (university.trim()) p.university = university.trim();
        if (major.trim()) p.major = major.trim();
        return p;
    }, [q, university, major, page, size]);

    const fetchList = async () => {
        setLoading(true);
        setErr("");
        try {
            const res = await internApi.list(params);
            setData(res.data);
        } catch (e) {
            setErr(e?.response?.data?.message || "Failed to load interns");
        } finally {
            setLoading(false);
        }
    };

    const fetchMentors = async () => {
        setLoadingMentors(true);
        try {
            // Nếu BE có GET /api/mentors -> dropdown sẽ có data
            const res = await mentorApi.list({ page: 0, size: 100 });
            const d = res?.data;
            const items = Array.isArray(d) ? d : d?.content || [];
            setMentors(items);
        } catch {
            // Nếu BE chưa có list mentors thì vẫn cho nhập mentorId thủ công
            setMentors([]);
        } finally {
            setLoadingMentors(false);
        }
    };

    // auto reload when paging changes
    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size]);

    // load mentors once
    useEffect(() => {
        fetchMentors();
    }, []);

    const applyFilters = () => {
        setPage(0);
        fetchList();
    };

    const resetFilters = () => {
        setQ("");
        setUniversity("");
        setMajor("");
        setPage(0);
        // fetch with cleared state
        setTimeout(fetchList, 0);
    };

    const content = data?.content || [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 0;

    const canPrev = page > 0;
    const canNext = page + 1 < totalPages;

    const openAssignModal = (intern) => {
        setSelectedIntern(intern);
        setMentorId(""); // reset
        setOpenAssign(true);
        setErr("");
    };

    const closeAssignModal = () => {
        setOpenAssign(false);
        setSelectedIntern(null);
        setMentorId("");
    };

    const onAssignMentor = async () => {
        if (!selectedIntern) return;
        const internId = selectedIntern.id ?? selectedIntern.internId ?? selectedIntern._id;
        const mid = Number(mentorId);
        if (!internId || !Number.isFinite(mid) || mid <= 0) {
            setErr("Vui lòng chọn/nhập mentorId hợp lệ.");
            return;
        }

        setSavingAssign(true);
        setErr("");
        try {
            await internApi.assignMentor(internId, mid);
            closeAssignModal();
            await fetchList();
        } catch (e) {
            setErr(e?.response?.data?.message || "Assign mentor failed");
        } finally {
            setSavingAssign(false);
        }
    };

    const onRemoveMentor = async (intern) => {
        const internId = intern.id ?? intern.internId ?? intern._id;
        if (!internId) return;

        const ok = window.confirm(`Gỡ mentor khỏi internId=${internId}?`);
        if (!ok) return;

        setErr("");
        try {
            await internApi.removeMentor(internId);
            await fetchList();
        } catch (e) {
            setErr(e?.response?.data?.message || "Remove mentor failed");
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl p-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Interns
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Search, filter, and manage intern profiles.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchMentors}
                        className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
                    >
                        {loadingMentors ? "Loading mentors..." : "Refresh mentors"}
                    </button>

                    <button
                        onClick={() => nav("/hr/interns/new")}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                        + Create Intern
                    </button>
                </div>
            </div>

            <div className="h-4" />

            {/* Filters */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:items-end">
                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Search
                        </label>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Name / Email / Phone"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            University
                        </label>
                        <input
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            placeholder="e.g. HUST"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">Major</label>
                        <input
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            placeholder="e.g. Software"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>

                    <div className="flex gap-2 md:justify-end">
                        <button
                            onClick={applyFilters}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Apply
                        </button>
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </section>

            <div className="h-4" />

            {/* Table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-sm font-extrabold text-slate-900">Results</div>
                    <div className="text-sm text-slate-500">
                        Total:{" "}
                        <span className="font-semibold text-slate-900">{totalElements}</span>
                    </div>
                </div>

                {err && (
                    <div className="border-b border-slate-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {err}
                    </div>
                )}

                {loading && (
                    <div className="px-4 py-6 text-sm text-slate-600">Loading...</div>
                )}

                {!loading && (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                            <thead className="bg-white">
                            <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                                <th className="px-4 py-3">Full name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">University</th>
                                <th className="px-4 py-3">Major</th>
                                <th className="px-4 py-3">Mentor</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {content.map((it) => {
                                const id = it.id ?? it.internId ?? it._id;

                                // backend có thể trả: mentorId hoặc mentor: {id,...}
                                const currentMentorId =
                                    it.mentorId ??
                                    it?.mentor?.id ??
                                    it?.mentor?.mentorId ??
                                    null;

                                return (
                                    <tr
                                        key={id}
                                        className="border-b border-slate-100 hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-3 font-semibold text-slate-900">
                                            {it.fullName}
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">{it.email}</td>
                                        <td className="px-4 py-3 text-slate-700">{it.phone}</td>
                                        <td className="px-4 py-3 text-slate-700">{it.university}</td>
                                        <td className="px-4 py-3 text-slate-700">{it.major}</td>

                                        <td className="px-4 py-3">
                                            {currentMentorId ? (
                                                <Badge>mentorId: {currentMentorId}</Badge>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => nav(`/hr/interns/${id}`)}
                                                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => nav(`/hr/interns/${id}/edit`)}
                                                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
                                                >
                                                    Edit
                                                </button>


                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {content.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-sm text-slate-500"
                                    >
                                        No interns found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={!canPrev}
                            className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!canNext}
                            className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                        <div className="ml-2 text-sm text-slate-600">
                            Page <span className="font-semibold text-slate-900">{page + 1}</span>
                            {totalPages ? (
                                <>
                                    {" "}
                                    / <span className="font-semibold text-slate-900">{totalPages}</span>
                                </>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>Rows</span>
                        <select
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        >
                            {[5, 10, 20, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Assign Modal */}
            <Modal
                open={openAssign}
                title={`Assign mentor cho internId=${selectedIntern?.id ?? ""}`}
                onClose={closeAssignModal}
            >
                <div className="grid gap-3">
                    <div className="text-sm text-slate-600">
                        Chọn mentor từ dropdown (nếu có API list mentors) hoặc nhập mentorId thủ công.
                    </div>

                    <label className="grid gap-1">
                        <span className="text-sm font-semibold text-slate-700">Mentor</span>

                        {mentors.length > 0 ? (
                            <select
                                value={mentorId}
                                onChange={(e) => setMentorId(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-100"
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
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-slate-100"
                            />
                        )}

                        {loadingMentors && <div className="text-xs text-slate-500">Loading mentors...</div>}
                        {mentors.length === 0 && !loadingMentors && (
                            <div className="text-xs text-slate-500">
                                Không load được danh sách mentors — bạn có thể nhập mentorId thủ công.
                            </div>
                        )}
                    </label>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onAssignMentor}
                            disabled={savingAssign}
                            className={[
                                "rounded-xl px-4 py-2 text-sm font-bold text-white",
                                savingAssign ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800",
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
