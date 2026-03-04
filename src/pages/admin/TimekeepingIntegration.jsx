import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";
import {
    QrCode,
    RefreshCw,
    Upload,
    Smartphone,
    History,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Database,
    Network
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

export default function TimekeepingIntegration() {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    const handleSimulateFile = () => {
        const now = new Date();
        const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

        const mockData = [
            { employeeCode: "NV001", timestamp: fourHoursAgo.toISOString(), deviceId: "GATE_01" },
            { employeeCode: "NV002", timestamp: new Date(fourHoursAgo.getTime() + 10 * 60000).toISOString(), deviceId: "GATE_01" },
            { employeeCode: "NV001", timestamp: now.toISOString(), deviceId: "GATE_01" },
        ];
        setLogs(mockData);
        toast.info("Đã tải dữ liệu mẫu thành công.");
    };

    const handleSync = async () => {
        if (logs.length === 0) {
            toast.warning("Không có dữ liệu để đồng bộ.");
            return;
        }
        try {
            setLoading(true);
            const res = await axiosClient.post("/api/v1/admin/attendance/sync/qr", logs);
            toast.success(`Đồng bộ thành công ${res.data} bản ghi.`);
            setLogs([]);
        } catch (error) {
            toast.error("Đồng bộ thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <QrCode className="h-10 w-10 text-primary" />
                        Tích hợp Chấm công
                    </h1>
                    <p className="text-slate-500 font-medium">Hệ thống đồng bộ dữ liệu tập trung từ các thiết bị IoT và Log file.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <Badge variant="outline" className="h-10 px-4 rounded-xl border-emerald-100 bg-emerald-50 text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2">
                        <Network className="h-4 w-4" /> Node Active
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Connection Config */}
                <Card className="lg:col-span-1 border-none shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col">
                    <CardHeader className="bg-slate-900 text-white pb-8">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-primary" />
                            Cấu hình Thiết bị
                        </CardTitle>
                        <CardDescription className="text-slate-400">Kết nối trực tiếp tới máy chấm công vật lý.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 flex-grow">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">IP Address</label>
                            <Input placeholder="192.168.1.201" className="h-12 border-slate-200 bg-slate-50 focus:bg-white transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Port</label>
                            <Input placeholder="4370" className="h-12 border-slate-200 bg-slate-50 focus:bg-white transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secret Access Key</label>
                            <Input type="password" placeholder="••••••••" className="h-12 border-slate-200 bg-slate-50 focus:bg-white transition-all" />
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                            <p className="text-xs font-medium text-amber-700 leading-relaxed">
                                Vui lòng đảm bảo thiết bị đang cùng lớp mạng với máy chủ ứng dụng trước khi kích hoạt.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 border-t bg-slate-50/50 mt-auto">
                        <Button variant="outline" disabled className="w-full h-12 rounded-xl text-slate-400 italic">
                            Tính năng sắp ra mắt
                        </Button>
                    </CardFooter>
                </Card>

                {/* Upload & Sync */}
                <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <CardHeader className="pb-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Database className="h-5 w-5 text-indigo-500" />
                                    Đồng bộ Log Data
                                </CardTitle>
                                <CardDescription>Tải lên tệp CSV/Excel từ máy chấm công để đồng bộ thủ công.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleSimulateFile} className="h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold">
                                <History className="mr-2 h-4 w-4" /> Tải mẫu
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-8">
                        <div className="group relative border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/50 hover:bg-white hover:border-primary transition-all duration-300">
                            <Upload className="mx-auto h-12 w-12 text-slate-300 group-hover:text-primary transition-colors mb-4" />
                            <h3 className="text-base font-bold text-slate-900">Kéo thả file log quan trọng vào đây</h3>
                            <p className="text-sm text-slate-400 mt-2">Định dạng hỗ trợ: .CSV, .XLSX (Tối đa 50MB)</p>
                        </div>

                        {logs.length > 0 && (
                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                            <Database className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900">Dữ liệu sẵn sàng</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{logs.length} bản ghi chờ đồng bộ</p>
                                        </div>
                                    </div>
                                    <Button
                                        disabled={loading}
                                        onClick={handleSync}
                                        className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-bold"
                                    >
                                        {loading ? (
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                        )}
                                        {loading ? "Đang xử lý..." : "Đồng bộ ngay"}
                                    </Button>
                                </div>

                                <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-slate-50/80">
                                            <TableRow>
                                                <TableHead className="font-bold text-slate-600">Đối tượng</TableHead>
                                                <TableHead className="font-bold text-slate-600">Thời gian</TableHead>
                                                <TableHead className="font-bold text-slate-600 text-right">Mã Thiết bị</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {logs.map((log, i) => (
                                                <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">EM</div>
                                                            <span className="font-bold text-slate-700">{log.employeeCode}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-slate-500 font-medium">
                                                        {new Date(log.timestamp).toLocaleString("vi-VN", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-mono text-[10px]">
                                                            {log.deviceId}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
