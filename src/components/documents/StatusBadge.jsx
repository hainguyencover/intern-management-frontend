const styles = {
    PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
    UPLOADED: "bg-amber-50 text-amber-700 ring-amber-200",
    APPROVED: "bg-green-50 text-green-700 ring-green-200",
    REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
    SIGNED: "bg-sky-50 text-sky-700 ring-sky-200",
};

export default function StatusBadge({status}) {
    const s = String(status || "").toUpperCase();
    const cls = styles[s] || "bg-slate-50 text-slate-700 ring-slate-200";
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {s || "-"}
    </span>
    );
}
