import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ticketApi } from "@/api/ticketApi";

export default function HRSupportTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [detailModal, setDetailModal] = useState(false);
    const [resolveModal, setResolveModal] = useState(false);
    const [resolutionText, setResolutionText] = useState("");
    const [comments, setComments] = useState([]);
    const [replyContent, setReplyContent] = useState("");
    const [isInternalNote, setIsInternalNote] = useState(false);

    // Filters
    const [filterStatus, setFilterStatus] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterOverdue, setFilterOverdue] = useState(false);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadData();
    }, [filterStatus, filterCategory, filterOverdue]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterStatus) params.status = filterStatus;
            if (filterCategory) params.category = filterCategory;
            if (filterOverdue) params.overdue = true;
            if (keyword) params.keyword = keyword;

            const res = await ticketApi.getAllTickets(params);
            setTickets(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được danh sách ticket cho HR");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadData();
    };

    const openDetail = async (ticket) => {
        try {
            const detailRes = await ticketApi.getById(ticket.id);
            setSelectedTicket(detailRes.data);
            setDetailModal(true);

            const commentsRes = await ticketApi.getComments(ticket.id);
            setComments(commentsRes.data || []);
        } catch (e) {
            toast.error("Không thể tải chi tiết yêu cầu");
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        try {
            await ticketApi.reply(selectedTicket.id, replyContent, isInternalNote);
            toast.success(isInternalNote ? "Đã thêm ghi chú nội bộ HR" : "Đã phản hồi cho thực tập sinh");
            setReplyContent("");
            const res = await ticketApi.getComments(selectedTicket.id);
            setComments(res.data || []);
        } catch (e) {
            toast.error("Không thể gửi phản hồi");
        }
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        if (!resolutionText.trim() || resolutionText.trim().length < 5) {
            toast.error("Nội dung giải quyết phải từ 5 ký tự trở lên");
            return;
        }

        try {
            await ticketApi.resolve(selectedTicket.id, resolutionText);
            toast.success("Đã đánh dấu giải quyết yêu cầu thành công");
            setResolveModal(false);
            setResolutionText("");
            setDetailModal(false);
            loadData();
        } catch (e) {
            toast.error(e.response?.data?.message || "Không thể resolve ticket");
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await ticketApi.updateStatus(selectedTicket.id, newStatus);
            toast.success(`Đã cập nhật trạng thái sang ${newStatus}`);
            const detailRes = await ticketApi.getById(selectedTicket.id);
            setSelectedTicket(detailRes.data);
            loadData();
        } catch (e) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    // Calculate quick KPIs
    const totalCount = tickets.length;
    const openCount = tickets.filter(t => t.status === "OPEN").length;
    const inProgressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;
    const overdueCount = tickets.filter(t => t.slaStatus === "OVERDUE").length;

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Quản lý Yêu cầu Hỗ trợ HR (US-027 / US-028 Console)
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Tiếp nhận, phân công, xử lý và đảm bảo SLA 3 ngày làm việc cho thực tập sinh
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Tổng yêu cầu</span>
                    <div className="mt-2 text-2xl font-extrabold text-slate-900">{totalCount}</div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                    <span className="text-xs font-semibold text-amber-700 uppercase">Chờ tiếp nhận (OPEN)</span>
                    <div className="mt-2 text-2xl font-extrabold text-amber-800">{openCount}</div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                    <span className="text-xs font-semibold text-blue-700 uppercase">Đang xử lý (IN_PROGRESS)</span>
                    <div className="mt-2 text-2xl font-extrabold text-blue-800">{inProgressCount}</div>
                </div>
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
                    <span className="text-xs font-semibold text-rose-700 uppercase">Quá hạn SLA 3 ngày</span>
                    <div className="mt-2 text-2xl font-extrabold text-rose-800">{overdueCount}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Tìm theo Mã ticket (SUP-xxx), Tiêu đề, Nội dung..."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button type="submit" className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">
                        Tìm kiếm
                    </button>
                </form>

                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">-- Trạng thái --</option>
                    <option value="OPEN">Chờ tiếp nhận (OPEN)</option>
                    <option value="IN_PROGRESS">Đang xử lý (IN_PROGRESS)</option>
                    <option value="RESOLVED">Đã xử lý (RESOLVED)</option>
                    <option value="CLOSED">Đã hoàn thành (CLOSED)</option>
                </select>

                <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                    <option value="">-- Danh mục --</option>
                    <option value="CERTIFICATE">Xác nhận / Dấu mộc</option>
                    <option value="DOCUMENT">Chứng nhận</option>
                    <option value="ALLOWANCE">Phụ cấp</option>
                    <option value="LEAVE">Xin nghỉ phép</option>
                    <option value="CONTRACT">Hợp đồng</option>
                    <option value="TECHNICAL">Kỹ thuật</option>
                </select>

                <label className="flex items-center gap-2 text-sm font-semibold text-rose-700 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filterOverdue}
                        onChange={e => setFilterOverdue(e.target.checked)}
                        className="rounded text-rose-600"
                    />
                    Chỉ ticket quá SLA
                </label>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Mã Ticket</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Thực tập sinh</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">SLA 3 Ngày</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {tickets.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{t.ticketCode}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{t.creatorName}</td>
                                <td className="px-6 py-4 text-sm text-slate-800">{t.title}</td>
                                <td className="px-6 py-4 text-xs text-slate-600">{t.category}</td>
                                <td className="px-6 py-4 text-xs">
                                    {t.slaStatus === 'OVERDUE' ? (
                                        <span className="rounded bg-rose-100 px-2 py-0.5 font-bold text-rose-700">Quá SLA</span>
                                    ) : (
                                        <span className="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">Đúng hạn</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold ${t.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                                        t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                            t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    <button
                                        onClick={() => openDetail(t)}
                                        className="rounded bg-blue-50 px-3 py-1 font-semibold text-blue-600 hover:bg-blue-100"
                                    >
                                        Xem & Xử lý
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal for HR */}
            {detailModal && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="border-b border-slate-200 p-5 bg-slate-50 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-bold text-blue-600">{selectedTicket.ticketCode}</span>
                                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">{selectedTicket.status}</span>
                                </div>
                                <h3 className="mt-1 text-lg font-bold text-slate-900">{selectedTicket.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Thực tập sinh: <span className="font-semibold">{selectedTicket.creatorName}</span> • Phân công: <span className="font-semibold">{selectedTicket.assignedToName || "Chưa phân công"}</span>
                                </p>
                            </div>
                            <button onClick={() => setDetailModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                            {/* Actions Bar */}
                            <div className="flex flex-wrap items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-sm gap-2">
                                <div className="flex gap-2">
                                    {selectedTicket.status === 'OPEN' && (
                                        <button
                                            onClick={() => handleUpdateStatus('IN_PROGRESS')}
                                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow"
                                        >
                                            ► Tiếp nhận xử lý (IN_PROGRESS)
                                        </button>
                                    )}
                                    {selectedTicket.status !== 'RESOLVED' && selectedTicket.status !== 'CLOSED' && (
                                        <button
                                            onClick={() => setResolveModal(true)}
                                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow"
                                        >
                                            ✓ Giải quyết yêu cầu (RESOLVED)
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Ticket Request Text */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chi tiết từ thực tập sinh</h4>
                                <p className="text-sm text-slate-800 whitespace-pre-wrap">{selectedTicket.content}</p>
                            </div>

                            {/* Existing Resolution */}
                            {selectedTicket.resolution && (
                                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
                                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Kết quả xử lý đã công bố</h4>
                                    <p className="text-sm">{selectedTicket.resolution}</p>
                                </div>
                            )}

                            {/* Comments & HR Notes */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử trao đổi & Ghi chú HR</h4>
                                {comments.map((c, idx) => (
                                    <div key={idx} className={`flex flex-col gap-1 ${c.isInternal ? 'items-center' : 'items-start'}`}>
                                        <div className={`rounded-xl px-4 py-2.5 text-sm w-full max-w-[90%] shadow-sm ${c.isInternal ? 'bg-amber-50 border border-amber-300 text-amber-900' : 'bg-white border border-slate-200 text-slate-800'}`}>
                                            <div className="mb-1 flex justify-between text-xs font-bold opacity-80">
                                                <span>{c.authorName}</span>
                                                {c.isInternal && <span className="text-amber-700 font-extrabold">[Ghi chú nội bộ HR]</span>}
                                            </div>
                                            <div>{c.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reply / Internal note area */}
                        <div className="border-t border-slate-200 p-4 bg-white space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-amber-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isInternalNote}
                                        onChange={e => setIsInternalNote(e.target.checked)}
                                        className="rounded text-amber-600"
                                    />
                                    Ghi chú nội bộ HR (Thực tập sinh không nhìn thấy)
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder={isInternalNote ? "Nhập ghi chú trao đổi nội bộ cho phòng HR..." : "Phản hồi thông tin cho Thực tập sinh..."}
                                    value={replyContent}
                                    onChange={e => setReplyContent(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleReply()}
                                />
                                <button
                                    onClick={handleReply}
                                    disabled={!replyContent.trim()}
                                    className={`rounded-lg px-4 py-2 text-sm font-bold text-white shadow disabled:opacity-50 ${isInternalNote ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isInternalNote ? 'Lưu ghi chú' : 'Gửi phản hồi'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resolve Modal */}
            {resolveModal && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Đưa ra phương án giải quyết (Resolve Ticket)</h3>
                        <form onSubmit={handleResolve} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Mô tả phương án / kết quả xử lý *</label>
                                <textarea
                                    value={resolutionText}
                                    onChange={e => setResolutionText(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                                    rows={4}
                                    required
                                    placeholder="VD: Đã duyệt và cấp giấy xác nhận thực tập. File đính kèm đã gửi qua thư điện tử."
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <button
                                    type="button"
                                    onClick={() => setResolveModal(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 shadow"
                                >
                                    Hoàn thành Resolve
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
