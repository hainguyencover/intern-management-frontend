export default function StatusBadge({status}) {
    const s = (status || "").toUpperCase();
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1";
    const map = {
        PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
        UPLOADED: "bg-amber-50 text-amber-700 ring-amber-200", // nếu bạn dùng UPLOADED
        APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
    };
    return <span className={`${base} ${map[s] || "bg-slate-50 text-slate-700 ring-slate-200"}`}>{s || "UNKNOWN"}</span>;
}
