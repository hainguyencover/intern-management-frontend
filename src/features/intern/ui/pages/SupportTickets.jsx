import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ticketApi } from "@/api/ticketApi";

export default function SupportTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyContent, setReplyContent] = useState("");

    const [form, setForm] = useState({ title: "", category: "GENERAL", content: "" }); // changed description to content

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await ticketApi.getMyTickets();
            setTickets(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await ticketApi.create(form);
            toast.success("Đã tạo yêu cầu hỗ trợ");
            setOpenModal(false);
            setForm({ title: "", category: "GENERAL", content: "" });
            loadData();
        } catch (error) {
            toast.error("Tạo yêu cầu thất bại");
        }
    };

    const openDetail = async (ticket) => {
        setSelectedTicket(ticket);
        setComments([]);
        setDetailModal(true);
        try {
            // In a real app, we might need a separate call if comments aren't in the list response
            // But let's assume we fetch them now
            const res = await ticketApi.getComments(ticket.id);
            setComments(res.data || []);
        } catch (e) {
            console.error("Failed to load comments", e);
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        try {
            await ticketApi.reply(selectedTicket.id, replyContent);
            toast.success("Đã gửi phản hồi");
            setReplyContent("");
            // Reload comments
            const res = await ticketApi.getComments(selectedTicket.id);
            setComments(res.data || []);
        } catch (e) {
            toast.error("Gửi phản hồi thất bại");
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Hỗ trợ
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gửi yêu cầu hỗ trợ đến bộ phận nhân sự
                    </p>
                </div>
                <button
                    onClick={() => setOpenModal(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Tạo yêu cầu mới
                </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {tickets.map((t) => (
                            <tr key={t.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openDetail(t)}>
                                <td className="px-6 py-4 font-medium text-slate-900">{t.title}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{t.category}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{t.createdAt}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.status === "OPEN" ? "bg-green-100 text-green-800" :
                                        t.status === "RESOLVED" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800"
                                        }`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {tickets.length === 0 && !loading && (
                            <tr><td colSpan="4" className="p-8 text-center text-slate-500">Chưa có yêu cầu nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-slate-900">Tạo yêu cầu hỗ trợ</h3>
                        <form onSubmit={handleCreate} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Tiêu đề</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    required
                                    placeholder="Vấn đề gặp phải..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Danh mục</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                >
                                    <option value="GENERAL">Chung</option>
                                    <option value="CERTIFICATE">Dấu mộc/Giấy xác nhận</option>
                                    <option value="TECHNICAL">Kỹ thuật/Tài khoản</option>
                                    <option value="COMPENSATION">Phụ cấp/Lương</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Mô tả chi tiết</label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    rows={4}
                                    required
                                    placeholder="Chi tiết yêu cầu của bạn..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                                >
                                    Gửi yêu cầu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailModal && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
                        <div className="border-b border-slate-200 p-6 pb-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900">{selectedTicket.title}</h3>
                                <button onClick={() => setDetailModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                            <div className="mt-2 text-sm text-slate-600">
                                <span className="font-semibold">{selectedTicket.category}</span> • {selectedTicket.status} • {selectedTicket.createdAt}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
                            {/* Original Content */}
                            <div className="flex flex-col gap-1">
                                <div className="self-end rounded-xl rounded-tr-none bg-blue-600 px-4 py-2 text-sm text-white max-w-[80%]">
                                    {selectedTicket.content}
                                </div>
                                <span className="self-end text-xs text-slate-400">Bạn • {selectedTicket.createdAt}</span>
                            </div>

                            {/* Comments */}
                            {comments.map((c, idx) => {
                                const isMe = false; // Assuming intern is viewing, and they are ONLY the author of ticket, but comments might be from HR
                                // However, authorId isn't reliable on frontend without checking user context. 
                                // For simple view: HR replies on left (gray), Intern replies on right (blue).
                                // Backend response: TicketCommentResponse has authorName, authorId.
                                // Let's use name check or simple logic: if authorName !== 'Me' (which we don't know). 
                                // Actually better: We can store userId in AuthContext and compare.
                                // For now, let's just display all clearly.
                                return (
                                    <div key={idx} className={`flex flex-col gap-1 ${c.authorId === selectedTicket.createdBy?.id ? 'items-end' : 'items-start'}`}>
                                        <div className={`rounded-xl px-4 py-2 text-sm max-w-[80%] ${
                                            // Crude logic: Assuming if I am viewing 'My Tickets', I am the creator. So if authorId == tickets.creatorId, it's me.
                                            // The Ticket response doesn't have creatorId. Let's rely on basic styling for now.
                                            'bg-white border border-slate-200 text-slate-800'
                                            }`}>
                                            <div className="mb-1 text-xs font-bold text-slate-500">{c.authorName}</div>
                                            {c.content}
                                        </div>
                                        <span className="text-xs text-slate-400">{c.createdAt}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-slate-200 p-4 bg-white rounded-b-2xl">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="Nhập bình luận..."
                                    value={replyContent}
                                    onChange={e => setReplyContent(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleReply()}
                                />
                                <button
                                    onClick={handleReply}
                                    disabled={!replyContent.trim()}
                                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
