import React, { useEffect, useState } from "react";
import { supportTicketApi } from "../../api/supportTicketApi";
import TicketDetailModal from "../../components/supportTickets/TicketDetailModal";

const CATEGORIES = ["CERTIFICATE", "DOCUMENT", "CONFIRMATION", "OTHER"];

export default function InternSupportTicketsPage() {
    const [loading, setLoading] = useState(false);
    const [pageData, setPageData] = useState({
        content: [],
        totalElements: 0,
        number: 0,
        size: 10,
    });

    const [openDetail, setOpenDetail] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // ✅ NEW: toggle hiển thị form
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "OTHER",
    });

    const fetchList = async (page = 0, size = 10) => {
        setLoading(true);
        try {
            const res = await supportTicketApi.internList(page, size);
            setPageData(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList(0, 10);
    }, []);

    const onCreate = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) return;

        setLoading(true);
        try {
            await supportTicketApi.internCreate(form);
            setForm({ title: "", content: "", category: "OTHER" });

            // ✅ NEW: tạo xong thì đóng form
            setShowForm(false);

            await fetchList(0, pageData.size);
        } finally {
            setLoading(false);
        }
    };

    const openTicket = (id) => {
        setSelectedId(id);
        setOpenDetail(true);
    };

    return (
        <div className="p-6">
            {/* ✅ NEW: nút bật/tắt form */}
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setShowForm((v) => !v)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    {showForm ? "Đóng form" : "Tạo yêu cầu hỗ trợ"}
                </button>
            </div>

            {/* ===== FORM TẠO YÊU CẦU HỖ TRỢ (chỉ hiện khi showForm = true) ===== */}
            {showForm && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">Gửi yêu cầu hỗ trợ</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Gửi yêu cầu chứng nhận, giấy tờ hoặc hỗ trợ khác tới HR.
                    </p>

                    <form onSubmit={onCreate} className="mt-4 grid gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700">
                                Tiêu đề
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="Ví dụ: Xin giấy xác nhận thực tập"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">
                                Nội dung
                            </label>
                            <textarea
                                rows={4}
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                placeholder="Mô tả chi tiết yêu cầu của bạn..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700">
                                Loại yêu cầu
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="mt-1 w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                                {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ===== DANH SÁCH TICKET ===== */}
            <div className={`${showForm ? "mt-6" : ""} rounded-2xl border border-slate-200 bg-white p-5 shadow-sm`}>
                <h2 className="text-lg font-bold text-slate-900">Yêu cầu của tôi</h2>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 text-slate-600">
                        <tr>
                            <th className="py-2 pr-3">Title</th>
                            <th className="py-2 pr-3">Category</th>
                            <th className="py-2 pr-3">Status</th>
                            <th className="py-2 pr-3">Created</th>
                        </tr>
                        </thead>

                        <tbody>
                        {pageData.content.map((t) => (
                            <tr
                                key={t.id}
                                className="border-b border-slate-100 cursor-pointer hover:bg-slate-50"
                                onClick={() => openTicket(t.id)}
                                title="Click để xem chi tiết & trao đổi"
                            >
                                <td className="py-2 pr-3 font-semibold text-slate-900">
                                    {t.title}
                                </td>
                                <td className="py-2 pr-3 text-slate-700">{t.category}</td>
                                <td className="py-2 pr-3 text-slate-700">{t.status}</td>
                                <td className="py-2 pr-3 text-slate-700">
                                    {String(t.createdAt).replace("T", " ")}
                                </td>
                            </tr>
                        ))}

                        {!pageData.content.length && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-6 text-center text-slate-500"
                                >
                                    Chưa có yêu cầu nào.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ===== MODAL CHI TIẾT ===== */}
            <TicketDetailModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                ticketId={selectedId}
                role="INTERN"
                api={supportTicketApi}
                onAfterAction={() => fetchList(pageData.number, pageData.size)}
            />
        </div>
    );
}
