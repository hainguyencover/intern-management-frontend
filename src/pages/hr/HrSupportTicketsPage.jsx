import React, { useEffect, useState } from "react";
import { supportTicketApi } from "../../api/supportTicketApi";
import TicketDetailModal from "../../components/supportTickets/TicketDetailModal";

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"];

export default function HrSupportTicketsPage() {
    const [loading, setLoading] = useState(false);
    const [pageData, setPageData] = useState({ content: [], totalElements: 0, number: 0, size: 10 });

    const [statusDraft, setStatusDraft] = useState({});

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchList = async (page = 0, size = 10) => {
        setLoading(true);
        try {
            const res = await supportTicketApi.hrList(page, size);
            setPageData(res.data);

            const nextDraft = {};
            res.data.content.forEach((t) => (nextDraft[t.id] = t.status));
            setStatusDraft(nextDraft);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(0, 10); }, []);

    const openTicket = (id) => {
        setSelectedId(id);
        setOpenDetail(true);
    };

    const updateStatus = async (id) => {
        const status = statusDraft[id];
        if (!status) return;
        setLoading(true);
        try {
            await supportTicketApi.hrUpdateStatus(id, { status });
            await fetchList(pageData.number, pageData.size);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* ... header ... */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {/* ... top ... */}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 text-slate-600">
                        <tr>
                            <th className="py-2 pr-3">Title</th>
                            <th className="py-2 pr-3">Category</th>
                            <th className="py-2 pr-3">Created by</th>
                            <th className="py-2 pr-3">Status</th>
                            <th className="py-2 pr-3">Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {pageData.content.map((t) => (
                            <tr key={t.id} className="border-b border-slate-100 align-top hover:bg-slate-50">
                                {/* CLICK mở detail */}
                                <td
                                    className="py-2 pr-3 font-semibold text-slate-900 cursor-pointer"
                                    onClick={() => openTicket(t.id)}
                                    title="Click để xem chi tiết & lịch sử trao đổi"
                                >
                                    {t.title}
                                </td>

                                <td className="py-2 pr-3 text-slate-700">{t.category}</td>
                                <td className="py-2 pr-3 text-slate-700">{t.createdByEmail}</td>

                                <td className="py-2 pr-3">
                                    <select
                                        className="w-[170px] rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                                        value={statusDraft[t.id] || t.status}
                                        onChange={(e) => setStatusDraft((p) => ({ ...p, [t.id]: e.target.value }))}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>

                                <td className="py-2 pr-3">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            disabled={loading}
                                            onClick={(e) => { e.stopPropagation(); updateStatus(t.id); }}
                                            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            Cập nhật
                                        </button>

                                        <button
                                            disabled={loading}
                                            onClick={(e) => { e.stopPropagation(); openTicket(t.id); }}
                                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                                        >
                                            Xem & phản hồi
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {!pageData.content.length && (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-slate-500">
                                    Chưa có tickets nào.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {loading && <div className="mt-3 text-sm text-slate-500">Đang xử lý...</div>}
            </div>

            <TicketDetailModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                ticketId={selectedId}
                role="HR"
                api={supportTicketApi}
                onAfterAction={() => fetchList(pageData.number, pageData.size)}
            />
        </div>
    );
}
