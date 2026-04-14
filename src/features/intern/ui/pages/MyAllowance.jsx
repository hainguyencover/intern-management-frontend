import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { allowanceApi } from "@/api/allowanceApi";

export default function MyAllowance() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await allowanceApi.getMyHistory();
            setHistory(res.data.content || []);
        } catch (error) {
            toast.error("Không tải được lịch sử phụ cấp");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Phụ cấp thực tập
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Lịch sử nhận phụ cấp hàng tháng
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Tháng</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Số tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Ngày nhận</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Đang tải...</td></tr>
                        ) : history.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-500">Chưa có dữ liệu phụ cấp</td></tr>
                        ) : history.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{item.allowanceMonth}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{item.paymentDate || "-"}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.status === 'PAID'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                    {item.notes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
