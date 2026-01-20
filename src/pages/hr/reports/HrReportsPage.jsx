import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportApi } from "../../../api/reportApi";
import { FileText, Search, Download } from "lucide-react";
import { toast } from "sonner";

export default function HrReportsPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await reportApi.getReportsSummary();
                setReports(res.data || []);
            } catch (err) {
                toast.error("Không thể tải danh sách báo cáo");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(r =>
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.studentCode.toLowerCase().includes(search.toLowerCase()) ||
        (r.mentorName && r.mentorName.toLowerCase().includes(search.toLowerCase()))
    );

    const handleExport = () => {
        if (filteredReports.length === 0) {
            toast.error("Không có dữ liệu để xuất");
            return;
        }

        const headers = ["Họ và tên", "MSSV", "Trường", "Chuyên ngành", "Mentor", "Số báo cáo", "Điểm TB", "Xếp loại"];
        const csvContent = [
            headers.join(","),
            ...filteredReports.map(item => [
                `"${item.fullName}"`,
                `"${item.studentCode}"`,
                `"${item.university || ""}"`,
                `"${item.major || ""}"`,
                `"${item.mentorName || ""}"`,
                item.reportCount,
                item.finalScore,
                `"${item.finalAssessment}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Bao_cao_thuc_tap_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tổng hợp Báo cáo & Đánh giá</h1>
                    <p className="text-sm text-slate-500">Giám sát kết quả thực tập của tất cả thực tập sinh</p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition-colors"
                >
                    <Download className="h-4 w-4" /> Xuất Excel
                </button>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, MSSV, mentor..."
                        className="w-full max-w-md rounded-xl border pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>


            {
                loading ? (
                    <div className="py-12 text-center text-sm text-slate-600">Đang tải dữ liệu...</div>
                ) : filteredReports.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-600">Không tìm thấy dữ liệu.</div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 font-semibold text-slate-900">
                                <tr>
                                    <th className="px-4 py-3">Thực tập sinh</th>
                                    <th className="px-4 py-3">Trường / Chuyên ngành</th>
                                    <th className="px-4 py-3">Mentor</th>
                                    <th className="px-4 py-3 text-center">Báo cáo tuần</th>
                                    <th className="px-4 py-3 text-center">Điểm TB</th>
                                    <th className="px-4 py-3">Xếp loại</th>
                                    <th className="px-4 py-3 text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredReports.map((item) => (
                                    <tr key={item.internId} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">{item.fullName}</div>
                                            <div className="text-xs text-slate-500">{item.studentCode}</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            <div>{item.university}</div>
                                            <div className="text-xs text-slate-400">{item.major}</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{item.mentorName}</td>
                                        <td className="px-4 py-3 text-center text-slate-600">{item.reportCount}</td>
                                        <td className="px-4 py-3 text-center font-bold text-indigo-600">
                                            {item.finalScore > 0 ? item.finalScore : "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${!item.finalAssessment || item.finalAssessment === "Chưa đánh giá"
                                                ? "bg-slate-100 text-slate-600"
                                                : item.finalAssessment === "Xuất sắc" || item.finalAssessment === "Giỏi"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : item.finalAssessment === "Yếu"
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-blue-50 text-blue-700"
                                                }`}>
                                                {item.finalAssessment}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                to={`/hr/reports/final/${item.internId}`}
                                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                                            >
                                                <FileText className="h-3.5 w-3.5" /> Xem báo cáo
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div >
    );
}
