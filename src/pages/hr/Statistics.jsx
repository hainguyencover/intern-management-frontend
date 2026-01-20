import React, { useEffect, useState } from "react";
import { internApi } from "../../api/internApi";
import { toast } from "sonner";
import { PieChart, BarChart, Activity } from "lucide-react";
import { reportApi } from "../../api/reportApi";

export default function Statistics() {
    const [statsUni, setStatsUni] = useState([]);
    const [statsMajor, setStatsMajor] = useState([]);
    const [statsAssess, setStatsAssess] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resUni, resMajor, resAssess] = await Promise.all([
                    internApi.getStatsUniversity(),
                    internApi.getStatsMajor(),
                    reportApi.getStatsAssessment(),
                ]);
                setStatsUni(resUni.data);
                setStatsMajor(resMajor.data);
                setStatsAssess(resAssess.data);
            } catch (err) {
                toast.error("Không thể tải báo cáo thống kê");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Đang tải báo cáo...</div>;
    }

    // Helper for assessment color
    const getAssessColor = (key) => {
        if (["Xuất sắc", "Giỏi"].includes(key)) return "bg-emerald-100 text-emerald-800";
        if (key === "Khá") return "bg-blue-100 text-blue-800";
        if (key === "Trung bình") return "bg-yellow-100 text-yellow-800";
        if (key === "Yếu") return "bg-red-100 text-red-800";
        return "bg-slate-100 text-slate-800";
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Activity className="text-indigo-600" />
                    Thống kê Tổng quan
                </h1>
                <p className="mt-1 text-sm text-slate-600">Phân tích dữ liệu thực tập sinh theo trường, chuyên ngành và kết quả</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Stats by University */}
                <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-blue-600" />
                        <h2 className="font-bold text-slate-800">Theo Trường Đại Học</h2>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-white border-b">
                            <tr>
                                <th className="px-6 py-3">Trường</th>
                                <th className="px-6 py-3 text-right">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {statsUni.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-700">{item.key}</td>
                                    <td className="px-6 py-3 text-right">
                                        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 min-w-[2rem] px-2 py-0.5 text-blue-800 text-xs font-bold">
                                            {item.count}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {statsUni.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-6 text-center text-slate-500 italic">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Stats by Major */}
                <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-emerald-600" />
                        <h2 className="font-bold text-slate-800">Theo Chuyên Ngành</h2>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-white border-b">
                            <tr>
                                <th className="px-6 py-3">Ngành</th>
                                <th className="px-6 py-3 text-right">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {statsMajor.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-700">{item.key}</td>
                                    <td className="px-6 py-3 text-right">
                                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 min-w-[2rem] px-2 py-0.5 text-emerald-800 text-xs font-bold">
                                            {item.count}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {statsMajor.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-6 text-center text-slate-500 italic">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Stats by Assessment */}
                <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-purple-600" />
                        <h2 className="font-bold text-slate-800">Kết Quả Đánh Giá</h2>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-white border-b">
                            <tr>
                                <th className="px-6 py-3">Xếp loại</th>
                                <th className="px-6 py-3 text-right">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {statsAssess.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-700">{item.key}</td>
                                    <td className="px-6 py-3 text-right">
                                        <span className={`inline-flex items-center justify-center rounded-full min-w-[2rem] px-2 py-0.5 text-xs font-bold ${getAssessColor(item.key)}`}>
                                            {item.count}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {statsAssess.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-6 text-center text-slate-500 italic">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
