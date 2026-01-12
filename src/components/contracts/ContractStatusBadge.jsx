import React from "react";

const map = {
    SENT: {label: "Đã gửi - chờ ký", cls: "bg-amber-50 text-amber-700 border-amber-200"},
    SIGNED: {label: "Đã ký", cls: "bg-green-50 text-green-700 border-green-200"},
    CANCELLED: {label: "Đã hủy", cls: "bg-rose-50 text-rose-700 border-rose-200"},
};

export default function ContractStatusBadge({status}) {
    const cfg = map[status] || {label: status || "-", cls: "bg-slate-50 text-slate-700 border-slate-200"};
    return (
        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-lg border ${cfg.cls}`}>
      {cfg.label}
    </span>
    );
}
