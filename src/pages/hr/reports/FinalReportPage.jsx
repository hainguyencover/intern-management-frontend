import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reportApi } from "../../../api/reportApi";
import { Printer, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function FinalReportPage() {
    const { internId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await reportApi.getFinalReport(internId);
                setData(res.data);
            } catch (err) {
                toast.error("Không thể tải báo cáo tổng kết");
            } finally {
                setLoading(false);
            }
        };
        if (internId) fetchData();
    }, [internId]);

    if (loading) return <div className="p-12 text-center">Đang tải báo cáo...</div>;
    if (!data) return <div className="p-12 text-center">Không tìm thấy dữ liệu</div>;

    return (
        <div className="min-h-screen bg-slate-100 p-8 print:bg-white print:p-0">
            {/* Toolbar - Hidden when printing */}
            <div className="mx-auto mb-6 flex max-w-[210mm] items-center justify-between print:hidden">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        <Printer className="h-4 w-4" /> In báo cáo / Lưu PDF
                    </button>
                </div>
            </div>

            {/* A4 Page Container */}
            <div className="mx-auto min-h-[297mm] w-[210mm] bg-white p-[20mm] shadow-xl print:min-h-0 print:w-full print:shadow-none">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h3 className="text-sm uppercase font-semibold text-slate-500">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
                    <h4 className="text-sm font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4">Độc lập - Tự do - Hạnh phúc</h4>

                    <div className="mt-8">
                        <h1 className="text-2xl font-bold uppercase text-slate-900">BÁO CÁO TỔNG KẾT THỰC TẬP</h1>
                        <p className="mt-2 text-sm text-slate-500">Hệ thống quản lý thực tập sinh CodeGym</p>
                    </div>
                </div>

                {/* Intern Info */}
                <div className="mb-8 rounded-xl border border-slate-100 bg-slate-50 p-6 print:border-slate-200 print:bg-white">
                    <h2 className="mb-4 text-lg font-bold text-slate-800 border-b pb-2">I. THÔNG TIN THỰC TẬP SINH</h2>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <p><span className="font-semibold text-slate-600">Họ và tên:</span> {data.fullName}</p>
                        <p><span className="font-semibold text-slate-600">Mã sinh viên:</span> {data.studentCode}</p>
                        <p><span className="font-semibold text-slate-600">Trường:</span> {data.university}</p>
                        <p><span className="font-semibold text-slate-600">Chuyên ngành:</span> {data.major}</p>
                        <p><span className="font-semibold text-slate-600">Thời gian:</span> {data.startDate} - {data.endDate}</p>
                        <p><span className="font-semibold text-slate-600">Mentor hướng dẫn:</span> {data.mentorName}</p>
                    </div>
                </div>

                {/* Score & Assessment */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-bold text-slate-800 border-b pb-2">II. KẾT QUẢ ĐÁNH GIÁ</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-6 text-center print:border-slate-200 print:bg-white">
                            <p className="text-sm font-medium text-slate-600">Điểm trung bình</p>
                            <p className="mt-2 text-4xl font-bold text-indigo-700 print:text-black">{data.finalScore}</p>
                            <p className="mt-1 text-xs text-slate-500">Thang điểm 10</p>
                        </div>
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 text-center print:border-slate-200 print:bg-white">
                            <p className="text-sm font-medium text-slate-600">Xếp loại</p>
                            <p className="mt-2 text-3xl font-bold text-emerald-700 uppercase print:text-black">{data.finalAssessment}</p>
                        </div>
                    </div>

                    {/* Evaluations Detail */}
                    <div className="mt-6">
                        <h3 className="mb-2 font-semibold text-slate-700">Chi tiết các đánh giá:</h3>
                        {data.evaluations && data.evaluations.length > 0 ? (
                            <table className="w-full text-left text-sm border-collapse border border-slate-200">
                                <thead>
                                    <tr className="bg-slate-50 print:bg-slate-100">
                                        <th className="border border-slate-200 p-2">Giai đoạn</th>
                                        <th className="border border-slate-200 p-2 text-center w-20">Điểm</th>
                                        <th className="border border-slate-200 p-2">Nhận xét</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.evaluations.map((e, idx) => (
                                        <tr key={idx}>
                                            <td className="border border-slate-200 p-2">{e.period}</td>
                                            <td className="border border-slate-200 p-2 text-center font-bold">{e.score}</td>
                                            <td className="border border-slate-200 p-2 italic text-slate-600">{e.comment}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm italic text-slate-500">Chưa có đánh giá nào.</p>
                        )}
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="mb-8">
                    <h2 className="mb-4 text-lg font-bold text-slate-800 border-b pb-2">III. TỔNG HỢP HOẠT ĐỘNG</h2>
                    <p className="mb-3 text-sm">Tổng số báo cáo tuần đã nộp: <span className="font-bold">{data.totalReports}</span></p>

                    {data.weeklyReports && data.weeklyReports.length > 0 && (
                        <table className="w-full text-left text-sm border-collapse border border-slate-200">
                            <thead>
                                <tr className="bg-slate-50 print:bg-slate-100">
                                    <th className="border border-slate-200 p-2 w-16 text-center">Tuần</th>
                                    <th className="border border-slate-200 p-2">Công việc đã làm</th>
                                    <th className="border border-slate-200 p-2">Kết quả/Bài học</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.weeklyReports.map((r, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-slate-200 p-2 text-center">{r.weekNumber}</td>
                                        <td className="border border-slate-200 p-2 text-xs">
                                            <div className="line-clamp-3 print:line-clamp-none whitespace-pre-line">{r.completedWork}</div>
                                        </td>
                                        <td className="border border-slate-200 p-2 text-xs">
                                            <div className="line-clamp-3 print:line-clamp-none whitespace-pre-line">{r.learnings}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Signatures */}
                <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm">
                    <div>
                        <p className="font-bold uppercase text-slate-700">Người lập báo cáo</p>
                        <p className="text-xs text-slate-500 italic">(Ký và ghi rõ họ tên)</p>
                        <div className="h-24"></div>
                        <p className="font-semibold">{data.fullName}</p>
                    </div>
                    <div>
                        <p className="font-bold uppercase text-slate-700">Xác nhận của Mentor/HR</p>
                        <p className="text-xs text-slate-500 italic">(Ký và đóng dấu)</p>
                        <div className="h-24"></div>
                        <p className="font-semibold">{data.mentorName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
