import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { allowanceApi } from "../../api/allowanceApi";
import { internApi } from "../../api/internApi";
import { formatCurrency } from "../../utils/format";

export default function AllowanceManagement() {
    const [allowances, setAllowances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form data
    const [interns, setInterns] = useState([]);
    const [form, setForm] = useState({
        internId: "",
        amount: "",
        notes: "",
        allowanceMonth: ""
    });

    useEffect(() => {
        loadData();
    }, [month]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Month is YYYY-MM. We need to filter by range or just checking for that month.
            // Backend search accepts monthFrom/monthTo.
            // Let's set start and end of the selected month
            const startDate = `${month}-01`;
            const endDate = `${month}-31`; // Simple approach, backend probably handles date comparison

            const res = await allowanceApi.search({
                monthFrom: startDate,
                monthTo: endDate,
                sort: 'createdAt,desc'
            });
            setAllowances(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được dữ liệu phụ cấp");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = async () => {
        setIsEdit(false);
        setForm({ internId: "", amount: "", notes: "", allowanceMonth: `${month}-01` });
        setShowModal(true);
        // Load interns for dropdown
        try {
            const res = await internApi.search({ size: 1000, sort: 'user.fullName,asc' }); // Increase limit and sort by name
            setInterns(res.data.content || []);
        } catch (e) {
            toast.error("Không tải được danh sách thực tập sinh");
        }
    };

    const handleOpenEdit = (item) => {
        setIsEdit(true);
        setEditId(item.id);
        setForm({
            internId: item.internId, // Not editable but needed for state consistency
            amount: item.amount,
            notes: item.notes || "",
            allowanceMonth: item.allowanceMonth
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // For update, we reuse the DTO structure but ID/Month are ignored by service logic (but required by DTO validation)
                await allowanceApi.updateAllowanceSafe(editId, {
                    ...form,
                    // Ensure required fields for DTO validation are present
                    internId: form.internId || 0,
                    allowanceMonth: form.allowanceMonth || `${month}-01`,
                    amount: parseFloat(form.amount)
                });
                toast.success("Cập nhật thành công");
            } else {
                await allowanceApi.create({
                    ...form,
                    amount: parseFloat(form.amount)
                });
                toast.success("Tạo phụ cấp thành công");
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handlePay = async (id) => {
        if (!confirm("Xác nhận thanh toán khoản phụ cấp này?")) return;
        try {
            await allowanceApi.makePayment(id);
            toast.success("Đã thanh toán");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Thanh toán thất bại");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Quản lý phụ cấp
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Theo dõi và chi trả phụ cấp cho thực tập sinh
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Tạo phụ cấp
                </button>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
                <label className="text-sm font-medium text-slate-700">Chọn tháng:</label>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Intern</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Tháng</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Số tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Ghi chú</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="6" className="p-4 text-center">Đang tải...</td></tr>
                        ) : allowances.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-500">Không có dữ liệu cho tháng này</td></tr>
                        ) : allowances.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{row.internName}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {row.allowanceMonth}
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.amount)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.status === "PAID" ? "bg-green-100 text-green-800" :
                                        "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {row.status}
                                    </span>
                                    {row.status === "PAID" && row.paymentDate && (
                                        <div className="mt-1 text-xs text-slate-500">Paid: {row.paymentDate}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                    {row.notes}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {row.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() => handleOpenEdit(row)}
                                                className="mr-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handlePay(row.id)}
                                                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                                            >
                                                Thanh toán
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {isEdit ? "Cập nhật phụ cấp" : "Tạo phụ cấp mới"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isEdit && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Thực tập sinh</label>
                                    <select
                                        required
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        value={form.internId}
                                        onChange={e => setForm({ ...form, internId: e.target.value })}
                                    >
                                        <option value="">-- Chọn intern --</option>
                                        {interns.map(i => (
                                            <option key={i.id} value={i.id}>
                                                {i.fullName} ({i.studentCode}) - {i.university || 'N/A'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Mức phụ cấp (VND)</label>
                                <input
                                    type="number"
                                    required
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    value={form.amount}
                                    onChange={e => setForm({ ...form, amount: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Tháng áp dụng</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    value={form.allowanceMonth}
                                    onChange={e => setForm({ ...form, allowanceMonth: e.target.value })}
                                    disabled={isEdit} // Usually changing month implies a new record, keep it simple
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Ghi chú</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    rows={3}
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
