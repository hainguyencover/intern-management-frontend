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

    const [form, setForm] = useState({
        title: "",
        category: "CERTIFICATE",
        priority: "MEDIUM",
        content: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await ticketApi.getMyTickets();
            setTickets(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được dữ liệu yêu cầu hỗ trợ");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (form.title.trim().length < 5) {
            toast.error("Tiêu đề phải từ 5 ký tự trở lên");
            return;
        }
        if (form.content.trim().length < 10) {
            toast.error("Mô tả chi tiết phải từ 10 ký tự trở lên");
            return;
        }

        try {
            await ticketApi.create(form);
            toast.success("Đã gửi yêu cầu hỗ trợ thành công");
            setOpenModal(false);
            setForm({ title: "", category: "CERTIFICATE", priority: "MEDIUM", content: "" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Tạo yêu cầu thất bại");
        }
    };

    const openDetail = async (ticket) => {
        try {
            const detailRes = await ticketApi.getById(ticket.id);
            const detail = detailRes.data;
            setSelectedTicket(detail);
            setDetailModal(true);

            const commentsRes = await ticketApi.getComments(ticket.id);
            setComments(commentsRes.data || []);
        } catch (e) {
            toast.error("Không thể lấy chi tiết yêu cầu");
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        try {
            await ticketApi.reply(selectedTicket.id, replyContent);
            toast.success("Đã gửi phản hồi");
            setReplyContent("");
            const res = await ticketApi.getComments(selectedTicket.id);
            setComments(res.data || []);
        } catch (e) {
            toast.error("Gửi phản hồi thất bại");
        }
    };

    const handleConfirmClose = async () => {
        try {
            await ticketApi.close(selectedTicket.id);
            toast.success("Đã xác nhận hoàn tất yêu cầu");
            setDetailModal(false);
            loadData();
        } catch (e) {
            toast.error("Không thể đóng yêu cầu");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "OPEN":
                return <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Chờ tiếp nhận</span>;
            case "IN_PROGRESS":
                return <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">Đang xử lý</span>;
            case "RESOLVED":
                return <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Đã xử lý</span>;
            case "CLOSED":
                return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">Đã hoàn thành</span>;
            default:
                return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">{status}</span>;
        }
    };

    const getSlaBadge = (slaStatus) => {
        if (slaStatus === "OVERDUE") {
            return <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">Quá SLA 3 ngày</span>;
        }
        if (slaStatus === "AT_RISK") {
            return <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">Sắp hết hạn SLA</span>;
        }
        return <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Trong thời hạn (3 ngày)</span>;
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Yêu cầu hỗ trợ & Quyền lợi (US-027 / US-028)
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gửi yêu cầu xác nhận, giấy tờ, phụ cấp hoặc thắc mắc quá trình thực tập
                    </p>
                </div>
                <button
                    onClick={() => setOpenModal(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
                >
                    + Tạo yêu cầu hỗ trợ mới
                </button>
            </div>

            {/* List Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Mã YC</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Mức ưu tiên</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Ngày gửi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {tickets.map((t) => (
                            <tr key={t.id} className="cursor-pointer hover:bg-slate-50 transition" onClick={() => openDetail(t)}>
                                <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{t.ticketCode || `SUP-${t.id}`}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{t.title}</td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-600">{t.category}</td>
                                <td className="px-6 py-4 text-xs">
                                    <span className={`font-semibold ${t.priority === 'HIGH' || t.priority === 'URGENT' ? 'text-rose-600' : 'text-slate-600'}`}>
                                        {t.priority || 'MEDIUM'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">{t.createdAt ? new Date(t.createdAt).toLocaleDateString("vi-VN") : "-"}</td>
                            </tr>
                        ))}
                        {tickets.length === 0 && !loading && (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">Chưa có yêu cầu hỗ trợ nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Tạo yêu cầu hỗ trợ</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Loại yêu cầu *</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="CERTIFICATE">Giấy xác nhận thực tập / Dấu mộc</option>
                                    <option value="DOCUMENT">Chứng nhận / Giấy tờ hồ sơ</option>
                                    <option value="INTERNSHIP_CONFIRMATION">Xác nhận doanh nghiệp</option>
                                    <option value="ALLOWANCE">Phụ cấp / Lương thực tập</option>
                                    <option value="ATTENDANCE">Điểm danh / Chấm công</option>
                                    <option value="LEAVE">Xin nghỉ phép</option>
                                    <option value="CONTRACT">Hợp đồng thực tập</option>
                                    <option value="ACCOUNT">Tài khoản / Hệ thống</option>
                                    <option value="TECHNICAL">Kỹ thuật</option>
                                    <option value="ACADEMIC">Học tập / Đồ án</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Mức độ ưu tiên</label>
                                <select
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                >
                                    <option value="LOW">Thấp (Chưa gấp)</option>
                                    <option value="MEDIUM">Bình thường (Tiêu chuẩn 3 ngày làm việc)</option>
                                    <option value="HIGH">Cao (Cần xử lý gấp trong 1 ngày)</option>
                                    <option value="URGENT">Khẩn cấp</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Tiêu đề *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    required
                                    placeholder="VD: Xin cấp giấy xác nhận thực tập nộp về trường"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Nội dung chi tiết *</label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    rows={4}
                                    required
                                    placeholder="Nêu rõ thông tin chi tiết vấn đề bạn đang cần HR xử lý..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow"
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
                    <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="border-b border-slate-200 p-5 bg-slate-50 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-bold text-blue-600">{selectedTicket.ticketCode}</span>
                                    {getStatusBadge(selectedTicket.status)}
                                    {getSlaBadge(selectedTicket.slaStatus)}
                                </div>
                                <h3 className="mt-1 text-lg font-bold text-slate-900">{selectedTicket.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Danh mục: <span className="font-semibold">{selectedTicket.category}</span> • Phân công HR: <span className="font-semibold">{selectedTicket.assignedToName || "Chưa phân công"}</span>
                                </p>
                            </div>
                            <button onClick={() => setDetailModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                        </div>

                        {/* Content & Timeline */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                            {/* Request Details */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nội dung yêu cầu</h4>
                                <p className="text-sm text-slate-800 whitespace-pre-wrap">{selectedTicket.content}</p>
                            </div>

                            {/* Resolution Box if Resolved */}
                            {selectedTicket.resolution && (
                                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-sm">
                                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Phương án xử lý từ HR</h4>
                                    <p className="text-sm font-medium">{selectedTicket.resolution}</p>
                                    {selectedTicket.status === "RESOLVED" && (
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={handleConfirmClose}
                                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow"
                                            >
                                                ✓ Xác nhận hài lòng & Đóng yêu cầu
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Conversation List */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lịch sử trao đổi</h4>
                                {comments.map((c, idx) => (
                                    <div key={idx} className={`flex flex-col gap-1 ${c.authorId === selectedTicket.createdById ? 'items-end' : 'items-start'}`}>
                                        <div className={`rounded-xl px-4 py-2.5 text-sm max-w-[85%] shadow-sm ${c.authorId === selectedTicket.createdById ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                                            <div className="mb-1 text-xs font-bold opacity-80">{c.authorName}</div>
                                            <div>{c.content}</div>
                                        </div>
                                        <span className="text-xs text-slate-400">{c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : ""}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reply Box */}
                        {selectedTicket.status !== "CLOSED" && (
                            <div className="border-t border-slate-200 p-4 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        placeholder="Nhập nội dung phản hồi cho HR..."
                                        value={replyContent}
                                        onChange={e => setReplyContent(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleReply()}
                                    />
                                    <button
                                        onClick={handleReply}
                                        disabled={!replyContent.trim()}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow"
                                    >
                                        Gửi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
