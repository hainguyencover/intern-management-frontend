import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ticketApi } from "../../api/ticketApi";

export default function HelpDesk() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [reply, setReply] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await ticketApi.getAllTickets({ sort: 'createdAt,desc' });
            setTickets(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được danh sách hỗ trợ");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTicket = async (ticket) => {
        setSelectedTicket(ticket);
        setComments([]);
        try {
            const res = await ticketApi.getComments(ticket.id);
            setComments(res.data || []);
        } catch (e) {
            console.error("Failed to load comments");
        }
    };

    const handleReply = async () => {
        if (!reply.trim()) return;
        try {
            await ticketApi.reply(selectedTicket.id, reply);
            toast.success("Đã gửi phản hồi");
            setReply("");
            // Reload comments
            const res = await ticketApi.getComments(selectedTicket.id);
            setComments(res.data || []);
        } catch (error) {
            toast.error("Gửi thất bại");
        }
    };

    const handleClose = async () => {
        if (!confirm("Đóng yêu cầu này?")) return;
        try {
            await ticketApi.updateStatus(selectedTicket.id, "CLOSED");
            toast.success("Đã đóng yêu cầu");

            // Update local state
            setSelectedTicket(prev => ({ ...prev, status: "CLOSED" }));
            setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: "CLOSED" } : t));
        } catch (error) {
            toast.error("Lỗi khi đóng yêu cầu");
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* List */}
            <div className="w-1/3 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-white p-4">
                    <h2 className="font-bold text-slate-900">Yêu cầu hỗ trợ</h2>
                    <button onClick={loadData} className="mt-2 text-xs text-blue-600 hover:underline">Làm mới</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {tickets.length === 0 && !loading && (
                        <div className="p-8 text-center text-slate-500">Không có yêu cầu nào</div>
                    )}
                    {tickets.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => handleSelectTicket(t)}
                            className={`cursor-pointer p-4 hover:bg-slate-50 ${selectedTicket?.id === t.id ? "bg-blue-50" : ""}`}
                        >
                            <div className="flex justify-between">
                                <span className={`font-semibold line-clamp-1 ${t.status === 'CLOSED' ? 'text-slate-500' : 'text-slate-900'}`}>{t.title}</span>
                                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}
                                </span>
                            </div>
                            <div className="mt-1 text-sm text-slate-600 flex justify-between items-center">
                                <span>{t.creatorName || t.internName}</span>
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${t.status === "OPEN" ? "bg-green-100 text-green-700" :
                                    t.status === "RESOLVED" ? "bg-blue-100 text-blue-700" :
                                        "bg-slate-100 text-slate-700"
                                    }`}>
                                    {t.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail */}
            <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {!selectedTicket ? (
                    <div className="flex h-full items-center justify-center text-slate-500">
                        Chọn một yêu cầu để xem chi tiết
                    </div>
                ) : (
                    <div className="flex h-full flex-col">
                        <div className="mb-4 border-b border-slate-200 pb-4">
                            <h2 className="text-xl font-bold text-slate-900">{selectedTicket.title}</h2>
                            <div className="mt-2 flex gap-4 text-sm text-slate-600">
                                <span>Intern: <span className="font-medium text-slate-900">{selectedTicket.creatorName || selectedTicket.internName}</span></span>
                                <span>Category: <span className="font-medium text-slate-900">{selectedTicket.category}</span></span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 bg-slate-50 p-4 rounded-lg">
                            {/* Original Content */}
                            <div className="flex flex-col gap-1">
                                <div className="self-start rounded-xl rounded-tl-none bg-white border border-slate-200 px-4 py-2 text-sm text-slate-800 shadow-sm max-w-[80%]">
                                    <div className="mb-1 text-xs font-bold text-slate-500">Yêu cầu gốc</div>
                                    {selectedTicket.content}
                                </div>
                                <span className="self-start text-xs text-slate-400">{selectedTicket.creatorName} • {selectedTicket.createdAt}</span>
                            </div>

                            {/* Messages */}
                            {comments.map((c, idx) => (
                                <div key={idx} className={`flex flex-col gap-1 ${c.authorId !== selectedTicket.createdBy?.id ? 'items-end' : 'items-start'}`}>
                                    <div className={`rounded-xl px-4 py-2 text-sm max-w-[80%] shadow-sm ${c.authorId !== selectedTicket.createdBy?.id
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                                        }`}>
                                        <div className={`mb-1 text-xs font-bold ${c.authorId !== selectedTicket.createdBy?.id ? 'text-blue-200' : 'text-slate-500'}`}>
                                            {c.authorName}
                                        </div>
                                        {c.content}
                                    </div>
                                    <span className="text-xs text-slate-400">{c.createdAt}</span>
                                </div>
                            ))}
                        </div>

                        {selectedTicket.status !== 'CLOSED' && (
                            <div className="mt-4 border-t border-slate-200 pt-4">
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none"
                                    rows={3}
                                    placeholder="Nhập phản hồi..."
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleReply();
                                        }
                                    }}
                                />
                                <div className="mt-3 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={selectedTicket.status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                if (confirm(`Đổi trạng thái thành ${newStatus}?`)) {
                                                    try {
                                                        await ticketApi.updateStatus(selectedTicket.id, newStatus);
                                                        toast.success("Đã cập nhật trạng thái");

                                                        // Update local state
                                                        const updatedTicket = { ...selectedTicket, status: newStatus };
                                                        setSelectedTicket(updatedTicket);
                                                        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
                                                    } catch (error) {
                                                        toast.error("Lỗi cập nhật trạng thái");
                                                    }
                                                }
                                            }}
                                            className="rounded-lg border border-slate-300 px-2 py-2 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="OPEN">OPEN</option>
                                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                                            <option value="RESOLVED">RESOLVED</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </select>
                                        <div className="text-xs text-slate-400">Nhấn Enter để gửi phản hồi</div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleReply}
                                            disabled={!reply.trim()}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Gửi phản hồi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedTicket.status === 'CLOSED' && (
                            <div className="mt-4 border-t border-slate-200 pt-4 text-center text-slate-500 bg-slate-50 rounded-lg py-3">
                                Yêu cầu này đã bị đóng.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
