import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { attendanceApi } from "@/api/attendanceApi";

export default function AttendancePage() {
    const [todayStatus, setTodayStatus] = useState(null); // { checkedIn: bool, checkedOut: bool, inTime: "", outTime: "" }
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const todayRes = await attendanceApi.getTodayStatus();
            if (todayRes.data) {
                setTodayStatus({
                    checkedIn: true,
                    checkedOut: !!todayRes.data.checkOut,
                    inTime: todayRes.data.checkIn ? new Date(todayRes.data.checkIn).toLocaleTimeString() : "",
                    outTime: todayRes.data.checkOut ? new Date(todayRes.data.checkOut).toLocaleTimeString() : ""
                });
            } else {
                setTodayStatus({ checkedIn: false, checkedOut: false });
            }

            const historyRes = await attendanceApi.getMyAttendance({});
            setLogs(historyRes.data.content || []);

        } catch (error) {
            toast.error("Không tải được dữ liệu chấm công");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!confirm("Xác nhận Check-in?")) return;
        setActionLoading(true);
        try {
            const res = await attendanceApi.checkIn();
            toast.success("Check-in thành công");
            setTodayStatus({
                checkedIn: true,
                checkedOut: false,
                inTime: new Date(res.data.checkIn).toLocaleTimeString(),
                outTime: ""
            });
            fetchData(); // Refresh list
        } catch (error) {
            toast.error("Check-in thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        if (!confirm("Xác nhận Check-out?")) return;
        setActionLoading(true);
        try {
            const res = await attendanceApi.checkOut();
            toast.success("Check-out thành công");
            setTodayStatus(prev => ({
                ...prev,
                checkedOut: true,
                outTime: new Date(res.data.checkOut).toLocaleTimeString()
            }));
            fetchData(); // Refresh list
        } catch (error) {
            toast.error("Check-out thất bại");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Chấm công
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Ghi nhận thời gian làm việc hàng ngày
                </p>
            </div>

            {/* Rules Alert */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                    <div className="flex-shrink-0 text-blue-600">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-sm text-blue-800">
                        <h4 className="font-semibold">Lưu ý về chấm công:</h4>
                        <ul className="mt-1 list-disc space-y-1 pl-4">
                            <li>Giờ làm việc bắt đầu lúc <strong>08:30</strong>. Vui lòng Check-in trước giờ này để được tính là <strong>Đúng giờ (PRESENT)</strong>.</li>
                            <li>Nếu Check-in sau 08:30, hệ thống sẽ ghi nhận là <strong>Đi muộn (LATE)</strong>.</li>
                            <li>Vui lòng nhớ <strong>Check-out</strong> trước khi ra về để hệ thống tính tổng thời gian làm việc.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Status Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                        <div className="text-sm font-medium text-slate-500">Hôm nay</div>
                        <div className="text-3xl font-bold text-slate-900">
                            {new Date().toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
                        <button
                            onClick={handleCheckIn}
                            disabled={todayStatus?.checkedIn || actionLoading}
                            className={`flex min-w-[140px] flex-col items-center justify-center rounded-xl border-2 px-6 py-4 transition ${todayStatus?.checkedIn
                                ? "border-green-200 bg-green-50"
                                : "border-blue-600 bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            <span className={`text-sm font-bold ${todayStatus?.checkedIn ? "text-green-700" : "text-white"}`}>
                                {todayStatus?.checkedIn ? "Đã Check-in" : "CHECK IN"}
                            </span>
                            {todayStatus?.inTime && (
                                <span className="mt-1 text-xs font-semibold text-green-600">{todayStatus.inTime}</span>
                            )}
                        </button>

                        <button
                            onClick={handleCheckOut}
                            disabled={!todayStatus?.checkedIn || todayStatus?.checkedOut || actionLoading}
                            className={`flex min-w-[140px] flex-col items-center justify-center rounded-xl border-2 px-6 py-4 transition ${!todayStatus?.checkedIn
                                ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                                : todayStatus?.checkedOut
                                    ? "border-purple-200 bg-purple-50"
                                    : "border-orange-500 bg-orange-500 hover:bg-orange-600"
                                }`}
                        >
                            <span className={`text-sm font-bold ${todayStatus?.checkedOut ? "text-purple-700" : !todayStatus?.checkedIn ? "text-slate-400" : "text-white"}`}>
                                {todayStatus?.checkedOut ? "Đã Check-out" : "CHECK OUT"}
                            </span>
                            {todayStatus?.outTime && (
                                <span className="mt-1 text-xs font-semibold text-purple-600">{todayStatus.outTime}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* History Log */}
            <div className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-900">Lịch sử chấm công</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Ngày</th>
                                <th className="px-4 py-3 font-semibold">Giờ vào</th>
                                <th className="px-4 py-3 font-semibold">Giờ ra</th>
                                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">{log.date}</td>
                                    <td className="px-4 py-3 font-medium text-green-600">
                                        {log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : "--:--"}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-orange-600">
                                        {log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : "--:--"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${log.status === "PRESENT" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-500">
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
