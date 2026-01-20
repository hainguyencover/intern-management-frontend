import React, { useEffect, useState } from "react";
import { internApi } from "../../api/internApi";
import { toast } from "sonner";

export default function Reports() {
    const [statsUni, setStatsUni] = useState([]);
    const [statsMajor, setStatsMajor] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resUni, resMajor] = await Promise.all([
                    internApi.getStatsUniversity(),
                    internApi.getStatsMajor(),
                ]);
                setStatsUni(resUni.data);
                setStatsMajor(resMajor.data);
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

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Báo cáo Thống kê</h1>
                <p className="mt-1 text-sm text-slate-600">Thống kê phân bổ thực tập sinh</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats by University */}
                <div className="rounded-2xl border bg-white overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b">
                        <h2 className="font-bold text-slate-800">Theo Trường Đại Học</h2>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Trường</th>
                                <th className="px-6 py-3 text-right">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {statsUni.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium">{item.groupName}</td>
                                    <td className="px-6 py-3 text-right">
                                        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-blue-800 text-xs font-bold">
                                            {item.count}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {statsUni.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 text-center text-slate-500">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Stats by Major */}
                <div className="rounded-2xl border bg-white overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b">
                        <h2 className="font-bold text-slate-800">Theo Chuyên Ngành</h2>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Ngành</th>
                                <th className="px-6 py-3 text-right">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {statsMajor.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium">{item.groupName}</td>
                                    <td className="px-6 py-3 text-right">
                                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800 text-xs font-bold">
                                            {item.count}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {statsMajor.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 text-center text-slate-500">
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
