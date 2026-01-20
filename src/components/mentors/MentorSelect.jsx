import { useEffect, useMemo, useRef, useState } from "react";
import mentorApi from "../../api/mentorApi.js";

export default function MentorSelect({
                                         value,               // mentorId (number | "" | null)
                                         onChange,            // (mentorId, mentorObj) => void
                                         disabled = false,
                                         placeholder = "Chọn mentor...",
                                     }) {
    const wrapRef = useRef(null);
    const inputRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [error, setError] = useState("");

    const selectedMentor = useMemo(() => {
        if (!value) return null;
        return mentors.find((m) => Number(m.id) === Number(value)) || null;
    }, [value, mentors]);

    const displayText = useMemo(() => {
        if (open) return keyword;
        if (!selectedMentor) return value ? String(value) : "";
        return `${selectedMentor.user?.fullName ?? selectedMentor.fullName ?? "Mentor"} (ID: ${selectedMentor.id})`;
    }, [open, keyword, selectedMentor, value]);

    const normalizedMentors = useMemo(() => {
        // Nếu backend trả Page: { content: [...] } thì mình đã normalize ở fetchMentors,
        // đoạn này chỉ lọc ở client cho nhanh.
        const k = keyword.trim().toLowerCase();
        if (!k) return mentors;

        return mentors.filter((m) => {
            const name = (m.user?.fullName ?? m.fullName ?? "").toLowerCase();
            const email = (m.user?.email ?? m.email ?? "").toLowerCase();
            const dept = (m.department?.name ?? "").toLowerCase();
            return (
                String(m.id).includes(k) ||
                name.includes(k) ||
                email.includes(k) ||
                dept.includes(k)
            );
        });
    }, [mentors, keyword]);

    async function fetchMentors() {
        setLoading(true);
        setError("");
        try {
            const res = await mentorApi.getAll({ size: 200 }); // nếu backend dùng pagination
            const data = res.data;
            const list = Array.isArray(data) ? data : (data?.content ?? data?.data?.content ?? []);
            setMentors(list);
        } catch (e) {
            setError(e?.response?.data?.message || "Không tải được danh sách mentors.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // đóng dropdown khi click ra ngoài
        function onDocDown(e) {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target)) {
                setOpen(false);
                setActiveIndex(0);
            }
        }
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, []);

    const openAndLoad = async () => {
        if (disabled) return;
        setOpen(true);
        setKeyword("");
        setActiveIndex(0);
        if (mentors.length === 0 && !loading) await fetchMentors();
    };

    const pick = (m) => {
        onChange?.(Number(m.id), m);
        setOpen(false);
        setKeyword("");
        setActiveIndex(0);
    };

    const onKeyDown = (e) => {
        if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
            e.preventDefault();
            openAndLoad();
            return;
        }
        if (!open) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, normalizedMentors.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const m = normalizedMentors[activeIndex];
            if (m) pick(m);
        } else if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            setActiveIndex(0);
        }
    };

    return (
        <div ref={wrapRef} className="relative">
            <input
                ref={inputRef}
                disabled={disabled}
                value={displayText}
                onFocus={openAndLoad}
                onClick={openAndLoad}
                onChange={(e) => {
                    // Khi dropdown đang mở: coi input là keyword để search
                    if (!open) setOpen(true);
                    setKeyword(e.target.value);
                    setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100"
            />

            {open && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                        <div className="text-xs text-slate-500">
                            {loading ? "Đang tải..." : `Có ${normalizedMentors.length} mentor`}
                        </div>
                        <button
                            type="button"
                            onClick={fetchMentors}
                            className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
                        >
                            Tải lại
                        </button>
                    </div>

                    {error ? (
                        <div className="p-3 text-sm text-rose-600">{error}</div>
                    ) : normalizedMentors.length === 0 ? (
                        <div className="p-3 text-sm text-slate-600">
                            Không tìm thấy mentor phù hợp.
                        </div>
                    ) : (
                        <ul className="max-h-64 overflow-auto">
                            {normalizedMentors.map((m, idx) => {
                                const name = m.user?.fullName ?? m.fullName ?? `Mentor #${m.id}`;
                                const email = m.user?.email ?? m.email ?? "";
                                const dept = m.department?.name ?? "";
                                const active = idx === activeIndex;

                                return (
                                    <li key={m.id}>
                                        <button
                                            type="button"
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            onClick={() => pick(m)}
                                            className={[
                                                "w-full text-left px-3 py-2",
                                                "hover:bg-slate-50",
                                                active ? "bg-slate-50" : "",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-slate-900 truncate">
                                                        {name}
                                                    </div>
                                                    <div className="text-xs text-slate-600 truncate">
                                                        {email}{dept ? ` • ${dept}` : ""}
                                                    </div>
                                                </div>
                                                <div className="text-xs font-semibold text-slate-700 shrink-0">
                                                    ID: {m.id}
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="px-3 py-2 border-t border-slate-100 text-[11px] text-slate-500">
                        Mẹo: gõ để lọc • Enter để chọn • Esc để đóng
                    </div>
                </div>
            )}
        </div>
    );
}
